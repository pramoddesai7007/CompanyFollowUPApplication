// // // 'use client'

// // // import React, { useEffect, useState, useCallback } from 'react';
// // // import axios from 'axios';
// // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // import { faEye, faSpinner, faFileExcel } from '@fortawesome/free-solid-svg-icons';
// // // import Image from 'next/image';
// // // import NavSide from '../components/NavSide';
// // // import * as XLSX from 'xlsx';
// // // import { useRouter } from 'next/navigation';
// // // import jwtDecode from 'jwt-decode';


// // // const saveAs = (data, fileName) => {
// // //     const a = document.createElement('a');
// // //     document.body.appendChild(a);
// // //     a.style = 'display: none';
// // //     const url = window.URL.createObjectURL(data);
// // //     a.href = url;
// // //     a.download = fileName;
// // //     a.click();
// // //     window.URL.revokeObjectURL(url);
// // // };


// // // const PendingTasks = () => {
// // //     const [tasks, setTasks] = useState([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [viewModalOpen, setViewModalOpen] = useState(false);
// // //     const [selectedTask, setSelectedTask] = useState(null);
// // //     const [completeImageUrl, setPreviewImageUrl] = useState('');
// // //     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
// // //     const [searchQuery, setSearchQuery] = useState('');
// // //     const [filteredTasks, setFilteredTasks] = useState([]);

// // //     const [currentPage, setCurrentPage] = useState(1);
// // //     const [tasksPerPage] = useState(15); // Define tasks to show per page

// // //     const calculateSerialNumber = (index) => {
// // //         return index + (currentPage - 1) * tasksPerPage + 1;
// // //     };


// // //     useEffect(() => {
// // //         setFilteredTasks(tasks);
// // //     }, [tasks]);

// // //     const applySearchFilter = useCallback(() => {
// // //         const filtered = tasks.filter(
// // //             (task) =>
// // //                 task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //                 task.assignTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //                 task.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //                 task.deadlineDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //                 task.status.toLowerCase().includes(searchQuery.toLowerCase())
// // //         );
// // //         setFilteredTasks(filtered);
// // //     }, [searchQuery, tasks])

// // //     // useEffect(() => {
// // //     //     applySearchFilter();
// // //     // }, [searchQuery]);

// // //     useEffect(() => {
// // //         applySearchFilter();
// // //     }, [searchQuery, tasks]);

// // //     const indexOfLastTask = currentPage * tasksPerPage;
// // //     const indexOfFirstTask = indexOfLastTask - tasksPerPage;
// // //     const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

// // //     const paginate = pageNumber => setCurrentPage(pageNumber);


// // //     const handleSearchInputChange = (event) => {
// // //         setSearchQuery(event.target.value);
// // //     };

// // //     const handlePicturePreview = (imageUrl) => {
// // //         const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`;
// // //         setPreviewImageUrl(completeImageUrl);
// // //         setIsPreviewModalOpen(true);
// // //     };


// // //     const formatDate = (dateString) => {
// // //         const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
// // //         return new Date(dateString).toLocaleDateString('en-GB', options);
// // //     };

// // //     const router = useRouter()
// // //     useEffect(() => {
// // //         const token = localStorage.getItem('authToken');
// // //         if (!token) {
// // //             // If the user is not authenticated, redirect to the login page
// // //             setAuthenticated(false);
// // //             router.push('/login');
// // //             return;
// // //         }

// // //         const decodedToken = jwtDecode(token);
// // //         console.log(decodedToken)
// // //         const userRole = decodedToken.role || 'guest';

// // //         // Check if the user has the superadmin role
// // //         if (userRole !== 'admin') {
// // //             // If the user is not a superadmin, redirect to the login page
// // //             router.push('/forbidden');
// // //             return;
// // //         }
// // //         const fetchPendingTasks = async () => {
// // //             try {
// // //                 console.log('Fetching pending tasks...');
// // //                 const token = localStorage.getItem('authToken');
// // //                 const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/pending', {
// // //                     headers: {
// // //                         Authorization: token,
// // //                     },
// // //                 });

// // //                 console.log(response);

// // //                 const currentDate = new Date(); // Get the current date
// // //                 console.log(currentDate);

// // //                 const tasksWithNames = await Promise.all(
// // //                     response.data.map(async (task) => {
// // //                         // Fetch the employee name associated with the ID
// // //                         const assigneeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
// // //                             headers: {
// // //                                 Authorization: token,
// // //                             },
// // //                         });

// // //                         const assignedByNameResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
// // //                             headers: {
// // //                                 Authorization: token, // Include Authorization header for employee request
// // //                             },
// // //                         });

// // //                         const assigneeName = assigneeResponse.data.name;
// // //                         const assignedByName = assignedByNameResponse.data.name;
// // //                         const formattedStartDate = formatDate(task.startDate);
// // //                         const formattedDeadlineDate = formatDate(task.deadlineDate);

// // //                         return {
// // //                             ...task,
// // //                             startDate: formattedStartDate,
// // //                             deadlineDate: formattedDeadlineDate,
// // //                             assignTo: assigneeName,
// // //                             assignedBy: assignedByName,
// // //                         };
// // //                     })
// // //                 );

// // //                 console.log('All tasks:', tasksWithNames);

// // //                 setTasks(tasksWithNames);
// // //                 setLoading(false);
// // //             } catch (error) {
// // //                 console.error('Error fetching pending tasks:', error);
// // //                 setLoading(false);
// // //             }
// // //         };



// // //         fetchPendingTasks();
// // //     }, []);


// // //     const handleViewClick = (taskId) => {
// // //         // Find the selected task based on taskId
// // //         const task = tasks.find((t) => t._id === taskId);
// // //         setSelectedTask(task);
// // //         // Open the view modal
// // //         setViewModalOpen(true);
// // //     };

// // //     const closeViewModal = () => {
// // //         // Close the view modal
// // //         setViewModalOpen(false);
// // //     };
// // //     const exportToExcel = async () => {
// // //         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// // //         const fileExtension = '.xlsx';


// // //         // Filter and map the data including the header fields and employee names
// // //         const tasksToExport = filteredTasks.map(task => {
// // //             return {
// // //                 'Title': task.title,
// // //                 'Status': task.status,
// // //                 'StartDate': task.startDate,
// // //                 'DeadLine': task.deadlineDate,
// // //                 'AssignTo': task.assignTo, // Assign the name if available, otherwise use the ID
// // //             };
// // //         });

// // //         // Create a worksheet from the filtered task data
// // //         const ws = XLSX.utils.json_to_sheet(tasksToExport);
// // //         const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

// // //         // Convert the workbook to an array buffer
// // //         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

// // //         // Create a Blob from the array buffer
// // //         const data = new Blob([excelBuffer], { type: fileType });

// // //         // Set the filename and save the file using saveAs function
// // //         const fileName = 'Pending Tasks_list' + fileExtension;
// // //         saveAs(data, fileName);
// // //     };


// // //     return (
// // //         <>
// // //             <NavSide />
// // //             <div className="m-5 pl-1 md:pl-64 mt-20">
// // //                 <h1 className="text-xl md:text-2xl font-bold mb-4 text-left text-orange-500">Pending Tasks</h1>

// // //                 <div className="flex justify-center items-center mb-4">
// // //                     <input
// // //                         type="text"
// // //                         placeholder="Search Tasks"
// // //                         className="px-3 py-1 border border-gray-400 rounded-full w-full md:w-1/2"
// // //                         value={searchQuery}
// // //                         onChange={handleSearchInputChange}
// // //                     />
// // //                 </div>
// // //                 <div className="relative mb-7 md:mb-12">
// // //                     <button
// // //                         className="bg-green-700 text-white font-extrabold py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:absolute -mt-2 md:-mt-12 top-0 right-0 text-sm md:text-sm flex items-center mr-1" // Positioning
// // //                         onClick={() => exportToExcel(filteredTasks)}                    >
// // //                         <FontAwesomeIcon icon={faFileExcel} className="text-lg mr-1 font-bold" />
// // //                         <span className="font-bold">Export</span>
// // //                     </button>
// // //                 </div>


// // //                 {loading ? (
// // //                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
// // //                         <FontAwesomeIcon
// // //                             icon={faSpinner} // Use your FontAwesome spinner icon
// // //                             spin // Add the "spin" prop to make the icon spin
// // //                             className="text-white text-4xl" // You can customize the size and color
// // //                         />
// // //                     </div>
// // //                 ) : (

