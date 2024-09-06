
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner, faFileExcel, faComment, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import NavSideEmp from '../components/NavSideEmp';
import * as XLSX from 'xlsx';

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


const formatDateString = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString).toLocaleDateString(undefined, options);
  return date;
};

const formatDateDisplay = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
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



// Helper function to fetch employee name by ID
const getEmployeeName = async (employeeId, authToken) => {
  try {
    const response = await axios.get(`http://103.159.85.246:4000/api/employee/${employeeId}`, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data.name;
  } catch (error) {
    console.error(`Error fetching employee name for ID ${employeeId}:`, error);
    return '';
  }
};

const OverdueByEmployee = () => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTask, setViewTask] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [completeImageUrl, setPreviewImageUrl] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(''); // State variable for error message
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(15); // Set the number of tasks per page

  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [remark, setRemark] = useState("");
  const [remarksList, setRemarksList] = useState([]);
  const [empRemarksList, setEmpRemarksList] = useState([]);

  const allRemarks = [...remarksList, ...empRemarksList];
  const sortedRemarks = allRemarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));


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

  const closeViewModal = () => {
    setIsViewModalOpen(false); // Clear the task to close the modal
  };

  const calculateSerialNumber = (index) => {
    return index + (currentPage - 1) * tasksPerPage + 1;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
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

    if (end < start) {
      setError('End date cannot be earlier than start date.');
      setOverdueTasks([]); // Clear tasks if dates are invalid
      return;
    } else {
      setError(''); // Clear error if dates are valid
    }

    // Fetch overdue tasks based on date range from the server
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/over', {
        headers: {
          Authorization: token,
        },
        params: {
          startDate,
          endDate,
        },
      });

      if (response.status === 200) {
        const formattedTasks = response.data.overdueTasks.map((task) => ({
          ...task,
          deadlineDate: formatDateString(task.deadlineDate),
          startDate: formatDateString(task.startDate),
        }));
        setOverdueTasks(formattedTasks);
        setCurrentPage(1); // Reset to the first page when searching
      } else if (response.status === 404) {
        setOverdueTasks([]); // Clear tasks if none found
      } else {
        console.error('Failed to fetch tasks');
        setError('Failed to fetch tasks. Please try again later.');
        setOverdueTasks([]); // Clear tasks on error
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // setError('Failed to fetch tasks. Please try again later.');
      setOverdueTasks([]); // Clear tasks on error
    }
  };

  const filteredTasks = overdueTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handlePicturePreview = (imageUrl) => {
    const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
    setPreviewImageUrl(completeImageUrl);
    setIsPreviewModalOpen(true);
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

        setViewTask(taskData);
        setIsViewModalOpen(true)
      } else {
        console.error('Failed to fetch task details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/over', {
          headers: {
            Authorization: token,
          },
        });

        if (response.data && response.data.overdueTasks) {
          setOverdueTasks(response.data.overdueTasks);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue tasks:', error);
        setLoading(false);
      }
    };

    fetchOverdueTasks();
  }, []);

  // Function to handle viewing a task
  const handleViewTask = async (task) => {
    const authToken = localStorage.getItem('authToken');

    // Fetch and set names for assignedBy and assignTo
    const assignedByName = await getEmployeeName(task.assignedBy, authToken);
    const assignToName = await getEmployeeName(task.assignTo, authToken);

    setViewTask({
      ...task,
      assignedBy: assignedByName,
      assignTo: assignToName,
    });
  };

  // Function to close the view modal
  const handleCloseViewModal = () => {
    setViewTask(null); // Clear the task to close the modal
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const exportToExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';



    // Filter and map the data including the header fields and employee names
    const tasksToExport = filteredTasks.map(task => {
      return {
        'Title': task.title,
        'Status': task.status,
        'StartDate': formatDateString(task.startDate),
        'DeadLine': formatDateString(task.deadlineDate),
        // 'AssignTo': task.assignTo, // Assign the name if available, otherwise use the ID
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
    const fileName = 'OverdueTask_list' + fileExtension;
    saveAs(data, fileName);
  };



  return (
    <>
      {/* <Navbar />
      <EmployeeSidebar /> */}
      <NavSideEmp />
      <div className=" m-5 pl-5 md:pl-72 mt-20">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-orange-800">Overdue Tasks</h1>

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
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-auto">
              <thead className='bg-red-600 text-white'>
                <tr>
                  <th className="px-4 py-2 border-b">Sr.No</th>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Deadline</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.length > 0 ? (
                  currentTasks.map((task, index) => (
                    <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
                      <td className="px-4 py-1.5 border text-center border-red-300 font-semibold">{calculateSerialNumber(index)}</td>
                      <td className="px-4 py-1.5 border text-left border-red-300 font-bold text-red-950">{task.title}</td>
                      <td className="px-4 py-1.5 border text-center font-semibold text-red-950 border-red-300">

                        <span className='px-4 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold'>Overdue</span></td>

                      <td className="px-4 py-1.5 border text-center border-red-300">{formatDateDisplay(task.startDate)}</td>
                      <td className="px-4 py-1.5 border text-center border-red-300">{formatDateDisplay(task.deadlineDate)}</td>
                      <td className="border px-4 py-0.5 text-center border-red-300 ">
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-blue-500 hover:underline cursor-pointer text-sm"
                          onClick={() => handleViewClick(task._id)}
                          title='View'
                        />
                        <FontAwesomeIcon
                          icon={faComment}
                          className="text-yellow-600 cursor-pointer text-base text-right ml-5"
                          onClick={() => handleRemarkClick(task._id)}
                          title="Remark"  // Tooltip text for the faComment icon
                        />

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-2 border text-center font-semibold">
                      No Overdue Tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <ul className="flex justify-center items-center mt-4">
          {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, index) => (
            <li key={index} className="px-3 py-2">
              <button
                onClick={() => paginate(index + 1)}
                className={`${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  } px-4 py-2 rounded`}
              >
                {index + 1}
              </button>
            </li>
          )
          )}
        </ul>
      </div>



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


      {/* View Task Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
          <div className="modal-container  bg-white sm:p-6 p-2 w-72 md:w-96 rounded-md">
            <div className='p-2 text-center text-sm md:text-base'>
              <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
              {viewTask.assignedBy ? (
                <p className="mb-2 text-left justify-center">
                  <strong>Assigned By :</strong>{' '}
                  {viewTask.assignedBy.name}
                </p>
              ) : viewTask.assignedByEmp ? (
                <p className="mb-2 text-left justify-center">
                  <strong>Assigned By :</strong>{' '}
                  {viewTask.assignedByEmp.name}
                </p>
              ) : (
                <p className="mb-1 text-left justify-center">
                  <strong>Assigned By:</strong> Self
                </p>
              )}

              <p className="mb-2 text-left justify-center">
                <strong>Title:</strong> {viewTask.title}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Description:</strong> {viewTask.description}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Status:</strong> Overdue
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Date:</strong> {formatDateDisplay(viewTask.startDate)}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Start Time:</strong> {viewTask.startTime}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>Deadline:</strong> {formatDateDisplay(viewTask.deadlineDate)}
              </p>
              <p className="mb-2 text-left justify-center">
                <strong>End Time:</strong> {viewTask.endTime}
              </p>

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

              <p className="mb-2 text-left flex items-center">
                {/* <strong>Audio:</strong>{" "} */}
                <span className='mr-1 '><strong>Audio:</strong></span>{" "}
                {viewTask.audio ? (
                  <audio controls className='w=64 h-8 md:w-96 md:h-10 text-lg'>
                    <source src={`http://103.159.85.246:4000/${viewTask.audio}`} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>

                ) : (
                  "Not Added"
                )}
              </p>


              <p className='text-center'>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={closeViewModal}
                >
                  Close
                </button>
              </p>
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
    </>
  );
};

export default OverdueByEmployee;