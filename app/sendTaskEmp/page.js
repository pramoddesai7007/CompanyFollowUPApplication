'use client'

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faPenToSquare, faTrash, faEye, faSpinner, faFileExcel, faPlus, faComment, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Assuming 'faWhatsapp' belongs to the brand icons
import { format, parse, isBefore } from 'date-fns';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NavSideEmp from '../components/NavSideEmp';
import * as XLSX from 'xlsx';
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


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const ShareButton = ({ task }) => {
    const [assignedByName, setAssignedByName] = useState('');

    const fetchAssignedByName = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://103.159.85.246:4000/api/task/${task._id}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200 && response.data.assignedBy) { // Check if assignedBy exists
                setAssignedByName(response.data.assignedBy.name);
            } else {
                console.error('No assignedBy or name found in the task');
            }

        } catch (error) {
            console.error('Error fetching assignedBy name:', error);
        }
    }, [])

    const handleShareClick = () => {
        const recipient = task.phoneNumber;
        const title = task.title;
        const description = task.description;
        const startDate = task.startDate;
        const assignedBy = assignedByName; // Use the fetched name
        const endDate = new Date(task.deadlineDate);
        const formattedEndDate = endDate.toLocaleDateString('en-GB');

        const message = `*New Task is created by : ${assignedBy}*%0A%0A*Task Title:* ${title}%0A*Description:* ${description}%0A*Start Date:* ${startDate}%0A*End Date:* ${formattedEndDate}%0A*Assigned By:* ${assignedBy}`;

        const whatsappWebURL = `https://web.whatsapp.com/send?phone=${recipient}&text=${message}`;

        window.open(whatsappWebURL);
    };

    // useEffect(() => {
    //     fetchAssignedByName();
    // }, []);
    useEffect(() => {
        fetchAssignedByName();
    }, [fetchAssignedByName]);


    return (
        <button
            onClick={handleShareClick}
            className="text-green-600 cursor-pointer text-sm ml-2"
            title='Whatsapp'
        >
            <FontAwesomeIcon icon={faWhatsapp} />
        </button>
    );
};

