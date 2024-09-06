// 'use client'

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavSide from '../components/NavSide';
// import NavSideEmp from '../components/NavSideEmp';
// import { faComment, faEye } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Image from 'next/image';




// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
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
// }


// const TodaysTask = () => {
//     const [todaysTasks, setTodaysTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
//     const [completePictureUrl, setPreviewPictureUrl] = useState('');
//     const [completeImageUrl, setPreviewImageUrl] = useState('');
//     const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
//         const fetchTodaysTasks = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/today', {
//                     headers: {
//                         Authorization: token,
//                     },
//                 });

//                 // Function to fetch the user's name based on their ID
//                 const fetchUserName = async (assignTo) => {
//                     try {
//                         const token = localStorage.getItem('authToken');
//                         const userResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${assignTo}`, {
//                             headers: {
//                                 Authorization: token,
//                             },
//                         });
//                         return userResponse.data.name; // Replace 'name' with the actual field containing the user's name.
//                     } catch (error) {
//                         console.error(`Error fetching user name for user ID ${assignTo}:`, error);
//                         return 'Unknown User'; // Default value or error handling as needed.
//                     }
//                 };

//                 // Update the 'assignTo' field with the user's name
//                 const tasksWithUserName = await Promise.all(
//                     response.data.todayAddedTasks.map(async (task) => {
//                         const userName = await fetchUserName(task.assignTo);
//                         return { ...task, assignTo: userName };
//                     })
//                 );

//                 setTodaysTasks(tasksWithUserName);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching today\'s tasks:', error);
//                 setLoading(false);
//             }
//         };

//         fetchTodaysTasks();
//     }, []);

//     const handleViewTask = (task) => {
//         setSelectedTask(task);
//         setViewModalOpen(true);
//     };

//     const handleCancelView = () => {
//         setViewModalOpen(false);
//         setSelectedTask(null);
//     };

//     const closeViewModal = () => {
//         setSelectedTask(null);
//         setViewModalOpen(false);
//     };

//     const handleImagePreview = (imageUrl) => {
//         console.log(imageUrl)
//         const completePictureUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
//         console.log(completePictureUrl)
//         setPreviewPictureUrl(completePictureUrl);
//         setIsImagePreviewModalOpen(true);
//     };

//     const handlePicturePreview = (imageUrl) => {
//         console.log(imageUrl)
//         const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
//         console.log(completeImageUrl)
//         setPreviewImageUrl(completeImageUrl);
//         setIsPreviewModalOpen(true);
//     };
//     return (
//         <>
//             <NavSide />

//             <div className="container mx-auto mt-20 m-10 pl-64">
//                 <h1 className="text-xl font-semibold mb-4 text-orange-500">Today&rsquo;s added Tasks</h1>
//                 {loading ? (
//                     <p className="text-gray-600">Loading today&rsquo;s tasks...</p>
//                 ) : (
//                     <div>