// // //                     <div className="overflow-x-auto">
// // //                         <table className="min-w-full table-auto">
// // //                             <thead className='bg-orange-500 text-white'>
// // //                                 <tr>
// // //                                     <th className="px-4 py-2 text-center">Sr.No</th>
// // //                                     <th className="px-4 py-2 text-center">Task Title</th>
// // //                                     <th className="px-4 py-2 text-center">Status</th>
// // //                                     <th className="px-4 py-2 text-center">StartDate</th>
// // //                                     <th className="px-4 py-2 text-center">DeadLine</th>
// // //                                     <th className="px-4 py-2 text-center">AssignTo</th>
// // //                                     <th className="px-4 py-2 text-center">Actions</th>
// // //                                 </tr>
// // //                             </thead>
// // //                             <tbody>
// // //                                 {tasks.length > 0 ? (
// // //                                     currentTasks.map((task, index) => (
// // //                                         <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
// // //                                             <td className="border px-4 py-1.5 text-center font-semibold">{calculateSerialNumber(index)}</td>
// // //                                             <td className="border px-4 py-1.5 text-center text-orange-600 font-bold">
// // //                                                 {task.title}
// // //                                             </td>
// // //                                             <td className="border px-4 py-1.5 text-center">
// // //                                                 <span className='px-4 py-1.5 bg-blue-200 text-blue-800 rounded-full text-sm font-bold'>{task.status}</span></td>
// // //                                             <td className="border px-4 py-1.5 text-center">{task.startDate}</td>
// // //                                             <td className="border px-4 py-1.5 text-center">{task.deadlineDate}</td>
// // //                                             <td className="border px-4 py-1.5 text-center font-semibold">{task.assignTo}</td>
// // //                                             <td className="border px-2 py-1.5">
// // //                                                 <FontAwesomeIcon
// // //                                                     icon={faEye}
// // //                                                     className="text-blue-500 hover:underline cursor-pointer text-xl ml-8"
// // //                                                     onClick={() => handleViewClick(task._id)}
// // //                                                 />
// // //                                             </td>
// // //                                         </tr>
// // //                                     ))
// // //                                 ) : (
// // //                                     <tr>
// // //                                         <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
// // //                                             No Pending Tasks Found
// // //                                         </td>
// // //                                     </tr>
// // //                                 )}
// // //                             </tbody>
// // //                         </table>
// // //                         <ul className="flex justify-center items-center mt-4">
// // //                             {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, index) => (
// // //                                 <li key={index} className="px-3 py-2">
// // //                                     <button
// // //                                         onClick={() => paginate(index + 1)}
// // //                                         className={`${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
// // //                                             } px-4 py-2 rounded`}
// // //                                     >
// // //                                         {index + 1}
// // //                                     </button>
// // //                                 </li>
// // //                             ))}
// // //                         </ul>
// // //                     </div>
// // //                 )}
// // //             </div>

// // //             {/* View Task Modal */}
// // //             {viewModalOpen && selectedTask && (
// // //                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // //                     <div className="modal-container bg-white w-72 md:w-96 sm:p-6 text-xs md:text-base rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
// // //                         <div className="p-2 text-center">

// // //                             <h2 className="text-xl font-semibold mb-4">View Task</h2>
// // //                             <div>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>AssignTo:</strong> {selectedTask.assignTo}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>AssignedBy:</strong> {selectedTask.assignedBy}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Title:</strong> {selectedTask.title}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Description:</strong> {selectedTask.description}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Status:</strong> {selectedTask.status}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Date:</strong> {selectedTask.startDate}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Start Time:</strong> {selectedTask.startTime}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>DeadLine:</strong> {selectedTask.deadlineDate}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>End Time:</strong> {selectedTask.endTime}
// // //                                 </p>
// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>ReminderTime:</strong> {selectedTask.reminderTime ? selectedTask.reminderTime : 'Not added'}
// // //                                 </p>


// // //                                 <p className="mb-2 text-left justify-center">
// // //                                     <strong>Picture:</strong>{" "}
// // //                                     {selectedTask.picture ? (
// // //                                         <button
// // //                                             type="button"
// // //                                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2"
// // //                                             onClick={() => handlePicturePreview(selectedTask.picture)}
// // //                                         >
// // //                                             Preview
// // //                                         </button>
// // //                                     ) : (
// // //                                         "Not Added"
// // //                                     )}
// // //                                 </p>

// // //                                 <p className="mb-2 text-left flex item-center">
// // //                                     <span className='mr-1 '><strong>Audio:</strong></span>{" "}
// // //                                     {selectedTask.audio ? (
// // //                                         <audio controls className='w-64 h-8 md:w-96 md-h-10 text-lg'>
// // //                                             <source src={`http://103.159.85.246:4000/${selectedTask.audio}`} type="audio/mp3" />
// // //                                             Your browser does not support the audio element.
// // //                                         </audio>

// // //                                     ) : (
// // //                                         "Not Added"
// // //                                     )}
// // //                                 </p>

// // //                                 <p className='text-center'>
// // //                                     <button
// // //                                         className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
// // //                                         onClick={closeViewModal}
// // //                                     >
// // //                                         Close
// // //                                     </button>
// // //                                 </p>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             {isPreviewModalOpen && (
// // //                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// // //                     <div className="modal-container bg-white w-72 md:w-80 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
// // //                         <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}></button>
// // //                         <div className="p-1 text-center">
// // //                             <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
// // //                             {/* <img src={completeImageUrl} alt="Preview" className="mb-2" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
// // //                             <Image
// // //                                 src={completeImageUrl}
// // //                                 alt="Preview"
// // //                                 width={400} // Adjust the width as needed
// // //                                 height={300} // Adjust the height as needed
// // //                             />
// // //                             <button
// // //                                 type="button"
// // //                                 className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
// // //                                 onClick={() => setIsPreviewModalOpen(false)}
// // //                             >
// // //                                 Close
// // //                             </button>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             )}
// // //         </>
// // //     );
// // // };

// // // export default PendingTasks;


// // 'use client'

// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faEye, faSpinner, faFileExcel, faComment } from '@fortawesome/free-solid-svg-icons';
// // import Image from 'next/image';
// // import NavSide from '../components/NavSide';
// // import * as XLSX from 'xlsx';
// // import { useRouter } from 'next/navigation';
// // import jwtDecode from 'jwt-decode';


// // const saveAs = (data, fileName) => {
// //     const a = document.createElement('a');
// //     document.body.appendChild(a);
// //     a.style = 'display: none';
// //     const url = window.URL.createObjectURL(data);
// //     a.href = url;
// //     a.download = fileName;
// //     a.click();
// //     window.URL.revokeObjectURL(url);
// // };

// // const formatTimestamp = (timestamp) => {
// //     const date = new Date(timestamp);
  
// //     // Subtract 5.5 hours
// //     date.setHours(date.getHours() - 5);
// //     date.setMinutes(date.getMinutes() - 30);
  
// //     const day = String(date.getDate()).padStart(2, '0');
// //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
// //     const year = date.getFullYear();
  
// //     let hours = date.getHours();
// //     const minutes = String(date.getMinutes()).padStart(2, '0');
// //     const ampm = hours >= 12 ? 'PM' : 'AM';
  
// //     hours = hours % 12;
// //     hours = hours ? hours : 12; // the hour '0' should be '12'
  
// //     const formattedDate = `${day}/${month}/${year}`;
// //     const formattedTime = `${hours}:${minutes} ${ampm}`;
  
// //     return `${formattedDate} ${formattedTime}`;
// //   }


// // const PendingTasks = () => {
// //     const [tasks, setTasks] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [viewModalOpen, setViewModalOpen] = useState(false);
// //     const [selectedTask, setSelectedTask] = useState(null);
// //     const [completeImageUrl, setPreviewImageUrl] = useState('');
// //     const [selectedEmployee, setSelectedEmployee] = useState("");
// //     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [filteredTasks, setFilteredTasks] = useState([]);
// //     const [error, setError] = useState(null);
// //     const [employees, setEmployees] = useState([]);
// //     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [tasksPerPage] = useState(15); // Define tasks to show per page

// //     const [startDate, setStartDate] = useState(
// //         () => new Date().toISOString().split("T")[0]
// //     );
// //     const [endDate, setEndDate] = useState(
// //         () => new Date().toISOString().split("T")[0]
// //     );
// //     const [searchTerm, setSearchTerm] = useState("");

// //     const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
// //     const [currentTaskId, setCurrentTaskId] = useState(null);
// //     const [remark, setRemark] = useState("");
// //     const [remarksList, setRemarksList] = useState([]);
// //     const [empRemarksList, setEmpRemarksList] = useState([]);

// //     const allRemarks = [...remarksList, ...empRemarksList];
// //     const sortedRemarks = allRemarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// //     const fetchRemarks = async (taskId) => {
// //         try {
// //             const remarksResponse = await axios.get(
// //                 `http://103.159.85.246:4000/api/task/tasks/${taskId}/remarkToList`
// //             );
// //             console.log("Remarks:", remarksResponse.data);
// //             setRemarksList(remarksResponse.data);

// //             const empRemarksResponse = await axios.get(
// //                 `http://103.159.85.246:4000/api/task/tasks/${taskId}/empRemarkToList`
// //             );
// //             console.log("Employee Remarks:", empRemarksResponse.data);
// //             setEmpRemarksList(empRemarksResponse.data); // Assuming you have a setter for employee remarks list

// //         } catch (error) {
// //             console.error("Error fetching remarks:", error);
// //         }
// //     };

// //     useEffect(() => {
// //         if (isRemarkModalOpen && currentTaskId) {
// //             fetchRemarks(currentTaskId);
// //         }
// //     }, [isRemarkModalOpen, currentTaskId]);

// //     const handleRemarkClick = (taskId) => {
// //         setCurrentTaskId(taskId);
// //         setIsRemarkModalOpen(true);
// //     };

// //     const handleAddRemark = async () => {
// //         try {
// //             const token = localStorage.getItem("authToken");
// //             await axios.post(
// //                 `http://103.159.85.246:4000/api/task/tasks/${currentTaskId}/remarkToList`,
// //                 { remark },
// //                 {
// //                     headers: {
// //                         Authorization: token,
// //                         "Content-Type": "application/json",
// //                     },
// //                 }
// //             );

// //             // Close the modal and clear the remark input
// //             setIsRemarkModalOpen(false);
// //             setRemark("");
// //             // Optionally refresh or update tasks
// //         } catch (error) {
// //             console.error("Error adding remark:", error);
// //         }
// //     };



