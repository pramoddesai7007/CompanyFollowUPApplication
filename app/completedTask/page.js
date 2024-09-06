'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faFileExcel, faComment, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import NavSide from '../components/NavSide';
import * as XLSX from 'xlsx';
import { format, parse } from 'date-fns';
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

const CompletedTaskList = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false); // State for "View Task" modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [subemployees, setSubemployees] = useState([]); // State to store Subemployee names and ObjectIds
  const [successMessage, setSuccessMessage] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [completeImageUrl, setPreviewImageUrl] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Task modal
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [authenticated, setAuthenticated] = useState(true);
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false);
  const [completePictureUrl, setPreviewPictureUrl] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null); // State variable for error message

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15; // Number of tasks to display per page

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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);

      // Cleanup the timer if the component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

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



  const calculateSerialNumber = (index) => {
    return index + 1 + (currentPage - 1) * tasksPerPage;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
    // Convert input dates to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate the date range
    if (end < start) {
      setError("End date cannot be earlier than start date.");
      setCompletedTasks([]); // Clear tasks if dates are invalid
      return;
    } else {
      setError(""); // Clear error if dates are valid
    }

    if (!selectedEmployeeId || !startDate || !endDate) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://103.159.85.246:4000/api/task/tasks/completed", {
        headers: {
          Authorization: token,
        },
        params: {
          assignTo: selectedEmployeeId, // Pass employee ID as assignTo
          startDate,
          endDate,
        },
      });

      if (response.status === 200) {
        const completedTasks = response.data.completedTasks;

        if (Array.isArray(completedTasks)) {
          const tasksWithAssignedNames = await Promise.all(
            completedTasks.map(async (task) => {
              // Initialize variables to hold names
              let assigneeName = "Employee Not Found";
              let assignedByName = "Employee Not Found";

              try {
                // Fetch assignee name from SubEmployee model
                const assigneeResponse = await axios.get(
                  `http://103.159.85.246:4000/api/subemployee/${task.assignTo}`,
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                );
                if (assigneeResponse.status === 200) {
                  assigneeName = assigneeResponse.data.name;
                }
              } catch (error) {
                console.error("Error fetching assignee name:", error.message);
              }

              try {
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
                  const assignedByResponse = await axios.get(
                    `http://103.159.85.246:4000/api/employee/${task.assignedBy}`,
                    {
                      headers: {
                        Authorization: token,
                      },
                    }
                  );
                  if (assignedByResponse.status === 200) {
                    assignedByName = assignedByResponse.data.name;
                  }
                }
              } catch (error) {
                console.error("Error fetching assignedBy name:", error.message);
              }

              // Update task object
              task.assignTo = assigneeName;
              task.assignedBy = assignedByName;

              // Format and parse the startDate and deadlineDate
              const formattedStartDate = format(new Date(task.startDate), 'dd/MM/yyyy');
              task.startDate = parse(formattedStartDate, 'dd/MM/yyyy', new Date());
              const formattedDeadlineDate = format(new Date(task.deadlineDate), 'dd/MM/yyyy');
              task.deadlineDate = parse(formattedDeadlineDate, 'dd/MM/yyyy', new Date());

              return task;
            })
          );

          // Assuming filterTasks is a function that performs some task filtering logic
          filterTasks(tasksWithAssignedNames);
          setCompletedTasks(tasksWithAssignedNames);
        } else {
          console.error("API response is not an array:", completedTasks);
        }
      } else if (response.status === 404) {
        setCompletedTasks([]); // Clear tasks if none found
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      setCompletedTasks([]); // Clear tasks on error
    }
  };
  // const handleDateSearch = async () => {
  //   // Convert input dates to Date objects for comparison
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   // Validate the date range
  //   if (end < start) {
  //     setError("End date cannot be earlier than start date.");
  //     setCompletedTasks([]); // Clear tasks if dates are invalid
  //     return;
  //   } else {
  //     setError(""); // Clear error if dates are valid
  //   }

  //   if (!selectedEmployeeId || !startDate || !endDate) {
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get("http://103.159.85.246:4000/api/task/tasks/completed", {
  //       headers: {
  //         Authorization: token,
  //       },
  //       params: {
  //         assignTo: selectedEmployeeId, // Pass employee ID as assignTo
  //         startDate,
  //         endDate,
  //       },
  //     });

  //     if (response.status === 200) {
  //       const tasks = response.data.completedTasks;

  //       if (Array.isArray(tasks)) {
  //         const tasksWithDetails = await Promise.all(
  //           tasks.map(async (task) => {
  //             // Initialize variables to hold names
  //             let assigneeName = 'Employee Not Found';
  //             let assignedByName = 'Employee Not Found';

  //             try {
  //               // Fetch assignee name from SubEmployee model
  //               const assigneeResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
  //                 headers: {
  //                   Authorization: token,
  //                 },
  //               });
  //               if (assigneeResponse.status === 200) {
  //                 assigneeName = assigneeResponse.data.name;
  //               }
  //             } catch (error) {
  //               console.error('Error fetching assignee name:', error.message);
  //             }

  //             try {
  //               // Fetch assignedBy name from SubEmployee model using assignedByEmp ID if assignedBy is empty
  //               if (!task.assignedBy && task.assignedByEmp) {
  //                 const assignedByEmpResponse = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignedByEmp}`, {
  //                   headers: {
  //                     Authorization: token,
  //                   },
  //                 });
  //                 if (assignedByEmpResponse.status === 200) {
  //                   assignedByName = assignedByEmpResponse.data.name;
  //                 }
  //               } else if (task.assignedBy) {
  //                 // If assignedBy is provided, fetch from Employee model
  //                 const assignedByResponse = await axios.get(`http://103.159.85.246:4000/api/employee/${task.assignedBy}`, {
  //                   headers: {
  //                     Authorization: token,
  //                   },
  //                 });
  //                 if (assignedByResponse.status === 200) {
  //                   assignedByName = assignedByResponse.data.name;
  //                 }
  //               }
  //             } catch (error) {
  //               console.error('Error fetching assignedBy name:', error.message);
  //             }

  //             // Update task object
  //             return {
  //               ...task,
  //               assignTo: assigneeName,
  //               assignedBy: assignedByName,
  //               startDate: formatDate(task.startDate),
  //               deadlineDate: formatDate(task.deadlineDate),
  //             };
  //           })
  //         );

  //         // Filter tasks within the date range
  //         const filteredTasks = tasksWithDetails.filter(task => {
  //           const taskStartDate = new Date(task.startDate);
  //           const taskEndDate = new Date(task.deadlineDate);
  //           return taskStartDate >= start && taskEndDate <= end;
  //         });

  //         if (filteredTasks.length === 0) {
  //           // If no tasks within the date range, clear the tasks list
  //           setCompletedTasks([]);
  //           console.log('No tasks found within the selected date range.');
  //         } else {
  //           // Set tasks if any found within the date range
  //           setCompletedTasks(filteredTasks);
  //         }
  //       } else {
  //         console.error('API response is not an array:', response.data);
  //         setCompletedTasks([]); // Clear tasks if response is not an array
  //       }
  //     } else {
  //       console.error('Failed to fetch completed tasks:', response.status);
  //       setCompletedTasks([]); // Clear tasks on failure
  //     }
  //   } catch (error) {
  //     console.error('Error fetching completed tasks:', error.message);
  //     setCompletedTasks([]); // Clear tasks on error
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filterTasks = (tasks) => {
    const filtered = tasks.filter((task) => {
      if (selectedEmployee && selectedEmployee !== "") {
        return task.assigneeName === selectedEmployee;
      }
      return true;
    });
    setFilteredTasks(filtered);
  };


  const handlePicturePreview = (imageUrl) => {
    console.log(imageUrl)
    const completeImageUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
    console.log(completeImageUrl)
    setPreviewImageUrl(completeImageUrl);
    setIsPreviewModalOpen(true);
  };

  const handleImagePreview = (imageUrl) => {
    console.log(imageUrl)
    const completePictureUrl = `http://103.159.85.246:4000/${imageUrl}`; // Generate the complete image URL
    console.log(completePictureUrl)
    setPreviewPictureUrl(completePictureUrl);
    setIsImagePreviewModalOpen(true);
  };


  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  function formatDateList(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear();

    // Ensure two-digit formatting for day and month
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${year}`;
  }


  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    // setCurrentPage(1); // Reset to the first page when performing a search

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

    const fetchCompletedTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://103.159.85.246:4000/api/task/tasks/completed', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          if (Array.isArray(response.data.completedTasks)) {
            const tasksWithDetails = await Promise.all(
              response.data.completedTasks.map(async (task) => {
                // Initialize variables to hold names
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

            setCompletedTasks(tasksWithDetails);
          } else {
            console.error('API response is not an array:', response.data);
          }
        } else {
          console.error('Failed to fetch completed tasks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching completed tasks:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedTasks();

  }, []);


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

  useEffect(() => {
    if (!searchQuery) {
      // If the search query is empty, display all tasks
      setFilteredTasks(completedTasks);
    } else {
      const filtered = completedTasks.filter((completedTask) => {
        console.log(completedTask)
        const assigneeName = completedTask.assignTo.toLowerCase();
        const startDate = completedTask.startDate.toLowerCase();
        const deadlineDate = formatDate(completedTask.deadlineDate);
        const status = completedTask.status.toLowerCase();
        const title = completedTask.title.toLowerCase();
        const query = searchQuery.toLowerCase();

        return (
          assigneeName.includes(query) ||
          deadlineDate.includes(query) ||
          title.includes(query) ||
          status.includes(query) ||
          startDate.includes(query)
        );
      });

      setFilteredTasks(filtered);
    }
  }, [searchQuery, completedTasks]);



  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Handlers for navigating pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  useEffect(() => {
    // Fetch Subemployee names and ObjectIds and populate the dropdown list
    const fetchSubemployees = async () => {
      try {
        const response = await axios.get('http://103.159.85.246:4000/api/employee/subemployees/list', {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        const subemployeeData = response.data.map((subemployee) => ({
          _id: subemployee._id, // Assuming MongoDB ObjectId
          name: subemployee.name,
        }));

        setSubemployees(subemployeeData);
      } catch (error) {
        console.error('Error fetching Subemployee data:', error);
      }
    };

    fetchSubemployees();
  }, []);

  const closeViewModal = () => {
    setSelectedTask(null);
    setViewModalOpen(false);
  };

  const hideActions = typeof window !== 'undefined' ? window.localStorage.getItem('subUsername') : null;


  const openEditModal = (task) => {
    // Format the date to "yyyy-MM-dd" format
    console.log("openEdit Modal open")
    const formattedStartDate = task.startDate.split('T')[0];
    const formattedDeadlineDate = task.deadlineDate.split('T')[0];
    setEditedTask({ ...task, startDate: formattedStartDate, deadlineDate: formattedDeadlineDate });
    setIsEditModalOpen(true); // Open the Edit Modal
  };

  const saveChanges = async () => {
    try {
      // Format the date back to ISO format
      const formattedStartDate = editedTask.startDate + 'T00:00:00.000Z';
      const formattedDeadlineDate = editedTask.deadlineDate + 'T00:00:00.000Z';

      const updatedTaskData = {
        startDate: formattedStartDate,
        deadlineDate: formattedDeadlineDate,
        // assignTo: editedTask.assignTo, // Pass the ObjectId of the selected Subemployee
      };

      console.log(updatedTaskData);
      if (
        editedTask.startDate !== updatedTaskData.startDate ||
        editedTask.deadlineDate !== updatedTaskData.deadlineDate
      ) {
        await axios.put(`http://103.159.85.246:4000/api/task/open/${editedTask._id}`, updatedTaskData, {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        // Remove the task from the list
        setCompletedTasks(completedTasks.filter((task) => task._id !== editedTask._id));

        setSuccessMessage('Task marked as open successfully.');


        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);

        setEditedTask(null);
      } else {
        // Handle a case where no changes are made
        console.log("No changes made in the task.");
      }
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle errors here
    }
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const exportToExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const employeeNames = {}; // A map to store employee names

    // Fetch employee names
    await Promise.all(
      filteredTasks.map(async (task) => {
        if (!employeeNames[task.assignTo]) {
          try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://103.159.85.246:4000/api/subemployee/${task.assignTo}`, {
              headers: {
                Authorization: token,
              },
            });

            if (response.status === 200) {
              employeeNames[task.assignTo] = response.data.name;
            }
          } catch (error) {
            console.error(`Error fetching employee name for ID ${task.assignTo}:`, error);
          }
        }
      })
    );

    // Filter and map the data including the header fields and employee names
    const tasksToExport = filteredTasks.map(task => {
      const formattedStartDate = formatDate(task.startDate);
      const formattedDeadline = formatDate(task.deadlineDate);

      return {
        'Title': task.title,
        'Status': task.status,
        'StartDate': formattedStartDate,
        'DeadLine': formattedDeadline,
        'AssignTo': employeeNames[task.assignTo] || task.assignTo, // Assign the name if available, otherwise use the ID
      };
    });

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${day}-${month}-${year}`; // Change the date format here as needed
    }
    // Create a worksheet from the filtered task data
    const ws = XLSX.utils.json_to_sheet(tasksToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    // Convert the workbook to an array buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the array buffer
    const data = new Blob([excelBuffer], { type: fileType });

    // Set the filename and save the file using saveAs function
    const fileName = 'All_Task_list' + fileExtension;
    saveAs(data, fileName);
  };
  return (
    <>
      <NavSide />

      <div className="m-5 pl-1 md:pl-64 mt-20">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-orange-500 text-center md:text-left">Completed Tasks</h1>
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
          <div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className='bg-orange-500 text-white'>
                  <tr>
                    <th className="px-4 py-2">Sr. No.</th>
                    <th className="px-4 py-2">Task Title</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">StartedDate</th>
                    <th className="px-4 py-2">DeadLine</th>
                    <th className="px-4 py-2">Assigned To</th>
                    {!hideActions ? (
                      <th className="px-4 py-2">Actions</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.length > 0 ? (
                    currentTasks.map((task, index) => (
                      <tr key={task._id} className='hover:bg-gray-100 text-sm cursor-pointer'>
                        <td className="border px-4 py-1 text-center font-semibold">{calculateSerialNumber(index)}</td>
                        <td className="border px-4 py-1">
                          <div>
                            {/* <h2 className="font-bold text-blue-800 text-center">{task.title}</h2> */}
                            <td className="text-center text-blue-800 font-bold">{task.title.length > 30 ? `${task.title.slice(0, 30)}...` : task.title}</td>
                          </div>
                        </td>
                        <td className="border px-4 py-1 text-center">
                          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                        </td>
                        <td className="border px-4 py-1 text-center">{formatDateList(task.startDate)}</td>
                        <td className="border px-4 py-1 text-center">{formatDateList(task.deadlineDate)}</td>
                        <td className="border px-4 py-1 text-center font-semibold">{task.assignTo}</td>
                        <td className={`border px-4 py-1 text-center ${hideActions ? 'hidden' : ''}`}>
                          {!hideActions && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faEye}
                                className="text-blue-500 hover:underline mr-5 cursor-pointer pl-5 text-sm"
                                onClick={() => openViewModal(task)} // Add a View button here
                                title='View'
                              />

                              <FontAwesomeIcon
                                icon={faComment}
                                className="text-yellow-600 cursor-pointer text-base text-right"
                                onClick={() => handleRemarkClick(task._id)}
                                title='Remark'
                              />
                              <button
                                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-700 ml-4 text-sm"
                                onClick={() => openEditModal(task)}
                              >
                                Mark as Open
                              </button>
                            </div>

                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className='px-4 py-1 text-center border font-semibold'>
                        No Completed Tasks Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-md">
          {successMessage}
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

      {/* View Task Modal */}
      {viewModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
          <div className="modal-container bg-white w-72 md:w-96 p-3 text-sm md:text-base rounded-md mt-16 md:mt-10">
            <div className='p-2 text-center'>
              <h2 className="text-xl font-semibold mb-5 text-center">View Task</h2>
              {/* <div className='text-left pl-8'> */}
              {/* Display task details here */}

              <p className="mb-2 text-left justify-center">
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p className='mb-2 text-left justify-center'><strong>Assigned To:</strong> {selectedTask.assignTo}</p>
              <p className='mb-2 text-left justify-center'><strong>AssignedBy:</strong> {selectedTask.assignedBy}</p>
              <p className='mb-2 text-left justify-center'><strong>Description:</strong> {selectedTask.description}</p>
              <p className='mb-2 text-left justify-center'><strong>Status:</strong> Completed</p>
              <p className='mb-2 text-left justify-center'><strong>Date:</strong> {formatDateList(selectedTask.startDate)}</p>
              <p className='mb-2 text-left justify-center'><strong>StartTime:</strong> {(selectedTask.startTime)}</p>
              <p className='mb-2 text-left justify-center'><strong>DeadLine:</strong> {formatDateList(selectedTask.deadlineDate)}</p>
              <p className='mb-2 text-left justify-center'><strong>EndTime:</strong> {(selectedTask.endTime)}</p>


              <p className="mb-2 text-left justify-center">
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
      )}




      {isEditModalOpen && editedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
          <div className="bg-white p-4 w-72 md:w-96 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Task</h2>
            <div className="mb-4">
              <label htmlFor="startDate" className="block mb-1">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={editedTask.startDate}
                onChange={(e) => setEditedTask({ ...editedTask, startDate: e.target.value })}
                className="px-2 py-1 border rounded-md focus:ring focus:ring-indigo-400 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="deadlineDate" className="block mb-1">Deadline Date:</label>
              <input
                type="date"
                id="deadlineDate"
                value={editedTask.deadlineDate}
                onChange={(e) => setEditedTask({ ...editedTask, deadlineDate: e.target.value })}
                className="px-2 py-1 border rounded-md focus:ring focus:ring-indigo-400 w-full"
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2 text-sm md:text-base"
                onClick={saveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm md:text-base"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ... (existing code) */}
    </>
  );
};

export default CompletedTaskList;