//                         <table className="min-w-full table-auto">
//                             <thead className='bg-orange-400 text-white'>
//                                 <tr>
//                                     <th className="px-4 py-2">SR No.</th>
//                                     <th className="px-4 py-2">Task</th>
//                                     <th className="px-4 py-2">Assigned To</th>
//                                     <th className="px-4 py-2">StartDate</th>
//                                     <th className="px-4 py-2">DeadLine</th>
//                                     <th className="px-4 py-2">Status</th>
//                                     <th className="px-4 py-2">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {todaysTasks.length > 0 ? (
//                                     todaysTasks.map((task, index) => (
//                                         <tr key={task._id} className='text-sm hover-bg-gray-100 cursor-pointer'>
//                                             <td className="border px-4 py-1.5 text-center">{index + 1}</td>
//                                             <td className="border px-4 py-1.5">
//                                                 <h2 className="font-medium text-blue-800 text-center">{task.title}</h2>
//                                             </td>
//                                             <td className="border px-4 py-1.5 text-center">{task.assignTo}</td>
//                                             <td className="border px-4 py-1.5 text-center">{formatDate(task.startDate)}</td>
//                                             <td className="border px-4 py-1.5 text-center">{formatDate(task.deadlineDate)}</td>
//                                             <td className="border px-4 py-1.5 text-center">
//                                                 <span className={`rounded-full font-bold px-5 py-1 ${task.status === 'completed' ? 'text-green-800 bg-green-200' :
//                                                     task.status === 'overdue' ? 'text-red-800 bg-red-200' :
//                                                         task.status === 'pending' ? 'text-blue-800 bg-blue-200' :
//                                                             ''
//                                                     }`}>
//                                                     {task.status}
//                                                 </span>
//                                             </td>
//                                             <td className="border px-4 py-1.5 text-center">
//                                                 <FontAwesomeIcon
//                                                     icon={faEye}
//                                                     className="text-blue-500 hover:underline mr-3 cursor-pointer pl-2"
//                                                     onClick={() => handleViewTask(task)}
//                                                 />
//                                                 <FontAwesomeIcon
//                                                     icon={faComment}
//                                                     className="text-yellow-600 cursor-pointer text-base text-right"
//                                                     onClick={() => handleRemarkClick(task._id)}
//                                                     title='Remark'
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
//                                             No Task Added Today.
//                                         </td>
//                                     </tr>
//                                 )
//                                 }
//                             </tbody>
//                         </table>

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





//             {viewModalOpen && selectedTask && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
//                     <div className="modal-container bg-white w-72 md:w-96 p-3 text-sm md:text-base rounded-md mt-16 md:mt-10">
//                         <div className='p-2 text-center'>
//                             <h2 className="text-xl font-semibold mb-5 text-center">View Task</h2>

//                             <p className="mb-2 text-left justify-center">
//                                 <strong>Title:</strong> {selectedTask.title}
//                             </p>
//                             <p className='mb-2 text-left justify-center'><strong>Description:</strong> {selectedTask.description}</p>
//                             <p className='mb-2 text-left justify-center'><strong>Status:</strong> {selectedTask.status}</p>
//                             <p className='mb-2 text-left justify-center'><strong>Date:</strong> {formatDate(selectedTask.startDate)}</p>
//                             <p className='mb-2 text-left justify-center'><strong>StartTime:</strong> {(selectedTask.startTime)}</p>
//                             <p className='mb-2 text-left justify-center'><strong>DeadLine:</strong> {formatDate(selectedTask.deadlineDate)}</p>
//                             <p className='mb-2 text-left justify-center'><strong>EndTime:</strong> {(selectedTask.endTime)}</p>
//                             <p className='mb-2 text-left justify-center'><strong>Assigned To:</strong> {selectedTask.assignTo}</p>


//                             <p className="mb-2 text-left justify-center">
//                                 <strong>Image by Receipient:</strong>{" "}
//                                 {selectedTask.imagePath ? (
//                                     <button
//                                         type="button"
//                                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2 text-sm"
//                                         onClick={() => handleImagePreview(selectedTask.imagePath)}
//                                     >
//                                         Preview
//                                     </button>
//                                 ) : (
//                                     "Not Added"
//                                 )}
//                             </p>

//                             <p className="mb-2 text-left justify-center">
//                                 <strong>Picture:</strong>{" "}
//                                 {selectedTask.picture ? (
//                                     <button
//                                         type="button"
//                                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2 text-sm"
//                                         onClick={() => handlePicturePreview(selectedTask.picture)}
//                                     >
//                                         Preview
//                                     </button>
//                                 ) : (
//                                     "Not Added"
//                                 )}
//                             </p>


//                             <p className="mb-2 text-left flex item-center">
//                                 <span className='mr-1 '><strong>Audio:</strong></span>{" "}
//                                 {selectedTask.audio ? (
//                                     <audio controls className='w-64 h-8 md:w-96 md-h-10 text-lg'>
//                                         <source src={`http://103.159.85.246:4000/${selectedTask.audio}`} type="audio/mp3" />
//                                         Your browser does not support the audio element.
//                                     </audio>