const SendTaskEmp = () => {
    const [tasks, setTasks] = useState([]);
    const [viewTask, setViewTask] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [completeImageUrl, setPreviewImageUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(15); // Set the number of tasks to display per page
    const [authenticated, setAuthenticated] = useState(true);
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [error, setError] = useState(null); // State variable for error message

    let serialNumber = 1;

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);

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

    const handlePicturePreview = (imageUrl) => {
        const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
        console.log(completeImageUrl)
        setPreviewImageUrl(completeImageUrl);
        setIsPreviewModalOpen(true);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
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
            const response = await axios.get('http://103.159.85.246:4000/api/task/list/subemployee/sendTasks', {
                headers: {
                    Authorization: token,
                },
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });

            if (response.status === 200) {
                if (Array.isArray(response.data.tasks)) {
                    const currentDate = new Date();
                    const currentTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                    const formattedCurrentTime = currentTime.split(':').map((part, index) => index === 0 ? part.padStart(2, '0') : part).join(':');
                    console.log(formattedCurrentTime);
                    const tasksWithAssignedNames = await Promise.all(
                        response.data.tasks.map(async (task) => {
                            try {
                                const employeeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
                                    headers: {
                                        Authorization: token,
                                    },
                                });

                                if (employeeResponse.status === 200) {
                                    task.assigneeName = employeeResponse.data.name;
                                }
                            } catch (error) {
                                // If the employee is not found, set assigneeName as 'Employee Not Found'
                                task.assigneeName = 'Employee Not Found';
                            }

                            task.startDate = formatDate(task.startDate);
                            const formattedDeadlineDate = format(new Date(task.deadlineDate), 'dd/MM/yyyy');
                            task.deadlineDate = parse(formattedDeadlineDate, 'dd/MM/yyyy', new Date());

                            // Check if the task is completed or overdue
                            if (task.status === 'completed') {
                                // Task is completed, no need to check deadline
                            } else if (isBefore(task.deadlineDate, currentDate) && task.endTime <= formattedCurrentTime) {
                                task.status = 'overdue';
                            } else {
                                task.status = 'pending';
                            }

                            return task;
                        })
                    );

                    setTasks(tasksWithAssignedNames);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // setError('Failed to fetch tasks. Please try again later.');
            setTasks([]); // Clear tasks on error
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

    const router = useRouter()
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

        const fetchAllTasks = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://103.159.85.246:4000/api/task/list/subemployee/sendTasks', {
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.status === 200) {
                    if (Array.isArray(response.data.tasks)) {
                        const currentDate = new Date();
                        const currentTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                        const formattedCurrentTime = currentTime.split(':').map((part, index) => index === 0 ? part.padStart(2, '0') : part).join(':');
                        console.log(formattedCurrentTime);
                        const tasksWithAssignedNames = await Promise.all(
                            response.data.tasks.map(async (task) => {
                                try {
                                    const employeeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
                                        headers: {
                                            Authorization: token,
                                        },
                                    });

                                    if (employeeResponse.status === 200) {
                                        task.assigneeName = employeeResponse.data.name;
                                    }
                                } catch (error) {
                                    // If the employee is not found, set assigneeName as 'Employee Not Found'
                                    task.assigneeName = 'Employee Not Found';
                                }

                                task.startDate = formatDate(task.startDate);
                                const formattedDeadlineDate = format(new Date(task.deadlineDate), 'dd/MM/yyyy');
                                task.deadlineDate = parse(formattedDeadlineDate, 'dd/MM/yyyy', new Date());

                                // Check if the task is completed or overdue
                                // if (task.status === 'completed') {
                                //     // Task is completed, no need to check deadline
                                // } else if (isBefore(task.deadlineDate, currentDate) && task.endTime <= formattedCurrentTime) {
                                //     task.status = 'overdue';
                                // } else {
                                //     task.status = 'pending';
                                // }


                                return task;
                            })
                        );

                        setTasks(tasksWithAssignedNames);
                    } else {
                        console.error('API response is not an array:', response.data);
                    }
                } else {
                    console.error('Failed to fetch tasks');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTasks();
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            const filtered = tasks.filter((task) => {
                const assigneeName = task.assigneeName ? task.assigneeName.toLowerCase() : '';
                const startDate = task.startDate.toLowerCase();
                const deadlineDate = formatDate(task.deadlineDate);
                const status = task.status.toLowerCase();
                const title = task.title.toLowerCase();
                const query = searchQuery.toLowerCase();

                return (
                    assigneeName.includes(query) ||
                    title.includes(query) ||
                    status.includes(query)
                );
            });

            setFilteredTasks(filtered);
        } else {
            setFilteredTasks(tasks); // Show all tasks if the search query is less than 3 characters
        }
    }, [searchQuery, tasks]);

    const handleDeleteClick = (taskId) => {
        setDeleteTaskId(taskId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://103.159.85.246:4000/api/task/delete/${deleteTaskId}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                console.log('Task deleted successfully');
                setIsDeleteModalOpen(false);
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deleteTaskId));
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error:', error);
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
                taskData.startDate = formatDate(taskData.startDate);
                taskData.deadlineDate = formatDate(taskData.deadlineDate);

                if (taskData.assignTo) {
                    try {
                        const employeeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${taskData.assignTo}`, {
                            headers: {
                                Authorization: token,
                            },
                        });

                        if (employeeResponse.status === 200) {
                            taskData.assigneeName = employeeResponse.data.name;
                        }
                    } catch (error) {
                        console.error('Error fetching assignee details:', error);
                        taskData.assigneeName = 'Employee Not Found';
                    }
                } else {
                    taskData.assigneeName = 'Not Assigned';
                }

                console.log('Picture URL:', taskData.picture);
                console.log('Audio URL:', taskData.audio);

                setViewTask(taskData);
                setIsViewModalOpen(true);
            } else {
                console.error('Failed to fetch task details');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    // Function to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const exportToExcel = async () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';



        // Filter and map the data including the header fields and employee names
        const tasksToExport = filteredTasks.map(task => {
            return {
                'Title': task.title,
                'Status': task.status,
                'StartDate': task.startDate,
                'DeadLine': formatDate(task.deadlineDate),
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
        const fileName = 'Send Tasks_list' + fileExtension;
        saveAs(data, fileName);
    };


    if (!authenticated) {
        // If the user is not authenticated, render nothing (or a message) and redirect to login
        return null;
    }


    const handleEdit = (taskId) => {
        router.push(`/editFormEmp/${taskId}`);
    };

    return (
        <>
            <NavSideEmp />
            <div className="m-5 pl-0 md:pl-64 mt-16">
                <h1 className="text-xl md:text-2xl font-bold mb-4 text-orange-500 text-center md:text-left ">Send Tasks</h1>

                <div className="flex flex-col md:flex-row md:items-center mb-4">
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
                    <div className="flex justify-start items-center">
                        <input
                            type="text"
                            placeholder="Search Tasks"
                            className="px-1 py-1 border border-gray-400 rounded-full w-auto md:w-64 mb-2 md:mb-0 md:mr-2 ml-5"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                        {/* <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search ..."
            className="px-1 py-1 border border-gray-400 rounded-full w-auto md:w-72 mb-2 md:mb-0 md:mr-2 ml-5"
          /> */}
                    </div>
                </div>

                <div className="relative mb-16 md:mb-16 md:-mt-10">
                    <button
                        className="bg-green-500 text-white font-bold py-1 px-5 md:px-4 rounded-lg absolute top-2 right-3 md:right-0 md:-mt-4"
                        onClick={() => router.push('/taskFormInternal')}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-lg mr-1 font-bold" />
                        <span className="font-bold">Add Task</span>
                    </button>
                </div>
                <div className="relative mb-7 md:mb-14">
                    <button
                        className="bg-green-700 text-white font-extrabold py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:absolute -mt-2 md:-mt-16 top-2 right-32 text-sm md:text-sm flex items-center mr-1" // Positioning
                        onClick={() => exportToExcel(filteredTasks)}                    >
                        <FontAwesomeIcon icon={faFileExcel} className="text-lg mr-1 font-bold" />
                        <span className="font-bold">Export</span>
                    </button>
                </div>


                {loading ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="text-white text-4xl"
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className='bg-orange-400 text-white'>
                                <tr>
                                    <th className="px-4 py-2 text-center">Sr.No.</th>
                                    <th className="px-4 py-2 text-center">Title</th>
                                    <th className="px-4 py-2 text-center">Status</th>
                                    <th className="px-4 py-2 text-center">StartDate</th>
                                    <th className="px-4 py-2 text-center">Deadline</th>
                                    <th className="px-4 py-2 text-center">AssignTo</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTasks.length > 0 ? (
                                    currentTasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-gray-100 text-sm cursor-pointer">
                                            <td className="border px-4 py-1.5 text-center">{serialNumber++}</td>
                                            <td className="border px-4 py-1.5 font-semibold text-orange-800">{task.title}</td>
                                            <td className="text-center border px-2 py-1">
                                                <span className={`rounded-full text-xs font-bold px-5 py-0.5 ${task.status === 'completed' ? 'text-green-800 bg-green-200' :
                                                    task.status === 'overdue' ? 'text-red-800 bg-red-200' :
                                                        task.status === 'pending' ? 'text-blue-800 bg-blue-200' :
                                                            ''
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-1.5">{task.startDate}</td>
                                            <td className="border px-4 py-1.5">{formatDate(task.deadlineDate)}</td>
                                            <td className="border px-4 py-1.5 text-center">{task.assigneeName}</td>
                                            <td className="border px-4 py-1.5">

                                                {/* <div style={{display:'flex'}}> */}
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className="text-blue-500 hover:underline mr-3 text-sm cursor-pointer pl-6"
                                                    onClick={() => handleViewClick(task._id)}
                                                    title='View'
                                                />
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    className="text-orange-500 hover:underline mr-3 cursor-pointer"
                                                    onClick={() => handleEdit(task._id)}
                                                    title='Edit'
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-red-500 hover:underline mr-3 text-sm cursor-pointer"
                                                    onClick={() => handleDeleteClick(task._id)}
                                                    title='Delete'
                                                />
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    className="text-yellow-600 cursor-pointer text-base text-right"
                                                    onClick={() => handleRemarkClick(task._id)}
                                                    title="Remark"  // Tooltip text for the faComment icon
                                                />

                                                <ShareButton task={task} />
                                                {/* </div> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
                                            No any Task Added
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex justify-center items-center mt-4">
                    {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 mx-2 bg-blue-200 text-white rounded-md ${currentPage === index + 1 ? 'bg-blue-700' : ''}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
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



                {isViewModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-container bg-white w-72 md:w-96 p-2 md:p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>

                            <div className="p-2 text-center text-sm md:text-base">
                                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">Task Details</h3>
                                {viewTask && (
                                    <div>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>AssignTo :</strong> {viewTask.assigneeName}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>AssignedBy :</strong> {viewTask.assignedByEmp.name}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Title :</strong> {viewTask.title}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Description:</strong> {viewTask.description}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Date:</strong> {viewTask.startDate}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>Start Time:</strong> {viewTask.startTime}
                                        </p>
                                        <p className="mb-2 text-left justify-center">
                                            <strong>DeadLine:</strong> {viewTask.deadlineDate}
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
                                    </div>
                                )}


                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
                                    onClick={() => setIsViewModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-container bg-white sm:w-96 sm:p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsDeleteModalOpen(false)}></button>
                            <div className="p-5 text-center">
                                {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Confirm Deletion</h3> */}
                                <FontAwesomeIcon icon={faCircleExclamation} className='text-3xl md:text-5xl text-orange-600 mt-2' />
                                <p className="mb-3 text-center justify-center mt-3">
                                    Delete this task?
                                </p>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2 text-xs md:text-base"
                                    onClick={() => handleDelete()}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4 text text-xs md:text-base"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Cancel
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

            </div>
        </>
    );
};

export default SendTaskEmp;