// //     const handleSearch = (event) => {
// //         setSearchTerm(event.target.value); // Set the search term as the user types
// //         setCurrentPage(1); // Reset to the first page when searching
// //     };

// //     const handleDateChange = (event) => {
// //         const { name, value } = event.target;
// //         if (name === "startDate") {
// //             setStartDate(value);
// //         } else if (name === "endDate") {
// //             setEndDate(value);
// //         }
// //     };

// //     const handleDateSearch = async () => {
// //         const start = new Date(startDate);
// //         const end = new Date(endDate);

// //         if (end < start) {
// //             setError("End date cannot be earlier than start date.");
// //             setTasks([]);
// //             return;
// //         } else {
// //             setError("");
// //         }

// //         if (!selectedEmployeeId || !startDate || !endDate) {
// //             return;
// //         }

// //         try {
// //             const token = localStorage.getItem("authToken");
// //             const response = await axios.get("http://103.159.85.246:4000/api/task/tasks/pending", {
// //                 headers: {
// //                     Authorization: token,
// //                 },
// //                 params: {
// //                     assignTo: selectedEmployeeId,
// //                     startDate,
// //                     endDate,
// //                 },
// //             });

// //             if (response.status === 200) {
// //                 if (Array.isArray(response.data)) {
// //                     const tasksWithAssignedNames = await Promise.all(
// //                         response.data.map(async (task) => {
// //                             try {
// //                                 const employeeResponse = await axios.get(
// //                                     `http://103.159.85.246:4000/api/subemployee/${task.assignTo}`,
// //                                     {
// //                                         headers: {
// //                                             Authorization: token,
// //                                         },
// //                                     }
// //                                 );

// //                                 const assignedByNameResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
// //                                     headers: {
// //                                         Authorization: token, // Include Authorization header for employee request
// //                                     },
// //                                 });

// //                                 const assigneeName = employeeResponse.data.name;
// //                                 const assignedBy = assignedByNameResponse.data.name
// //                                 // Format the date as dd/mm/yyyy
// //                                 const formattedStartDate = formatDate(task.startDate);
// //                                 // const formattedDeadlineDate = task.deadlineDate;
// //                                 const formattedDeadlineDate = formatDate(task.deadlineDate);

// //                                 // Update the task object with the formatted date and name
// //                                 return {
// //                                     ...task,
// //                                     startDate: formattedStartDate,
// //                                     deadlineDate: formattedDeadlineDate,
// //                                     assignTo: assigneeName,
// //                                     assignedBy
// //                                 };
// //                             } catch (error) {
// //                                 task.assigneeName = "Employee Not Found";
// //                             }
// //                             return task;
// //                         })
// //                     );

// //                     setTasks(tasksWithAssignedNames);
// //                     filterTasks(tasksWithAssignedNames);
// //                 } else {
// //                     console.error("API response is not an array:", response.data);
// //                 }
// //             } else if (response.status === 404) {
// //                 setTasks([]);
// //             } else {
// //                 console.error("Failed to fetch tasks");
// //             }
// //         } catch (error) {
// //             console.error("Error fetching tasks:", error.response?.data || error.message);
// //             if (error.response) {
// //                 if (error.response.status === 404) {
// //                     setError("Pending tasks not found");
// //                 } else {
// //                     setError("An error occurred while fetching tasks");
// //                 }
// //             } else if (error.request) {
// //                 setError("No response from server");
// //             } else {
// //                 setError("Error in setting up the request");
// //             }
// //             setTasks([]);
// //         }
// //     };

// //     const filterTasks = (tasks) => {
// //         const filtered = tasks.filter((task) => {
// //             if (selectedEmployee && selectedEmployee !== "") {
// //                 return task.assigneeName === selectedEmployee;
// //             }
// //             return true;
// //         });
// //         setFilteredTasks(filtered);
// //     };


// //     const calculateSerialNumber = (index) => {
// //         return index + (currentPage - 1) * tasksPerPage + 1;
// //     };


// //     useEffect(() => {
// //         setFilteredTasks(tasks);
// //     }, [tasks]);

// //     const applySearchFilter = useCallback(() => {
// //         const filtered = tasks.filter(
// //             (task) =>
// //                 task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 task.assignTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 task.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 task.deadlineDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                 task.status.toLowerCase().includes(searchQuery.toLowerCase())
// //         );
// //         setFilteredTasks(filtered);
// //     }, [searchQuery, tasks])

// //     useEffect(() => {
// //         applySearchFilter();
// //     }, [searchQuery]);

// //     useEffect(() => {
// //         applySearchFilter();
// //     }, [searchTerm, tasks]);

// //     const indexOfLastTask = currentPage * tasksPerPage;
// //     const indexOfFirstTask = indexOfLastTask - tasksPerPage;
// //     const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

// //     const paginate = pageNumber => setCurrentPage(pageNumber);


// //     const handleSearchInputChange = (event) => {
// //         setSearchQuery(event.target.value);
// //     };

// //     useEffect(() => {
// //         const fetchEmployeeNames = async () => {
// //             try {
// //                 const token = localStorage.getItem("authToken");
// //                 const response = await axios.get(
// //                     "http://103.159.85.246:4000/api/employee/subemployees/list",
// //                     {
// //                         headers: {
// //                             Authorization: token,
// //                         },
// //                     }
// //                 );

// //                 // Check the response structure
// //                 console.log("Fetched employees:", response.data);

// //                 // Ensure the response data is an array of employee objects with id and name
// //                 setEmployees(response.data);
// //             } catch (error) {
// //                 console.error("Error:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchEmployeeNames();
// //     }, []);

// //     const handlePicturePreview = (imageUrl) => {
// //         const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`;
// //         setPreviewImageUrl(completeImageUrl);
// //         setIsPreviewModalOpen(true);
// //     };


// //     const formatDate = (dateString) => {
// //         const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
// //         return new Date(dateString).toLocaleDateString('en-GB', options);
// //     };

// //     const router = useRouter()
// //     useEffect(() => {
// //         const token = localStorage.getItem('authToken');
// //         if (!token) {
// //             // If the user is not authenticated, redirect to the login page
// //             setAuthenticated(false);
// //             router.push('/login');
// //             return;
// //         }

// //         const decodedToken = jwtDecode(token);
// //         console.log(decodedToken)
// //         const userRole = decodedToken.role || 'guest';

// //         // Check if the user has the superadmin role
// //         if (userRole !== 'admin') {
// //             // If the user is not a superadmin, redirect to the login page
// //             router.push('/forbidden');
// //             return;
// //         }
// //         const fetchPendingTasks = async () => {
// //             try {
// //                 console.log('Fetching pending tasks...');
// //                 const token = localStorage.getItem('authToken');
// //                 const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/pending', {
// //                     headers: {
// //                         Authorization: token,
// //                     },
// //                 });

// //                 console.log(response);

// //                 const currentDate = new Date(); // Get the current date
// //                 console.log(currentDate);

// //                 const tasksWithNames = await Promise.all(
// //                     response.data.map(async (task) => {
// //                         // Fetch the employee name associated with the ID
// //                         const assigneeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
// //                             headers: {
// //                                 Authorization: token,
// //                             },
// //                         });
// //                         const assignedByNameResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
// //                             headers: {
// //                                 Authorization: token, // Include Authorization header for employee request
// //                             },
// //                         });

// //                         const assignedBy = assignedByNameResponse.data.name
// //                         const assigneeName = assigneeResponse.data.name;
// //                         const formattedStartDate = formatDate(task.startDate);
// //                         const formattedDeadlineDate = formatDate(task.deadlineDate);

// //                         // Update the task object with the formatted date and name
// //                         return {
// //                             ...task,
// //                             startDate: formattedStartDate,
// //                             deadlineDate: formattedDeadlineDate,
// //                             assignTo: assigneeName,
// //                             assignedBy
// //                         };
// //                     })
// //                 );

// //                 console.log('All tasks:', tasksWithNames);

// //                 setTasks(tasksWithNames);
// //                 setLoading(false);
// //             } catch (error) {
// //                 console.error('Error fetching pending tasks:', error);
// //                 setLoading(false);
// //             }
// //         };



// //         fetchPendingTasks();
// //     }, []);


// //     const handleViewClick = (taskId) => {
// //         // Find the selected task based on taskId
// //         const task = tasks.find((t) => t._id === taskId);
// //         setSelectedTask(task);
// //         // Open the view modal
// //         setViewModalOpen(true);
// //     };

// //     const closeViewModal = () => {
// //         // Close the view modal
// //         setViewModalOpen(false);
// //     };
// //     const exportToExcel = async () => {
// //         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// //         const fileExtension = '.xlsx';


// //         // Filter and map the data including the header fields and employee names
// //         const tasksToExport = filteredTasks.map(task => {
// //             return {
// //                 'Title': task.title,
// //                 'Status': task.status,
// //                 'StartDate': task.startDate,
// //                 'DeadLine': task.deadlineDate,
// //                 'AssignTo': task.assignTo, // Assign the name if available, otherwise use the ID
// //             };
// //         });

// //         // Create a worksheet from the filtered task data
// //         const ws = XLSX.utils.json_to_sheet(tasksToExport);
// //         const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

// //         // Convert the workbook to an array buffer
// //         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

// //         // Create a Blob from the array buffer
// //         const data = new Blob([excelBuffer], { type: fileType });

// //         // Set the filename and save the file using saveAs function
// //         const fileName = 'Pending Tasks_list' + fileExtension;
// //         saveAs(data, fileName);
// //     };


// //     return (
// //         <>
// //             <NavSide />
// //             <div className="m-5 pl-1 md:pl-64 mt-20 font-sans">
// //                 <h1 className="text-xl md:text-2xl font-bold mb-4 text-left text-orange-500">Pending Tasks</h1>

// //                 <div className="flex flex-col md:flex-row md:items-center mb-4">
// //                     <label htmlFor="startDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
// //                         Start Date :
// //                     </label>
// //                     <input
// //                         type="date"
// //                         name="startDate"
// //                         value={startDate}
// //                         onChange={handleDateChange}
// //                         className="px-3 py-0.5 border border-gray-300 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
// //                     />
// //                     <label htmlFor="endDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
// //                         End Date:
// //                     </label>
// //                     <input
// //                         type="date"
// //                         name="endDate"
// //                         value={endDate}
// //                         onChange={handleDateChange}
// //                         className="px-3 py-0.5 border border-gray-300 w-full md:w-40 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
// //                     />

// //                     <select
// //                         id="employee"
// //                         name="employee"
// //                         value={selectedEmployeeId}
// //                         onChange={(e) => setSelectedEmployeeId(e.target.value)}
// //                         className="form-select border border-gray-300 p-1 rounded-lg cursor-pointer text-sm px-3"
// //                     >
// //                         <option value="">Select an employee</option>
// //                         {employees.map((employee) => (
// //                             <option key={employee.id} value={employee._id}>
// //                                 {employee.name}
// //                             </option>
// //                         ))}
// //                     </select>
// //                     <button
// //                         onClick={handleDateSearch}
// //                         className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md ml-3 text-sm"
// //                     >
// //                         Go
// //                     </button>
// //                     <div className="flex justify-center items-center ml-5">
// //                         <input
// //                             type="text"
// //                             placeholder="Search Tasks..."
// //                             className="px-3 py-1 border border-gray-400 rounded-full w-full md:w-full text-sm"
// //                             value={searchQuery}
// //                             onChange={handleSearchInputChange}
// //                         />
// //                     </div>
// //                 </div>
// //                 <div className="relative mb-7 md:mb-12">
// //                     <button
// //                         className="bg-green-700 text-white font-extrabold py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:absolute -mt-2 md:-mt-12 top-0 right-0 text-sm md:text-sm flex items-center mr-1" // Positioning
// //                         onClick={() => exportToExcel(filteredTasks)}                    >
// //                         <FontAwesomeIcon icon={faFileExcel} className="text-lg mr-1 font-bold" />
// //                         <span className="font-bold">Export</span>
// //                     </button>
// //                 </div>


// //                 {loading ? (
// //                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
// //                         <FontAwesomeIcon
// //                             icon={faSpinner} // Use your FontAwesome spinner icon
// //                             spin // Add the "spin" prop to make the icon spin
// //                             className="text-white text-4xl" // You can customize the size and color
// //                         />
// //                     </div>
// //                 ) : (

// //                     <div className="overflow-x-auto -mt-3">
// //                         <table className="min-w-full table-auto">
// //                             <thead className='bg-orange-500 text-white'>
// //                                 <tr>
// //                                     <th className="px-4 py-2 text-center">Sr.No</th>
// //                                     <th className="px-4 py-2 text-center">Task Title</th>
// //                                     <th className="px-4 py-2 text-center">Status</th>
// //                                     <th className="px-4 py-2 text-center">StartDate</th>
// //                                     <th className="px-4 py-2 text-center">DeadLine</th>
// //                                     <th className="px-4 py-2 text-center">AssignTo</th>
// //                                     <th className="px-4 py-2 text-center">Actions</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {tasks.length > 0 ? (
// //                                     currentTasks.map((task, index) => (
// //                                         <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
// //                                             <td className="border px-4 py-1.5 text-center font-semibold">{calculateSerialNumber(index)}</td>
// //                                             <td className="border px-4 py-1.5 text-center text-orange-600 font-bold">
// //                                                 {task.title}
// //                                             </td>
// //                                             <td className="border px-4 py-1.5 text-center">
// //                                                 <span className='px-5 py-1.5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold'>Pending</span></td>
// //                                             <td className="border px-4 py-1.5 text-center">{(task.startDate)}</td>
// //                                             <td className="border px-4 py-1.5 text-center">{(task.deadlineDate)}</td>
// //                                             <td className="border px-4 py-1.5 text-center font-semibold">{task.assignTo}</td>
// //                                             <td className="border px-2 py-1.5">
// //                                                 <FontAwesomeIcon
// //                                                     icon={faEye}
// //                                                     className="text-blue-500 hover:underline cursor-pointer text-sm ml-10"
// //                                                     onClick={() => handleViewClick(task._id)}
// //                                                     title='View'
// //                                                 />
// //                                                 <FontAwesomeIcon
// //                                                     icon={faComment}
// //                                                     className="text-yellow-600 cursor-pointer text-base text-right ml-5"
// //                                                     onClick={() => handleRemarkClick(task._id)}
// //                                                     title='Remark'
// //                                                 />
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 ) : (
// //                                     <tr>
// //                                         <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
// //                                             No Pending Tasks Found
// //                                         </td>
// //                                     </tr>
// //                                 )}
// //                             </tbody>
// //                         </table>
// //                         <ul className="flex justify-center items-center mt-4">
// //                             {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, index) => (
// //                                 <li key={index} className="px-3 py-2">
// //                                     <button
// //                                         onClick={() => paginate(index + 1)}
// //                                         className={`${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
// //                                             } px-4 py-2 rounded`}
// //                                     >
// //                                         {index + 1}
// //                                     </button>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>
// //                 )}
// //             </div>


// //             {isRemarkModalOpen && (
// //                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 font-sans">
// //                     <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 max-h-screen flex flex-col">
// //                         <h2 className="text-xl font-semibold mb-4 text-orange-600">Add Remark</h2>

// //                         <div className="flex-1 overflow-y-auto mb-4">
// //                             {sortedRemarks.length === 0 ? (
// //                                 <div className="text-center text-gray-700 mt-20 font-semibold">No remarks found</div>
// //                             ) : (
// //                                 <div className="mb-1">
// //                                     <h3 className="text-base font-semibold mb-2 text-green-950">Added Remarks:</h3>
// //                                     {sortedRemarks.map((remarkObj, index) => (
// //                                         <div key={index} className="mb-2 text-sm">
// //                                             <span className="font-semibold">{remarkObj.assignedBy || remarkObj.assignedByEmp}:</span>
// //                                             <span className="ml-2">{remarkObj.remark}</span>
// //                                             <span className="ml-3">{formatTimestamp(remarkObj.timestamp)}</span>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             )}
// //                         </div>

// //                         <div className="mt-auto">
// //                             <textarea
// //                                 value={remark}
// //                                 onChange={(e) => setRemark(e.target.value)}
// //                                 placeholder="Enter your remark here"
// //                                 className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
// //                                 rows="4"
// //                             />
// //                             <div className="flex justify-end">
// //                                 <button
// //                                     onClick={handleAddRemark}
// //                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
// //                                 >
// //                                     Add Remark
// //                                 </button>
// //                                 <button
// //                                     onClick={() => setIsRemarkModalOpen(false)}
// //                                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md ml-2 text-sm"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //             {/* View Task Modal */}
// //             {viewModalOpen && selectedTask && (
// //                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// //                     <div className="modal-container bg-white w-72 md:w-96 sm:p-6 text-xs md:text-base rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
// //                         <div className="p-2 text-center">

// //                             <h2 className="text-xl font-semibold mb-4">View Task</h2>
// //                             <div>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>AssignTo:</strong> {selectedTask.assignTo}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>AssignedBy:</strong> {selectedTask.assignedBy}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Title:</strong> {selectedTask.title}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Description:</strong> {selectedTask.description}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Status:</strong> {selectedTask.status}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Date:</strong> {selectedTask.startDate}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Start Time:</strong> {selectedTask.startTime}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>DeadLine:</strong> {selectedTask.deadlineDate}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>End Time:</strong> {selectedTask.endTime}
// //                                 </p>
// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>ReminderTime:</strong> {selectedTask.reminderTime ? selectedTask.reminderTime : 'Not added'}
// //                                 </p>


// //                                 <p className="mb-2 text-left justify-center">
// //                                     <strong>Picture:</strong>{" "}
// //                                     {selectedTask.picture ? (
// //                                         <button
// //                                             type="button"
// //                                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2"
// //                                             onClick={() => handlePicturePreview(selectedTask.picture)}
// //                                         >
// //                                             Preview
// //                                         </button>
// //                                     ) : (
// //                                         "Not Added"
// //                                     )}
// //                                 </p>

// //                                 <p className="mb-2 text-left flex item-center">
// //                                     <span className='mr-1 '><strong>Audio:</strong></span>{" "}
// //                                     {selectedTask.audio ? (
// //                                         <audio controls className='w-64 h-8 md:w-96 md-h-10 text-lg'>
// //                                             <source src={`http://103.159.85.246:4000/${selectedTask.audio}`} type="audio/mp3" />
// //                                             Your browser does not support the audio element.
// //                                         </audio>

// //                                     ) : (
// //                                         "Not Added"
// //                                     )}
// //                                 </p>

// //                                 <p className='text-center'>
// //                                     <button
// //                                         className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
// //                                         onClick={closeViewModal}
// //                                     >
// //                                         Close
// //                                     </button>
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {isPreviewModalOpen && (
// //                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
// //                     <div className="modal-container bg-white w-72 md:w-80 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
// //                         <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}></button>
// //                         <div className="p-1 text-center">
// //                             <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
// //                             {/* <img src={completeImageUrl} alt="Preview" className="mb-2" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
// //                             <Image
// //                                 src={completeImageUrl}
// //                                 alt="Preview"
// //                                 width={400} // Adjust the width as needed
// //                                 height={300} // Adjust the height as needed
// //                             />
// //                             <button
// //                                 type="button"
// //                                 className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
// //                                 onClick={() => setIsPreviewModalOpen(false)}
// //                             >
// //                                 Close
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </>
// //     );
// // };

// // export default PendingTasks;








// 'use client'

// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faSpinner, faFileExcel, faComment } from '@fortawesome/free-solid-svg-icons';
// import Image from 'next/image';
// import NavSide from '../components/NavSide';
// import * as XLSX from 'xlsx';
// import { useRouter } from 'next/navigation';
// import jwtDecode from 'jwt-decode';


// const saveAs = (data, fileName) => {
//     const a = document.createElement('a');
//     document.body.appendChild(a);
//     a.style = 'display: none';
//     const url = window.URL.createObjectURL(data);
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     window.URL.revokeObjectURL(url);
// };

// const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
  
//     // Subtract 5.5 hours
//     date.setHours(date.getHours() - 5);
//     date.setMinutes(date.getMinutes() - 30);
  
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = date.getFullYear();
  
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
  
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
  
//     const formattedDate = `${day}/${month}/${year}`;
//     const formattedTime = `${hours}:${minutes} ${ampm}`;
  
//     return `${formattedDate} ${formattedTime}`;
//   }


// const PendingTasks = () => {
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [completeImageUrl, setPreviewImageUrl] = useState('');
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredTasks, setFilteredTasks] = useState([]);
//     const [error, setError] = useState(null);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [tasksPerPage] = useState(15); // Define tasks to show per page

//     const [startDate, setStartDate] = useState(
//         () => new Date().toISOString().split("T")[0]
//     );
//     const [endDate, setEndDate] = useState(
//         () => new Date().toISOString().split("T")[0]
//     );
//     const [searchTerm, setSearchTerm] = useState("");

//     const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
//     const [currentTaskId, setCurrentTaskId] = useState(null);
//     const [remark, setRemark] = useState("");
//     const [remarksList, setRemarksList] = useState([]);
//     const [empRemarksList, setEmpRemarksList] = useState([]);

//     const allRemarks = [...remarksList, ...empRemarksList];
//     const sortedRemarks = allRemarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//     const fetchRemarks = async (taskId) => {
//         try {
//             const remarksResponse = await axios.get(
//                 `http://103.159.85.246:4000/api/task/tasks/${taskId}/remarkToList`
//             );
//             console.log("Remarks:", remarksResponse.data);
//             setRemarksList(remarksResponse.data);

//             const empRemarksResponse = await axios.get(
//                 `http://103.159.85.246:4000/api/task/tasks/${taskId}/empRemarkToList`
//             );
//             console.log("Employee Remarks:", empRemarksResponse.data);
//             setEmpRemarksList(empRemarksResponse.data); // Assuming you have a setter for employee remarks list

//         } catch (error) {
//             console.error("Error fetching remarks:", error);
//         }
//     };

//     useEffect(() => {
//         if (isRemarkModalOpen && currentTaskId) {
//             fetchRemarks(currentTaskId);
//         }
//     }, [isRemarkModalOpen, currentTaskId]);

//     const handleRemarkClick = (taskId) => {
//         setCurrentTaskId(taskId);
//         setIsRemarkModalOpen(true);
//     };

//     const handleAddRemark = async () => {
//         try {
//             const token = localStorage.getItem("authToken");
//             await axios.post(
//                 `http://103.159.85.246:4000/api/task/tasks/${currentTaskId}/remarkToList`,
//                 { remark },
//                 {
//                     headers: {
//                         Authorization: token,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             // Close the modal and clear the remark input
//             setIsRemarkModalOpen(false);
//             setRemark("");
//             // Optionally refresh or update tasks
//         } catch (error) {
//             console.error("Error adding remark:", error);
//         }
//     };

//     useEffect(() => {
//         if (error) {
//           const timer = setTimeout(() => {
//             setError('');
//           }, 2000);
    
//           return () => clearTimeout(timer);
//         }
//       }, [error]);
    

//     const handleSearch = (event) => {
//         setSearchTerm(event.target.value); // Set the search term as the user types
//         setCurrentPage(1); // Reset to the first page when searching
//     };

//     const handleDateChange = (event) => {
//         const { name, value } = event.target;
//         if (name === "startDate") {
//             setStartDate(value);
//         } else if (name === "endDate") {
//             setEndDate(value);
//         }
//     };

//     const handleDateSearch = async () => {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
    
//         if (end < start) {
//             setError("End date cannot be earlier than start date.");
//             setTasks([]);
//             return;
//         } else {
//             setError("");
//         }
    
//         if (!selectedEmployeeId || !startDate || !endDate) {
//             return;
//         }
    
//         try {
//             const token = localStorage.getItem("authToken");
//             const response = await axios.get("http://103.159.85.246:4000/api/task/tasks/pending", {
//                 headers: {
//                     Authorization: token,
//                 },
//                 params: {
//                     assignTo: selectedEmployeeId,
//                     startDate,
//                     endDate,
//                 },
//             });
    
//             if (response.status === 200) {
//                 const tasks = response.data.tasks; // Access the tasks property
//                 if (Array.isArray(tasks)) {
//                     const tasksWithAssignedNames = await Promise.all(
//                         tasks.map(async (task) => {
//                             try {
//                                 // Fetch assignee name from SubEmployee model
//                                 const employeeResponse = await axios.get(
//                                     `http://103.159.85.246:4000/api/subemployee/${task.assignTo}`,
//                                     {
//                                         headers: {
//                                             Authorization: token,
//                                         },
//                                     }
//                                 );
    
//                                 let assignedByName = "Employee Not Found";
    
//                                 // Fetch assignedBy name from SubEmployee model using assignedByEmp ID if assignedBy is empty
//                                 if (!task.assignedBy && task.assignedByEmp) {
//                                     const assignedByEmpResponse = await axios.get(
//                                         `http://103.159.85.246:4000/api/subemployee/${task.assignedByEmp}`,
//                                         {
//                                             headers: {
//                                                 Authorization: token,
//                                             },
//                                         }
//                                     );
//                                     if (assignedByEmpResponse.status === 200) {
//                                         assignedByName = assignedByEmpResponse.data.name;
//                                     }
//                                 } else if (task.assignedBy) {
//                                     // If assignedBy is provided, fetch from Employee model
//                                     const assignedByNameResponse = await axios.get(
//                                         `http://103.159.85.246:4000/api/employee/${task.assignedBy}`,
//                                         {
//                                             headers: {
//                                                 Authorization: token,
//                                             },
//                                         }
//                                     );
//                                     if (assignedByNameResponse.status === 200) {
//                                         assignedByName = assignedByNameResponse.data.name;
//                                     }
//                                 }
    
//                                 const assigneeName = employeeResponse.data.name;
    
//                                 // Format the date as dd/mm/yyyy
//                                 const formattedStartDate = formatDate(task.startDate);
//                                 const formattedDeadlineDate = formatDate(task.deadlineDate);
    
//                                 // Update the task object with the formatted date and name
//                                 return {
//                                     ...task,
//                                     startDate: formattedStartDate,
//                                     deadlineDate: formattedDeadlineDate,
//                                     assignTo: assigneeName,
//                                     assignedBy: assignedByName
//                                 };
//                             } catch (error) {
//                                 task.assigneeName = "Employee Not Found";
//                                 return task;
//                             }
//                         })
//                     );
    
//                     setTasks(tasksWithAssignedNames);
//                     filterTasks(tasksWithAssignedNames);
//                 } else {
//                     console.error("API response is not an array:", tasks);
//                 }
//             } else if (response.status === 404) {
//                 setTasks([]);
//             } else {
//                 console.error("Failed to fetch tasks");
//             }
//         } catch (error) {
//             console.error("Error fetching tasks:", error.response?.data || error.message);
//             if (error.response) {
//                 if (error.response.status === 404) {
//                     setError("Pending tasks not found");
//                 } else {
//                     setError("An error occurred while fetching tasks");
//                 }
//             } else if (error.request) {
//                 setError("No response from server");
//             } else {
//                 setError("Error in setting up the request");
//             }
//             setTasks([]);
//         }
//     };

//     const filterTasks = (tasks) => {
//         const filtered = tasks.filter((task) => {
//             if (selectedEmployee && selectedEmployee !== "") {
//                 return task.assigneeName === selectedEmployee;
//             }
//             return true;
//         });
//         setFilteredTasks(filtered);
//     };


//     const calculateSerialNumber = (index) => {
//         return index + (currentPage - 1) * tasksPerPage + 1;
//     };


//     useEffect(() => {
//         setFilteredTasks(tasks);
//     }, [tasks]);

//     const applySearchFilter = useCallback(() => {
//         const filtered = tasks.filter(
//             (task) =>
//                 task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 task.assignTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 task.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 task.deadlineDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 task.status.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//         setFilteredTasks(filtered);
//     }, [searchQuery, tasks])

//     useEffect(() => {
//         applySearchFilter();
//     }, [searchQuery]);

//     useEffect(() => {
//         applySearchFilter();
//     }, [searchTerm, tasks]);

//     const indexOfLastTask = currentPage * tasksPerPage;
//     const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//     const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//     const paginate = pageNumber => setCurrentPage(pageNumber);


//     const handleSearchInputChange = (event) => {
//         setSearchQuery(event.target.value);
//     };

//     useEffect(() => {
//         const fetchEmployeeNames = async () => {
//             try {
//                 const token = localStorage.getItem("authToken");
//                 const response = await axios.get(
//                     "http://103.159.85.246:4000/api/employee/subemployees/list",
//                     {
//                         headers: {
//                             Authorization: token,
//                         },
//                     }
//                 );

//                 // Check the response structure
//                 console.log("Fetched employees:", response.data);

//                 // Ensure the response data is an array of employee objects with id and name
//                 setEmployees(response.data);
//             } catch (error) {
//                 console.error("Error:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEmployeeNames();
//     }, []);

//     const handlePicturePreview = (imageUrl) => {
//         const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`;
//         setPreviewImageUrl(completeImageUrl);
//         setIsPreviewModalOpen(true);
//     };


//     const formatDate = (dateString) => {
//         const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//         return new Date(dateString).toLocaleDateString('en-GB', options);
//     };

//     const router = useRouter()
//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             // If the user is not authenticated, redirect to the login page
//             setAuthenticated(false);
//             router.push('/login');
//             return;
//         }

//         const decodedToken = jwtDecode(token);
//         console.log(decodedToken)
//         const userRole = decodedToken.role || 'guest';

//         // Check if the user has the superadmin role
//         if (userRole !== 'admin') {
//             // If the user is not a superadmin, redirect to the login page
//             router.push('/forbidden');
//             return;
//         }
//         const fetchPendingTasks = async () => {
//             try {
//               console.log('Fetching pending tasks...');
//               const token = localStorage.getItem('authToken');
//               const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/pending', {
//                 headers: {
//                   Authorization: token,
//                 },
//               });
          
//               console.log('API Response:', response.data);
          
//               if (response.status === 200) {
//                 // Check if the tasks property is an array
//                 if (Array.isArray(response.data.tasks)) {
//                   const tasksWithDetails = await Promise.all(
//                     response.data.tasks.map(async (task) => {
//                       let assigneeName = 'Employee Not Found';
//                       let assignedByName = 'Employee Not Found';
          
//                       try {
//                         // Fetch assignee name from SubEmployee model
//                         const assigneeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
//                           headers: {
//                             Authorization: token,
//                           },
//                         });
//                         if (assigneeResponse.status === 200) {
//                           assigneeName = assigneeResponse.data.name;
//                         }
//                       } catch (error) {
//                         console.error('Error fetching assignee name:', error.message);
//                       }
          
//                       try {
//                         // Fetch assignedBy name from SubEmployee model using assignedByEmp ID if assignedBy is empty
//                         if (!task.assignedBy && task.assignedByEmp) {
//                           const assignedByEmpResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignedByEmp}`, {
//                             headers: {
//                               Authorization: token,
//                             },
//                           });
//                           if (assignedByEmpResponse.status === 200) {
//                             assignedByName = assignedByEmpResponse.data.name;
//                           }
//                         } else if (task.assignedBy) {
//                           // If assignedBy is provided, fetch from Employee model
//                           const assignedByResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
//                             headers: {
//                               Authorization: token,
//                             },
//                           });
//                           if (assignedByResponse.status === 200) {
//                             assignedByName = assignedByResponse.data.name;
//                           }
//                         }
//                       } catch (error) {
//                         console.error('Error fetching assignedBy name:', error.message);
//                       }
          
//                       // Update task object
//                       return {
//                         ...task,
//                         assignTo: assigneeName,
//                         assignedBy: assignedByName,
//                         startDate: formatDate(task.startDate),
//                         deadlineDate: formatDate(task.deadlineDate),
//                       };
//                     })
//                   );
          
//                   console.log('All tasks with details:', tasksWithDetails);
//                   setTasks(tasksWithDetails);
//                 } else {
//                   console.error('API response is not an array:', response.data);
//                   setError('API response is not an array or no tasks found');
//                   setTasks([]);
//                 }
//               } else {
//                 console.error('Failed to fetch pending tasks');
//                 setError('Failed to fetch pending tasks');
//                 setTasks([]);
//               }
//             } catch (error) {
//               console.error('Error fetching pending tasks:', error);
//               setError('An error occurred while fetching pending tasks');
//             } finally {
//               setLoading(false);
//             }
//           };
//         fetchPendingTasks();
//     }, []);


//     const handleViewClick = (taskId) => {
//         // Find the selected task based on taskId
//         const task = tasks.find((t) => t._id === taskId);
//         setSelectedTask(task);
//         // Open the view modal
//         setViewModalOpen(true);
//     };

//     const closeViewModal = () => {
//         // Close the view modal
//         setViewModalOpen(false);
//     };
//     const exportToExcel = async () => {
//         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//         const fileExtension = '.xlsx';


//         // Filter and map the data including the header fields and employee names
//         const tasksToExport = filteredTasks.map(task => {
//             return {
//                 'Title': task.title,
//                 'Status': task.status,
//                 'StartDate': task.startDate,
//                 'DeadLine': task.deadlineDate,
//                 'AssignTo': task.assignTo, // Assign the name if available, otherwise use the ID
//             };
//         });

//         // Create a worksheet from the filtered task data
//         const ws = XLSX.utils.json_to_sheet(tasksToExport);
//         const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

//         // Convert the workbook to an array buffer
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

//         // Create a Blob from the array buffer
//         const data = new Blob([excelBuffer], { type: fileType });

//         // Set the filename and save the file using saveAs function
//         const fileName = 'Pending Tasks_list' + fileExtension;
//         saveAs(data, fileName);
//     };


//     return (
//         <>
//             <NavSide />
//             <div className="m-5 pl-1 md:pl-64 mt-20 font-sans">
//                 <h1 className="text-xl md:text-2xl font-bold mb-4 text-left text-orange-500">Pending Tasks</h1>
//                 <p className="mb-3 text-center justify-center mt-3 text-red-600">{error}</p>
//                 <div className="flex flex-col md:flex-row md:items-center mb-4">
//                     <label htmlFor="startDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
//                         Start Date :
//                     </label>
//                     <input
//                         type="date"
//                         name="startDate"
//                         value={startDate}
//                         onChange={handleDateChange}
//                         className="px-3 py-0.5 border border-gray-300 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
//                     />
//                     <label htmlFor="endDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
//                         End Date:
//                     </label>
//                     <input
//                         type="date"
//                         name="endDate"
//                         value={endDate}
//                         onChange={handleDateChange}
//                         className="px-3 py-0.5 border border-gray-300 w-full md:w-40 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
//                     />

//                     <select
//                         id="employee"
//                         name="employee"
//                         value={selectedEmployeeId}
//                         onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                         className="form-select border border-gray-300 p-1 rounded-lg cursor-pointer text-sm px-3"
//                     >
//                         <option value="">Select an employee</option>
//                         {employees.map((employee) => (
//                             <option key={employee.id} value={employee._id}>
//                                 {employee.name}
//                             </option>
//                         ))}
//                     </select>
//                     <button
//                         onClick={handleDateSearch}
//                         className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md ml-3 text-sm"
//                     >
//                         Go
//                     </button>
//                     <div className="flex justify-center items-center ml-5">
//                         <input
//                             type="text"
//                             placeholder="Search Tasks..."
//                             className="px-3 py-1 border border-gray-400 rounded-full w-full md:w-full text-sm"
//                             value={searchQuery}
//                             onChange={handleSearchInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="relative mb-7 md:mb-12">
//                     <button
//                         className="bg-green-700 text-white font-extrabold py-1 md:py-1.5 px-2 md:px-3 rounded-lg md:absolute -mt-2 md:-mt-12 top-0 right-0 text-sm md:text-sm flex items-center mr-1" // Positioning
//                         onClick={() => exportToExcel(filteredTasks)}                    >
//                         <FontAwesomeIcon icon={faFileExcel} className="text-lg mr-1 font-bold" />
//                         <span className="font-bold">Export</span>
//                     </button>
//                 </div>


//                 {loading ? (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
//                         <FontAwesomeIcon
//                             icon={faSpinner} // Use your FontAwesome spinner icon
//                             spin // Add the "spin" prop to make the icon spin
//                             className="text-white text-4xl" // You can customize the size and color
//                         />
//                     </div>
//                 ) : (

//                     <div className="overflow-x-auto -mt-3">
//                         <table className="min-w-full table-auto">
//                             <thead className='bg-orange-500 text-white'>
//                                 <tr>
//                                     <th className="px-4 py-2 text-center">Sr.No</th>
//                                     <th className="px-4 py-2 text-center">Task Title</th>
//                                     <th className="px-4 py-2 text-center">Status</th>
//                                     <th className="px-4 py-2 text-center">StartDate</th>
//                                     <th className="px-4 py-2 text-center">DeadLine</th>
//                                     <th className="px-4 py-2 text-center">AssignTo</th>
//                                     <th className="px-4 py-2 text-center">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {tasks.length > 0 ? (
//                                     currentTasks.map((task, index) => (
//                                         <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
//                                             <td className="border px-4 py-1.5 text-center font-semibold">{calculateSerialNumber(index)}</td>
//                                             <td className="border px-4 py-1.5 text-center text-orange-600 font-bold">
//                                                 {task.title}
//                                             </td>
//                                             <td className="border px-4 py-1.5 text-center">
//                                                 <span className='px-5 py-1.5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold'>Pending</span></td>
//                                             <td className="border px-4 py-1.5 text-center">{(task.startDate)}</td>
//                                             <td className="border px-4 py-1.5 text-center">{(task.deadlineDate)}</td>
//                                             <td className="border px-4 py-1.5 text-center font-semibold">{task.assignTo}</td>
//                                             <td className="border px-2 py-1.5">
//                                                 <FontAwesomeIcon
//                                                     icon={faEye}
//                                                     className="text-blue-500 hover:underline cursor-pointer text-sm ml-10"
//                                                     onClick={() => handleViewClick(task._id)}
//                                                     title='View'
//                                                 />
//                                                 <FontAwesomeIcon
//                                                     icon={faComment}
//                                                     className="text-yellow-600 cursor-pointer text-base text-right ml-5"
//                                                     onClick={() => handleRemarkClick(task._id)}
//                                                     title='Remark'
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
//                                             No Pending Tasks Found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                         <ul className="flex justify-center items-center mt-4">
//                             {Array.from({ length: Math.ceil(filteredTasks.length / tasksPerPage) }, (_, index) => (
//                                 <li key={index} className="px-3 py-2">
//                                     <button
//                                         onClick={() => paginate(index + 1)}
//                                         className={`${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
//                                             } px-4 py-2 rounded`}
//                                     >
//                                         {index + 1}
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>


//             {isRemarkModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 font-sans">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-4/5 max-h-screen flex flex-col">
//                         <h2 className="text-xl font-semibold mb-4 text-orange-600">Add Remark</h2>

//                         <div className="flex-1 overflow-y-auto mb-4">
//                             {sortedRemarks.length === 0 ? (
//                                 <div className="text-center text-gray-700 mt-20 font-semibold">No remarks found</div>
//                             ) : (
//                                 <div className="mb-1">
//                                     <h3 className="text-base font-semibold mb-2 text-green-950">Added Remarks:</h3>
//                                     {sortedRemarks.map((remarkObj, index) => (
//                                         <div key={index} className="mb-2 text-sm">
//                                             <span className="font-semibold">{remarkObj.assignedBy || remarkObj.assignedByEmp}:</span>
//                                             <span className="ml-2">{remarkObj.remark}</span>
//                                             <span className="ml-3">{formatTimestamp(remarkObj.timestamp)}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="mt-auto">
//                             <textarea
//                                 value={remark}
//                                 onChange={(e) => setRemark(e.target.value)}
//                                 placeholder="Enter your remark here"
//                                 className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
//                                 rows="4"
//                             />
//                             <div className="flex justify-end">
//                                 <button
//                                     onClick={handleAddRemark}
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
//                                 >
//                                     Add Remark
//                                 </button>
//                                 <button
//                                     onClick={() => setIsRemarkModalOpen(false)}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md ml-2 text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {/* View Task Modal */}
//             {viewModalOpen && selectedTask && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-container bg-white w-72 md:w-96 sm:p-6 text-xs md:text-base rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
//                         <div className="p-2 text-center">

//                             <h2 className="text-xl font-semibold mb-4">View Task</h2>
//                             <div>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>AssignTo:</strong> {selectedTask.assignTo}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>AssignedBy:</strong> {selectedTask.assignedBy}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Title:</strong> {selectedTask.title}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Description:</strong> {selectedTask.description}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Status:</strong> {selectedTask.status}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Date:</strong> {selectedTask.startDate}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Start Time:</strong> {selectedTask.startTime}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>DeadLine:</strong> {selectedTask.deadlineDate}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>End Time:</strong> {selectedTask.endTime}
//                                 </p>
//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>ReminderTime:</strong> {selectedTask.reminderTime ? selectedTask.reminderTime : 'Not added'}
//                                 </p>


//                                 <p className="mb-2 text-left justify-center">
//                                     <strong>Picture:</strong>{" "}
//                                     {selectedTask.picture ? (
//                                         <button
//                                             type="button"
//                                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2"
//                                             onClick={() => handlePicturePreview(selectedTask.picture)}
//                                         >
//                                             Preview
//                                         </button>
//                                     ) : (
//                                         "Not Added"
//                                     )}
//                                 </p>

//                                 <p className="mb-2 text-left flex item-center">
//                                     <span className='mr-1 '><strong>Audio:</strong></span>{" "}
//                                     {selectedTask.audio ? (
//                                         <audio controls className='w-64 h-8 md:w-96 md-h-10 text-lg'>
//                                             <source src={`http://103.159.85.246:4000/${selectedTask.audio}`} type="audio/mp3" />
//                                             Your browser does not support the audio element.
//                                         </audio>

//                                     ) : (
//                                         "Not Added"
//                                     )}
//                                 </p>

//                                 <p className='text-center'>
//                                     <button
//                                         className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
//                                         onClick={closeViewModal}
//                                     >
//                                         Close
//                                     </button>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {isPreviewModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-container bg-white w-72 md:w-80 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
//                         <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}></button>
//                         <div className="p-1 text-center">
//                             <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
//                             {/* <img src={completeImageUrl} alt="Preview" className="mb-2" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
//                             <Image
//                                 src={completeImageUrl}
//                                 alt="Preview"
//                                 width={400} // Adjust the width as needed
//                                 height={300} // Adjust the height as needed
//                             />
//                             <button
//                                 type="button"
//                                 className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
//                                 onClick={() => setIsPreviewModalOpen(false)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default PendingTasks;




'use client'

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner, faFileExcel,faCaretSquareRight,faCaretSquareLeft, faComment } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import NavSide from '../components/NavSide';
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


const PendingTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [completeImageUrl, setPreviewImageUrl] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(15); // Define tasks to show per page

    const [startDate, setStartDate] = useState(
        () => new Date().toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState(
        () => new Date().toISOString().split("T")[0]
    );
    const [searchTerm, setSearchTerm] = useState("");

    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [remark, setRemark] = useState("");
    const [remarksList, setRemarksList] = useState([]);
    const [empRemarksList, setEmpRemarksList] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const allRemarks = [...remarksList, ...empRemarksList];
    const sortedRemarks = allRemarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    
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
                `http://103.159.85.246:4000/api/task/tasks/${currentTaskId}/remarkToList`,
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

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError('');
          }, 2000);
    
          return () => clearTimeout(timer);
        }
      }, [error]);
    

    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Set the search term as the user types
        setCurrentPage(1); // Reset to the first page when searching
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        if (name === "startDate") {
            setStartDate(value);
        } else if (name === "endDate") {
            setEndDate(value);
        }
    };

    const handleDateSearch = async () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (end < start) {
            setError("End date cannot be earlier than start date.");
            setTasks([]);
            return;
        } else {
            setError("");
        }
    
        if (!selectedEmployeeId || !startDate || !endDate) {
            return;
        }
    
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://103.159.85.246:4000/api/task/tasks/pending", {
                headers: {
                    Authorization: token,
                },
                params: {
                    assignTo: selectedEmployeeId,
                    startDate,
                    endDate,
                },
            });
    
            if (response.status === 200) {
                const tasks = response.data.tasks; // Access the tasks property
                if (Array.isArray(tasks)) {
                    const tasksWithAssignedNames = await Promise.all(
                        tasks.map(async (task) => {
                            try {
                                // Fetch assignee name from SubEmployee model
                                const employeeResponse = await axios.get(
                                    `http://103.159.85.246:4000/api/subemployee/${task.assignTo}`,
                                    {
                                        headers: {
                                            Authorization: token,
                                        },
                                    }
                                );
    
                                let assignedByName = "Employee Not Found";
    
                                // Fetch assignedBy name from SubEmployee model using assignedByEmp ID if assignedBy is empty
                                if (!task.assignedBy && task.assignedByEmp) {
                                    const assignedByEmpResponse = await axios.get(
                                        `http://103.159.85.246:4000/api/subemployee/${task.assignedByEmp}`,
                                        {
                                            headers: {
                                                Authorization: token,
                                            },
                                        }
                                    );
                                    if (assignedByEmpResponse.status === 200) {
                                        assignedByName = assignedByEmpResponse.data.name;
                                    }
                                } else if (task.assignedBy) {
                                    // If assignedBy is provided, fetch from Employee model
                                    const assignedByNameResponse = await axios.get(
                                        `http://103.159.85.246:4000/api/employee/${task.assignedBy}`,
                                        {
                                            headers: {
                                                Authorization: token,
                                            },
                                        }
                                    );
                                    if (assignedByNameResponse.status === 200) {
                                        assignedByName = assignedByNameResponse.data.name;
                                    }
                                }
    
                                const assigneeName = employeeResponse.data.name;
    
                                // Format the date as dd/mm/yyyy
                                const formattedStartDate = formatDate(task.startDate);
                                const formattedDeadlineDate = formatDate(task.deadlineDate);
    
                                // Update the task object with the formatted date and name
                                return {
                                    ...task,
                                    startDate: formattedStartDate,
                                    deadlineDate: formattedDeadlineDate,
                                    assignTo: assigneeName,
                                    assignedBy: assignedByName
                                };
                            } catch (error) {
                                task.assigneeName = "Employee Not Found";
                                return task;
                            }
                        })
                    );
    
                    setTasks(tasksWithAssignedNames);
                    filterTasks(tasksWithAssignedNames);
                } else {
                    console.error("API response is not an array:", tasks);
                }
            } else if (response.status === 404) {
                setTasks([]);
            } else {
                console.error("Failed to fetch tasks");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error.response?.data || error.message);
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Pending tasks not found");
                } else {
                    setError("An error occurred while fetching tasks");
                }
            } else if (error.request) {
                setError("No response from server");
            } else {
                setError("Error in setting up the request");
            }
            setTasks([]);
        }
    };

    const filterTasks = (tasks) => {
        const filtered = tasks.filter((task) => {
            if (selectedEmployee && selectedEmployee !== "") {
                return task.assigneeName === selectedEmployee;
            }
            return true;
        });
        setFilteredTasks(filtered);
    };


    const calculateSerialNumber = (index) => {
        return index + (currentPage - 1) * tasksPerPage + 1;
    };


    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);

    const applySearchFilter = useCallback(() => {
        const filtered = tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.assignTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.deadlineDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTasks(filtered);
    }, [searchQuery, tasks])

    useEffect(() => {
        applySearchFilter();
    }, [searchQuery]);

    useEffect(() => {
        applySearchFilter();
    }, [searchTerm, tasks]);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = pageNumber => setCurrentPage(pageNumber);


    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const fetchEmployeeNames = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    "http://103.159.85.246:4000/api/employee/subemployees/list",
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                // Check the response structure
                console.log("Fetched employees:", response.data);

                // Ensure the response data is an array of employee objects with id and name
                setEmployees(response.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeNames();
    }, []);

    const handlePicturePreview = (imageUrl) => {
        const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`;
        setPreviewImageUrl(completeImageUrl);
        setIsPreviewModalOpen(true);
    };


    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

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
        if (userRole !== 'admin') {
            // If the user is not a superadmin, redirect to the login page
            router.push('/forbidden');
            return;
        }
        const fetchPendingTasks = async () => {
            try {
              console.log('Fetching pending tasks...');
              const token = localStorage.getItem('authToken');
              const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/pending', {
                headers: {
                  Authorization: token,
                },
              });
          
              console.log('API Response:', response.data);
          
              if (response.status === 200) {
                // Check if the tasks property is an array
                if (Array.isArray(response.data.tasks)) {
                  const tasksWithDetails = await Promise.all(
                    response.data.tasks.map(async (task) => {
                      let assigneeName = 'Employee Not Found';
                      let assignedByName = 'Employee Not Found';
          
                      try {
                        // Fetch assignee name from SubEmployee model
                        const assigneeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
                          headers: {
                            Authorization: token,
                          },
                        });
                        if (assigneeResponse.status === 200) {
                          assigneeName = assigneeResponse.data.name;
                        }
                      } catch (error) {
                        console.error('Error fetching assignee name:', error.message);
                      }
          
                      try {
                        // Fetch assignedBy name from SubEmployee model using assignedByEmp ID if assignedBy is empty
                        if (!task.assignedBy && task.assignedByEmp) {
                          const assignedByEmpResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignedByEmp}`, {
                            headers: {
                              Authorization: token,
                            },
                          });
                          if (assignedByEmpResponse.status === 200) {
                            assignedByName = assignedByEmpResponse.data.name;
                          }
                        } else if (task.assignedBy) {
                          // If assignedBy is provided, fetch from Employee model
                          const assignedByResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
                            headers: {
                              Authorization: token,
                            },
                          });
                          if (assignedByResponse.status === 200) {
                            assignedByName = assignedByResponse.data.name;
                          }
                        }
                      } catch (error) {
                        console.error('Error fetching assignedBy name:', error.message);
                      }
          
                      // Update task object
                      return {
                        ...task,
                        assignTo: assigneeName,
                        assignedBy: assignedByName,
                        startDate: formatDate(task.startDate),
                        deadlineDate: formatDate(task.deadlineDate),
                      };
                    })
                  );
          
                  console.log('All tasks with details:', tasksWithDetails);
                  setTasks(tasksWithDetails);
                } else {
                  console.error('API response is not an array:', response.data);
                  setError('API response is not an array or no tasks found');
                  setTasks([]);
                }
              } else {
                console.error('Failed to fetch pending tasks');
                setError('Failed to fetch pending tasks');
                setTasks([]);
              }
            } catch (error) {
              console.error('Error fetching pending tasks:', error);
              setError('An error occurred while fetching pending tasks');
            } finally {
              setLoading(false);
            }
          };
        fetchPendingTasks();
    }, []);


    const handleViewClick = (taskId) => {
        // Find the selected task based on taskId
        const task = tasks.find((t) => t._id === taskId);
        setSelectedTask(task);
        // Open the view modal
        setViewModalOpen(true);
    };

    const closeViewModal = () => {
        // Close the view modal
        setViewModalOpen(false);
    };
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
        const fileName = 'Pending Tasks_list' + fileExtension;
        saveAs(data, fileName);
    };


    return (
        <>
            <NavSide />
            <div className="m-5 pl-1 md:pl-64 mt-20 font-sans">
                <h1 className="text-xl md:text-2xl font-bold mb-4 text-left text-orange-500">Pending Tasks</h1>
                <p className="mb-3 text-center justify-center mt-3 text-red-600">{error}</p>
                <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <label htmlFor="startDate" className="flex flex-col ml-2 text-orange-800 font-semibold">
                        Start Date :
                    </label>
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
                        className="px-3 py-0.5 border border-gray-300 w-full md:w-40 rounded-md mb-2 md:mb-0 md:mr-2 ml-1 text-sm"
                    />

                    <select
                        id="employee"
                        name="employee"
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="form-select border border-gray-300 p-1 rounded-lg cursor-pointer text-sm px-3"
                    >
                        <option value="">Select an employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee._id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleDateSearch}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md ml-3 text-sm"
                    >
                        Go
                    </button>
                    <div className="flex justify-center items-center ml-5">
                        <input
                            type="text"
                            placeholder="Search Tasks..."
                            className="px-3 py-1 border border-gray-400 rounded-full w-full md:w-full text-sm"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                </div>
                <div className="relative mb-7 md:mb-12">
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
                        <table className="min-w-full table-auto">
                            <thead className='bg-orange-500 text-white'>
                                <tr>
                                    <th className="px-4 py-2 text-center">Sr.No</th>
                                    <th className="px-4 py-2 text-center">Task Title</th>
                                    <th className="px-4 py-2 text-center">Status</th>
                                    <th className="px-4 py-2 text-center">StartDate</th>
                                    <th className="px-4 py-2 text-center">DeadLine</th>
                                    <th className="px-4 py-2 text-center">AssignTo</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? (
                                    currentTasks.map((task, index) => (
                                        <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
                                            <td className="border px-4 py-1.5 text-center font-semibold">{calculateSerialNumber(index)}</td>
                                            <td className="border px-4 py-1.5 text-center text-orange-600 font-bold">
                                                {task.title}
                                            </td>
                                            <td className="border px-4 py-1.5 text-center">
                                                <span className='px-5 py-1.5 bg-blue-200 text-blue-800 rounded-full text-xs font-bold'>Pending</span></td>
                                            <td className="border px-4 py-1.5 text-center">{(task.startDate)}</td>
                                            <td className="border px-4 py-1.5 text-center">{(task.deadlineDate)}</td>
                                            <td className="border px-4 py-1.5 text-center font-semibold">{task.assignTo}</td>
                                            <td className="border px-2 py-1.5">
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className="text-blue-500 hover:underline cursor-pointer text-sm ml-10"
                                                    onClick={() => handleViewClick(task._id)}
                                                    title='View'
                                                />
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    className="text-yellow-600 cursor-pointer text-base text-right ml-5"
                                                    onClick={() => handleRemarkClick(task._id)}
                                                    title='Remark'
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
                                            No Pending Tasks Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                            ))}
                        </ul>
                    </div>
                )}
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
            {viewModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-container bg-white w-72 md:w-96 sm:p-6 text-xs md:text-base rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 text-center">

                            <h2 className="text-xl font-semibold mb-4">View Task</h2>
                            <div>
                                <p className="mb-2 text-left justify-center">
                                    <strong>AssignTo:</strong> {selectedTask.assignTo}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>AssignedBy:</strong> {selectedTask.assignedBy}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>Title:</strong> {selectedTask.title}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>Description:</strong> {selectedTask.description}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>Status:</strong> {selectedTask.status}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>Date:</strong> {selectedTask.startDate}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>Start Time:</strong> {selectedTask.startTime}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>DeadLine:</strong> {selectedTask.deadlineDate}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>End Time:</strong> {selectedTask.endTime}
                                </p>
                                <p className="mb-2 text-left justify-center">
                                    <strong>ReminderTime:</strong> {selectedTask.reminderTime ? selectedTask.reminderTime : 'Not added'}
                                </p>


                                <p className="mb-2 text-left justify-center">
                      <strong>Picture:</strong>{" "}
                      {selectedTask.pictures && selectedTask.pictures.length > 0 ? (
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2 text-sm"
                          onClick={() => {
                            setPreviewImages(selectedTask.pictures);
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

                                <p className="mb-2 text-left flex item-center">
                                    <span className='mr-1 '><strong>Audio:</strong></span>{" "}
                                    {selectedTask.audio ? (
                                        <audio controls className='w-64 h-8 md:w-96 md-h-10 text-lg'>
                                            <source src={`http://103.159.85.246:4000/${selectedTask.audio}`} type="audio/mp3" />
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

export default PendingTasks;