//                                 ) : (
//                                     "Not Added"
//                                 )}
//                             </p>

//                             <div className='text-center'>
//                                 <button
//                                     className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 mt-5"
//                                     onClick={closeViewModal}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                             {/* </div> */}
//                         </div>
//                     </div>
//                 </div>
//             )}


//             {isPreviewModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-container bg-white w-72 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
//                         <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}></button>
//                         <div className="p-1 text-center">
//                             <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
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


//             {isImagePreviewModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                     <div className="modal-container bg-white w-72 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
//                         <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsImagePreviewModalOpen(false)}></button>
//                         <div className="p-1 text-center">
//                             <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
//                             <Image
//                                 src={completePictureUrl}
//                                 alt="Preview"
//                                 width={500} // Adjust the width as needed
//                                 height={400} // Adjust the height as needed
//                             />
//                             <button
//                                 type="button"
//                                 className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
//                                 onClick={() => setIsImagePreviewModalOpen(false)}
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

// export default TodaysTask;






'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSide from '../components/NavSide';
import NavSideEmp from '../components/NavSideEmp';
import { faComment, faCaretSquareRight, faCaretSquareLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';




const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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


const TodaysTask = () => {
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
    const [completePictureUrl, setPreviewPictureUrl] = useState('');
    const [completeImageUrl, setPreviewImageUrl] = useState('');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [remark, setRemark] = useState("");
    const [remarksList, setRemarksList] = useState([]);
    const [empRemarksList, setEmpRemarksList] = useState([]);

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
        const fetchTodaysTasks = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/today', {
                    headers: {
                        Authorization: token,
                    },
                });

                // Function to fetch the user's name based on their ID
                const fetchUserName = async (assignTo) => {
                    try {
                        const token = localStorage.getItem('authToken');
                        const userResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${assignTo}`, {
                            headers: {
                                Authorization: token,
                            },
                        });
                        return userResponse.data.name; // Replace 'name' with the actual field containing the user's name.
                    } catch (error) {
                        console.error(`Error fetching user name for user ID ${assignTo}:`, error);
                        return 'Unknown User'; // Default value or error handling as needed.
                    }
                };

                // Update the 'assignTo' field with the user's name
                const tasksWithUserName = await Promise.all(
                    response.data.todayAddedTasks.map(async (task) => {
                        const userName = await fetchUserName(task.assignTo);
                        return { ...task, assignTo: userName };
                    })
                );

                setTodaysTasks(tasksWithUserName);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching today\'s tasks:', error);
                setLoading(false);
            }
        };

        fetchTodaysTasks();
    }, []);

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setViewModalOpen(true);
    };

    const handleCancelView = () => {
        setViewModalOpen(false);
        setSelectedTask(null);
    };

    const closeViewModal = () => {
        setSelectedTask(null);
        setViewModalOpen(false);
    };

    const handleImagePreview = (imageUrl) => {
        console.log(imageUrl)
        const completePictureUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
        console.log(completePictureUrl)
        setPreviewPictureUrl(completePictureUrl);
        setIsImagePreviewModalOpen(true);
    };

    const handlePicturePreview = (imageUrl) => {
        console.log(imageUrl)
        const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
        console.log(completeImageUrl)
        setPreviewImageUrl(completeImageUrl);
        setIsPreviewModalOpen(true);
    };
    return (
        <>
            <NavSide />

            <div className="container mx-auto mt-20 m-10 pl-64">
                <h1 className="text-xl font-semibold mb-4 text-orange-500">Today&rsquo;s added Tasks</h1>
                {loading ? (
                    <p className="text-gray-600">Loading today&rsquo;s tasks...</p>
                ) : (
                    <div>

                        <table className="min-w-full table-auto">
                            <thead className='bg-orange-400 text-white'>
                                <tr>
                                    <th className="px-4 py-2">SR No.</th>
                                    <th className="px-4 py-2">Task</th>
                                    <th className="px-4 py-2">Assigned To</th>
                                    <th className="px-4 py-2">StartDate</th>
                                    <th className="px-4 py-2">DeadLine</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todaysTasks.length > 0 ? (
                                    todaysTasks.map((task, index) => (
                                        <tr key={task._id} className='text-sm hover-bg-gray-100 cursor-pointer'>
                                            <td className="border px-4 py-1.5 text-center">{index + 1}</td>
                                            <td className="border px-4 py-1.5">
                                                <h2 className="font-medium text-blue-800 text-center">{task.title}</h2>
                                            </td>
                                            <td className="border px-4 py-1.5 text-center">{task.assignTo}</td>
                                            <td className="border px-4 py-1.5 text-center">{formatDate(task.startDate)}</td>
                                            <td className="border px-4 py-1.5 text-center">{formatDate(task.deadlineDate)}</td>
                                            <td className="border px-4 py-1.5 text-center">
                                                <span className={`rounded-full font-bold px-5 py-1 ${task.status === 'completed' ? 'text-green-800 bg-green-200' :
                                                    task.status === 'overdue' ? 'text-red-800 bg-red-200' :
                                                        task.status === 'pending' ? 'text-blue-800 bg-blue-200' :
                                                            ''
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-1.5 text-center">
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className="text-blue-500 hover:underline mr-3 cursor-pointer pl-2"
                                                    onClick={() => handleViewTask(task)}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    className="text-yellow-600 cursor-pointer text-base text-right"
                                                    onClick={() => handleRemarkClick(task._id)}
                                                    title='Remark'
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className='px-4 py-2 text-center border font-semibold'>
                                            No Task Added Today.
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>

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





            {viewModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
                    <div className="modal-container bg-white w-72 md:w-96 p-3 text-sm md:text-base rounded-md mt-16 md:mt-10">
                        <div className='p-2 text-center'>
                            <h2 className="text-xl font-semibold mb-5 text-center">View Task</h2>

                            <p className="mb-2 text-left justify-center">
                                <strong>Title:</strong> {selectedTask.title}
                            </p>
                            <p className='mb-2 text-left justify-center'><strong>Description:</strong> {selectedTask.description}</p>
                            <p className='mb-2 text-left justify-center'><strong>Status:</strong> {selectedTask.status}</p>
                            <p className='mb-2 text-left justify-center'><strong>Date:</strong> {formatDate(selectedTask.startDate)}</p>
                            <p className='mb-2 text-left justify-center'><strong>StartTime:</strong> {(selectedTask.startTime)}</p>
                            <p className='mb-2 text-left justify-center'><strong>DeadLine:</strong> {formatDate(selectedTask.deadlineDate)}</p>
                            <p className='mb-2 text-left justify-center'><strong>EndTime:</strong> {(selectedTask.endTime)}</p>
                            <p className='mb-2 text-left justify-center'><strong>Assigned To:</strong> {selectedTask.assignTo}</p>


                            {/* <p className="mb-2 text-left justify-center">
                                <strong>Image by Receipient:</strong>{" "}
                                {selectedTask.imagePath ? (
                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-1 ml-2 text-sm"
                                        onClick={() => handleImagePreview(selectedTask.imagePath)}
                                    >
                                        Preview
                                    </button>
                                ) : (
                                    "Not Added"
                                )}
                            </p> */}

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

                            <div className='text-center'>
                                <button
                                    className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 mt-5"
                                    onClick={closeViewModal}
                                >
                                    Close
                                </button>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            )}


            {isPreviewModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-container bg-white w-full md:w-1/3 h-2/3 p-6 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
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
                                            className="max-w-64 max-h-64 object-contain"
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

            {/* 
            {isImagePreviewModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-container bg-white w-72 p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsImagePreviewModalOpen(false)}></button>
                        <div className="p-1 text-center">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Image Preview</h3>
                            <Image
                                src={completePictureUrl}
                                alt="Preview"
                                width={500} // Adjust the width as needed
                                height={400} // Adjust the height as needed
                            />
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded mt-4 mr-2"
                                onClick={() => setIsImagePreviewModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

        </>
    );
};

export default TodaysTask;
