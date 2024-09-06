'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faFileExcel, faComment, faSquareCheck, faCheck, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { format, parse, isBefore } from 'date-fns';
import NavSideEmp from '../components/NavSideEmp';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

import jwtDecode from 'jwt-decode';


const saveAs = (data, fileName) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const url = window.URL.createObjectURL(data);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};


const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  // Subtract 5.5 hours
  date.setHours(date.getHours() - 5);
  date.setMinutes(date.getMinutes() - 30);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
}



const formatDateString = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString).toLocaleDateString(undefined, options);
  return date;
};

const formatDateDisplay = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};



function parseEndTime(endTime) {
  const currentDate = new Date();
  const timeString = format(currentDate, 'yyyy-MM-dd') + ' ' + endTime;
  return parse(timeString, 'yyyy-MM-dd h:mm a', new Date());
}

const ReceivedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [completeImageUrl, setPreviewImageUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(15); // Define tasks to show per page
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const [authenticated, setAuthenticated] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to track the selected task for image upload
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
  const [register, setRegister] = useState(false); // State to manage the visibility of the Add Image button
  const [showAddImageButton, setShowAddImageButton] = useState(false); // State to manage the visibility of the Add Image button
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null); // State variable for error message

  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [remark, setRemark] = useState("");
  const [remarksList, setRemarksList] = useState([]);
  const [empRemarksList, setEmpRemarksList] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % previewImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + previewImages.length) % previewImages.length);
  };


  const fetchRemarks = async (taskId) => {
    try {
      const remarksResponse = await axios.get(
        `http://103.159.85.246:4000/api/task/tasks/${taskId}/remarkToList`
      );
      console.log("Remarks:", remarksResponse.data);
      setRemarksList(remarksResponse.data);

      const empRemarksResponse = await axios.get(
        `http://103.159.85.246:4000/api/task/tasks/${taskId}/empRemarkToList`
      );
      console.log("Employee Remarks:", empRemarksResponse.data);
      setEmpRemarksList(empRemarksResponse.data); // Assuming you have a setter for employee remarks list

    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };


  useEffect(() => {
    if (isRemarkModalOpen && currentTaskId) {
      fetchRemarks(currentTaskId);
    }
  }, [isRemarkModalOpen, currentTaskId]);

  const handleRemarkClick = (taskId) => {
    setCurrentTaskId(taskId);
    setIsRemarkModalOpen(true);
  };

  const handleAddRemark = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://103.159.85.246:4000/api/task/tasks/${currentTaskId}/empRemarkToList`,
        { remark },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      // Close the modal and clear the remark input
      setIsRemarkModalOpen(false);
      setRemark("");
      // Optionally refresh or update tasks
    } catch (error) {
      console.error("Error adding remark:", error);
    }
  };





  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Set the search term as the user types
    setCurrentPage(1); // Reset to the first page when searching
  };

  const calculateSerialNumber = (index) => {
    return index + (currentPage - 1) * tasksPerPage + 1;
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const handleDateSearch = async () => {
    // Convert input dates to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate the date range
    if (end < start) {
      setError('End date cannot be earlier than start date.');
      setTasks([]); // Clear tasks if dates are invalid
      return;
    } else {
      setError(''); // Clear error if dates are valid
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://103.159.85.246:4000/api/task/listTaskEmp', {
        headers: {
          Authorization: token,
        },
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });

      if (response.status === 200) {
        const tasks = response.data.tasks;
        setTasks(tasks);
        setCurrentPage(1); // Reset to the first page when searching
      } else if (response.status === 404) {
        setTasks([]); // Clear tasks if none found
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // setError('Failed to fetch tasks. Please try again later.');
      setTasks([]); // Clear tasks on error
    }
  };

  const handlePicturePreview = (imageUrl) => {
    const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
    setPreviewImageUrl(completeImageUrl);
    setIsPreviewModalOpen(true);
  };


  const handleMarkAsCompleteClick = async (taskId) => {
    try {
      setSelectedTaskId(taskId);
      const token = localStorage.getItem('authToken');

      // Step 1: Mark the task as complete
      const statusResponse = await axios.put(
        `http://103.159.85.246:4000/api/task/complete/${taskId}`,
        {},
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: 'completed' } : task
        )
      );

      // Update the task list to remove the completed task
      // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      // Step 2: Open the image modal
      setShowAddImageButton(true);

    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleCancelClick = () => {
    setSelectedTaskId(null);
    setSelectedImage(null);
    setShowAddImageButton(false);
  };


  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (!token) {
      // If the user is not authenticated, redirect to the login page
      setAuthenticated(false);
      router.push('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    console.log(decodedToken)
    const userRole = decodedToken.role || 'guest';

    // Check if the user has the superadmin role
    if (userRole !== 'sub-employee') {
      // If the user is not a superadmin, redirect to the login page
      router.push('/forbidden');
      return;
    }
    const loadFormattedTasks = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        // If the user is not authenticated, redirect to the login page
        setAuthenticated(false);
        router.push('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
      const userRole = decodedToken.role || 'guest';

      // Check if the user has the superadmin role
      if (userRole !== 'sub-employee') {
        // If the user is not a superadmin, redirect to the login page
        router.push('/forbidden');
        return;
      }


      try {
        const response = await axios.get(
          'http://103.159.85.246:4000/api/task/listTaskEmp',
          {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const formattedTasks = response.data.tasks.map((task) => ({
            ...task,
            deadlineDate: formatDateString(task.deadlineDate),
            startDate: formatDateString(task.startDate),
          }));
          setTasks(formattedTasks);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false); // Set loading to false when tasks are fetched
      }
    };

    loadFormattedTasks();
  }, []);

  // Function to set row color and status based on task status and deadline date
  const getStatusColorAndText = (task) => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedCurrentTime = currentTime.split(':').map((part, index) => index === 0 ? part.padStart(2, '0') : part).join(':');
    console.log(formattedCurrentTime);
    const formattedDeadlineDate = format(new Date(task.deadlineDate), 'dd/MM/yyyy');
    task.deadlineDate = parse(formattedDeadlineDate, 'dd/MM/yyyy', new Date());

    if (task.status === 'completed') {
      return {
        colorClass: ' bg-green-200 rounded-full font-semibold text-center text-green-900',
        statusText: 'Completed',
      };
    } else if (task.status === 'overdue') {
      return { colorClass: 'bg-red-300 rounded-full font-semibold text-center text-red-800', statusText: 'Overdue' };
    } else {
      return { colorClass: 'bg-blue-300 rounded-full font-semibold text-center text-blue-700', statusText: 'Pending' };
    }
  };


  const handleViewClick = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://103.159.85.246:4000/api/task/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const taskData = response.data;
        console.log(taskData);
        // Format the date for the task
        taskData.deadlineDate = formatDateDisplay(taskData.deadlineDate);
        taskData.startDate = formatDateDisplay(taskData.startDate);

        setViewTask(taskData);
        setIsViewModalOpen(true);
      } else {
        console.error('Failed to fetch task details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleUploadImage = async () => {
    try {
      const token = localStorage.getItem('authToken')

      const formData = new FormData();
      formData.append('imagePath', selectedImage); // selectedImage is the File object from input type=file

      // Step 3: Upload the image along with marking the task as complete
      const uploadResponse = await axios.put(
        `http://103.159.85.246:4000/api/task/complete/${selectedTaskId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token, // Include authorization header if needed
          },
        }
      );

      // Handle successful upload, if needed
      console.log('Upload Response:', uploadResponse.data);

      // Reset state variables regardless of success or failure
      setSelectedTaskId(null);
      setSelectedImage(null);
      setShowAddImageButton(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Function to handle page change
  const paginate = pageNumber => setCurrentPage(pageNumber);
  const exportToExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Filter and map the data including the header fields and employee names
    const tasksToExport = filteredTasks.map(task => {
      return {
        'Title': task.title,
        'Status': task.status,
        'StartDate': task.startDate,
        'DeadLine': task.deadlineDate,
        'AssignTo': task.assignTo, // Assign the name if available, otherwise use the ID
      };
    });

    // Create a worksheet from the filtered task data
    const ws = XLSX.utils.json_to_sheet(tasksToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    // Convert the workbook to an array buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the array buffer
    const data = new Blob([excelBuffer], { type: fileType });

    // Set the filename and save the file using saveAs function
    const fileName = 'receivedTask_list' + fileExtension;
    saveAs(data, fileName);
  };

  if (!authenticated) {
    // If the user is not authenticated, render nothing (or a message) and redirect to login
    return null;
  }

  const allRemarks = [...remarksList, ...empRemarksList];
  const sortedRemarks = allRemarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <>
      <NavSideEmp />
      <div className="m-5 pl-5 md:pl-72 mt-20">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-left text-orange-500">All Task List</h1>

        {/* <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search ..."
            className="px-3 py-1 border border-gray-400 rounded-full w-full md:w-1/3"
          />
        </div> */}
        <div>
          {error && <p className="text-red-500 font-semibold text-center">{error}</p>}
        </div>
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <label htmlFor="startDate" className="flex flex-col ml-2 text-orange-800 font-semibold">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            className="px-3 py-0.5 border border-gray-300 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
          />
          <label htmlFor="endDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
            End Date:
          </label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateChange}
            className="px-3 py-0.5 border border-gray-300 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
          />
          <button
            onClick={handleDateSearch}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md ml-3 text-sm"
          >
            Search
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search ..."
            className="px-1 py-1 border border-gray-400 rounded-full w-auto md:w-72 mb-2 md:mb-0 md:mr-2 ml-5"
          />

        </div>

        <div className="relative mb-7 md:mb-10">
          <button
            className="bg-green-700 text-white font-extrabold py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:absolute -mt-2 md:-mt-12 top-0 right-0 text-sm md:text-sm flex items-center mr-1" // Positioning
            onClick={() => exportToExcel(filteredTasks)}                    >
            <FontAwesomeIcon icon={faFileExcel} className="text-lg mr-1 font-bold" />
            <span className="font-bold">Export</span>
          </button>
        </div>

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
            <FontAwesomeIcon
              icon={faSpinner} // Use your FontAwesome spinner icon
              spin // Add the "spin" prop to make the icon spin
              className="text-white text-4xl" // You can customize the size and color
            />
          </div>
        ) : (
          <div className="overflow-x-auto -mt-3">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className='bg-orange-600 text-white'>
                <tr>
                  <th className="px-4 py-2 ">Sr.No.</th>
                  <th className="px-4 py-2 ">Title</th>
                  <th className="px-4 py-2 ">Status</th>
                  <th className="px-4 py-2 ">Date</th>
                  <th className="px-4 py-2 ">DeadLine</th>
                  <th className="px-4 py-2 ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTasks.length > 0 ? (
                  currentTasks.map((task, index) => {
                    const { colorClass, statusText } = getStatusColorAndText(task);
                    // const isStatusOverdueOrCompleted = task.status === 'overdue' || task.status === 'completed';

                    return (
                      <tr key={task._id} className='text-sm hover:bg-gray-100'>
                        <td className="border px-4 py-1.5 text-center">{calculateSerialNumber(index)}</td>
                        <td className="border px-6 py-1.5 whitespace-nowrap font-bold text-orange-800">{task.title}</td>
                        <td className="border px-4 py-1.5 text-center">
                          <span className={`border px-4 py-1 text-xs text-left ${colorClass}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="border px-6 py-1 whitespace-nowrap text-center">{formatDateDisplay(task.startDate)}</td>
                        <td className="border px-6 py-1 whitespace-nowrap text-center">{formatDateDisplay(task.deadlineDate)}</td>
                        <td className="border px-5 py-1 whitespace-nowrap">
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-blue-500 cursor-pointer text-base text-right pl-6"
                            onClick={() => handleViewClick(task._id)}
                            title="View"  // Tooltip text for the faEye icon
                          />
                          <FontAwesomeIcon
                            icon={faComment}
                            className="text-yellow-600 cursor-pointer text-base text-right pl-6"
                            onClick={() => handleRemarkClick(task._id)}
                            title="Remark"  // Tooltip text for the faComment icon
                          />

                          {!((task.status === 'completed') || task.status === 'overdue') && (
                            <button
                              className={`bg-green-600 hover:bg-green-800 text-white font-bold py-1 px-4 rounded-xl mx-3 text-xs -mr-10`}
                              onClick={() => handleMarkAsCompleteClick(task._id)}
                            >
                              {/* <FontAwesomeIcon icon={faSquareCheck} className="mr-2" /> */}
                              Complete
                            </button>
                          )}
                          {(task.status === 'completed' || task.status === 'overdue') && (
                            <button className="bg-green-200 text-black font-bold py-1 px-4 rounded-xl mx-3 text-xs pointer-events-none" disabled>
                              {/* <FontAwesomeIcon icon={faCheck} className="mr-2" /> */}
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
                      No Received Tasks Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isRemarkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 font-sans">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 max-h-screen flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-orange-600">Add Remark</h2>

              <div className="flex-1 overflow-y-auto mb-4">
                {sortedRemarks.length === 0 ? (
                  <div className="text-center text-gray-700 mt-20 font-semibold">No remarks found</div>
                ) : (
                  <div className="mb-1">
                    <h3 className="text-base font-semibold mb-2 text-green-950">Added Remarks:</h3>
                    {sortedRemarks.map((remarkObj, index) => (
                      <div key={index} className="mb-2 text-sm">
                        <span className="font-semibold">{remarkObj.assignedBy || remarkObj.assignedByEmp}:</span>
                        <span className="ml-2">{remarkObj.remark}</span>
                        <span className="ml-3">{formatTimestamp(remarkObj.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remark here"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
                  rows="4"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddRemark}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
                  >
                    Add Remark
                  </button>
                  <button
                    onClick={() => setIsRemarkModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md ml-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {!loading && (
          <ul className="flex justify-center items-center mt-4">
            {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, index) => (
              <li key={index} className="px-3 py-2">
                <button
                  onClick={() => paginate(index + 1)}
                  className={`${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    } px-4 py-2 rounded`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* View Task Modal */}
        {isViewModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="modal-container bg-white w-72 md:w-96 sm:p-6 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsViewModalOpen(false)}
              >
                {/* Close button icon */}
              </button>
              <div className="p-2 text-center text-sm md:text-base">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                  Task Details
                </h3>
                {viewTask && (
                  <div>
                    <p className="mb-1 text-left justify-center">
                      <strong>Title :</strong> {viewTask.title}
                    </p>
                    {viewTask.assignedBy ? (
                      <p className="mb-1 text-left justify-center">
                        <strong>Assigned By :</strong>{' '}
                        {viewTask.assignedBy.name}
                      </p>
                    ) : viewTask.assignedByEmp ? (
                      <p className="mb-1 text-left justify-center">
                        <strong>Assigned By :</strong>{' '}
                        {viewTask.assignedByEmp.name}
                      </p>
                    ) : (
                      <p className="mb-1 text-left justify-center">
                        <strong>Assigned By:</strong> Self
                      </p>
                    )}
                    <p className="mb-1 text-left justify-center">
                      <strong>Description:</strong> {viewTask.description}
                    </p>
                    <p className="mb-2 text-left justify-center">
                      <strong>Status:</strong> {viewTask.status}
                    </p>
                    <p className="mb-1 text-left justify-center">
                      <strong>Start Date:</strong> {viewTask.startDate}
                    </p>
                    <p className="mb-1 text-left justify-center">
                      <strong>Start Time:</strong> {viewTask.startTime}
                    </p>
                    <p className="mb-1 text-left justify-center">
                      <strong>Deadline Date:</strong> {viewTask.deadlineDate}
                    </p>
                    <p className="mb-1 text-left justify-center">
                      <strong>End Time:</strong> {viewTask.endTime}
                    </p>

                    {/* <p className="mb-1 text-left justify-center">
                      <strong>Assigned By:</strong>{' '}
                      {viewTask.assignedBy ? viewTask.assignedBy.name : 'Self'}
                    </p>
                    <p className="mb-1 text-left justify-center">
                      <strong>Assigned By Employee:</strong>{' '}
                      {viewTask.assignedByEmp ? viewTask.assignedByEmp.name : 'N/A'}
                    </p> */}

                    <p className="mb-2 text-left justify-center">
                      <strong>Picture:</strong>{" "}
                      {viewTask.pictures && viewTask.pictures.length > 0 ? (
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2 text-sm"
                          onClick={() => {
                            setPreviewImages(viewTask.pictures);
                            setCurrentImageIndex(0);
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          Preview Images
                        </button>
                      ) : (
                        "Not Added"
                      )}
                    </p>

                    <p className="mb-2 text-left flex  item-center">
                      {/* <strong>Audio:</strong>{" "}
                      {viewTask.audio ? ( */}
                      <span className='mr-1'> <strong>Audio:</strong></span>{" "}
                      {viewTask.audio ? (
                        <audio controls className='w=64 h-8 md:w-96 md:h-10 text-lg'>
                          <source src={`http://103.159.85.246:4000/${viewTask.audio}`} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>

                      ) : (
                        "Not Added"
                      )}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isPreviewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-container bg-white w-full md:w-1/3 h-3/4 p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                &times;
              </button>
              <div className="p-1 text-center">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
                <div className="flex items-center justify-center relative">
                  {previewImages.length > 0 && (
                    <>
                      <img
                        src={`http://103.159.85.246:4000/${previewImages[currentImageIndex]}`}
                        alt={`Preview ${currentImageIndex + 1}`}
                        className="max-w-72 max-h-72 object-contain"
                      />
                      {currentImageIndex > 0 && (
                        <FontAwesomeIcon
                          icon={faCaretSquareLeft}
                          onClick={handlePrevImage}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-3xl cursor-pointer text-gray-800"
                        />
                      )}
                      {currentImageIndex < previewImages.length - 1 && (
                        <FontAwesomeIcon
                          icon={faCaretSquareRight}
                          onClick={handleNextImage}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-3xl cursor-pointer text-gray-800"
                        />
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4"
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


        {showAddImageButton && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
              <h2 className="text-xl font-bold mb-4 text-orange-500">Upload Image</h2>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCancelClick}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700 transition duration-300 ease-in-out mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadImage}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReceivedTaskList