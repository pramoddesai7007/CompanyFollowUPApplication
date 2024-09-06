
// 'use client'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import NavSide from '../components/NavSide';
// import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import jwtDecode from 'jwt-decode';
// import { useRouter } from 'next/navigation';

// const IPManagement = () => {
//     const [ipAddress, setIpAddress] = useState('');
//     const [ipList, setIpList] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [adminCompanyName, setAdminCompanyName] = useState('');

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
//     }, []);




//     useEffect(() => {
//         fetchIPAddresses();
//         decodeAuthToken(); // Decode auth token on component mount
//     }, []);

//     const fetchIPAddresses = async () => {
//         try {
//             const response = await axios.get('http://103.159.85.246:4000/api/salary/ip', {
//                 headers: {
//                     'Authorization': `${localStorage.getItem('authToken')}`
//                 }
//             });
//             setIpList(response.data);
//         } catch (error) {
//             console.error('Error fetching IP addresses:', error);
//             showError('Failed to fetch IP addresses');
//         }
//     };

//     const fetchUserIPAddress = async () => {
//         try {
//             const response = await axios.get('http://103.159.85.246:4000/api/gateWayIp/get');
//             console.log(response)
//             setIpAddress(response.data.gatewayIp);
//         } catch (error) {
//             console.error('Error fetching user IP address:', error);
//             showError('Failed to fetch user IP address');
//         }
//     };

//     const handleAddIP = async () => {
//         try {
//             if (!ipAddress) {
//                 showError('IP address cannot be empty');
//                 return;
//             }
//             await axios.post('http://103.159.85.246:4000/api/location/saveLocation', { ip: ipAddress }, {
//                 headers: {
//                     'Authorization': `${localStorage.getItem('authToken')}`
//                 }
//             });
//             setIpAddress('');
//             fetchIPAddresses();
//             setErrorMessage('');
//         } catch (error) {
//             console.error('Error adding IP address:', error);
//             showError('IP address already added');
//         }
//     };

//     const decodeAuthToken = () => {
//         const authToken = localStorage.getItem('authToken');
//         if (authToken) {
//             const decodedToken = jwtDecode(authToken);
//             setAdminCompanyName(decodedToken.adminCompanyName);
//         }
//     };

//     const showError = (message) => {
//         setErrorMessage(message);
//         setTimeout(() => {
//             setErrorMessage('');
//         }, 2000);
//     };

//     return (
//         <>
//             <NavSide />
//             <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4 mt-20 border-gray-300 border">
//                 <div>
//                     <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address:</label>
//                     <input
//                         id="ipAddress"
//                         type="text"
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         value={ipAddress}
//                         onChange={(e) => setIpAddress(e.target.value)}
//                     />
//                 </div>

//                 <div className='justify-between'>
//                 <button
//                     className="inline-flex items-center px-10 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-5"
//                     onClick={handleAddIP}
//                 >
//                     Add IP
//                 </button>
//                 <button
//                     className="inline-flex items-center px-8 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 mt-2"
//                     onClick={fetchUserIPAddress}
//                 >
//                     <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
//                     Fetch IP
//                 </button>
//                 </div>
//                 {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
//                 <h3 className="text-base font-medium">Stored IP Addresses:</h3>
//                 <div className="mt-4 overflow-y-auto max-h-80">
//                     <ul className="mt-2 border border-gray-200 divide-y divide-gray-200 rounded-md font-semibold">
//                         {ipList.map((ip, index) => (
//                             <li key={index} className="px-4 py-3 text-sm">
//                                 {ip}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default IPManagement;




// 'use client'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import NavSide from '../components/NavSide';
// import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import jwtDecode from 'jwt-decode';
// import { useRouter } from 'next/navigation';

// const IPManagement = () => {
//     const [ipAddress, setIpAddress] = useState('');
//     const [latitude, setLatitude] = useState('');
//     const [longitude, setLongitude] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [adminCompanyName, setAdminCompanyName] = useState('');
//     const [ipList, setIpList] = useState([]); // Initialize as an empty array

//     const router = useRouter();

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             router.push('/login');
//             return;
//         }

//         const decodedToken = jwtDecode(token);
//         const userRole = decodedToken.role || 'guest';

//         if (userRole !== 'admin') {
//             router.push('/forbidden');
//             return;
//         }

//         setAdminCompanyName(decodedToken.adminCompanyName);
//     }, []);

//     useEffect(() => {
//         fetchIPAddresses();
//     }, []);

//     const fetchIPAddresses = async () => {
//         try {
//             const response = await axios.get('http://103.159.85.246:4000/api/salary/ip', {
//                 headers: {
//                     'Authorization': `${localStorage.getItem('authToken')}`
//                 }
//             });
//             setIpList(response.data);
//         } catch (error) {
//             console.error('Error fetching IP addresses:', error);
//             showError('Failed to fetch IP addresses');
//         }
//     };

//     const fetchGeolocationData = async () => {
//         try {
//             const { data: { ip, latitude, longitude } } = await axios.get('https://ipapi.co/json/');
//             setIpAddress(ip);
//             setLatitude(latitude);
//             setLongitude(longitude);
//         } catch (error) {
//             console.error('Error fetching geolocation data:', error);
//             showError('Failed to fetch geolocation data');
//         }
//     };
    

//     const handleAddLocation = async () => {
//         try {
//             if (!latitude || !longitude || !ipAddress) {
//                 showError('Fields cant be empty');
//                 return;
//             }
       
//             await axios.post('http://103.159.85.246:4000/api/salary/ip', {
//                 adminCompanyName,
//                 latitude,
//                 longitude,
//                 ip: ipAddress
//             }, {
//                 headers: {
//                     'Authorization': `${localStorage.getItem('authToken')}`
//                 }
//             });
//             setIpAddress('');
//             setLatitude('');
//             setLongitude('');
//             setErrorMessage('');
//             fetchIPAddresses();
//         } catch (error) {
//             console.error('Error adding location:', error);
//             showError('Location already added');
// }
//     };

//     const showError = (message) => {
//         setErrorMessage(message);
//         setTimeout(() => {
//             setErrorMessage('');
//         }, 2000);
//     };

//     return (
//         <>
//             <NavSide />
//             <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4 mt-20 border-gray-300 border">

//                 <h1 className='text-lg text-orange-600 font-bold'> Add Lat./Long. Location </h1>
//                 <div>
//                     <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address:</label>
//                     <input
//                         id="ipAddress"
//                         type="text"
//                         className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         value={ipAddress}
//                         readOnly
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude:</label>
//                     <input
//                         id="latitude"
//                         type="text"
//                         className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         value={latitude}
//                         readOnly
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude:</label>
//                     <input
//                         id="longitude"
//                         type="text"
//                         className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         value={longitude}
//                         readOnly
//                     />
//                 </div>
//                 <div className='justify-between'>
//                 <button
//                     className="inline-flex items-center px-10 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-5"
//                     onClick={handleAddLocation}
//                     >
//                     Add Loc
//                 </button>
//                 <button
//                     className="inline-flex items-center px-8 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 mt-2"
//                     onClick={fetchGeolocationData}
//                     >
//                     <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
//                     Fetch Loc
//                 </button>
//                 </div>

//                 {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
//                 <h3 className="text-base font-medium">Stored Location:</h3>
//                 <div className="mt-2 overflow-y-auto max-h-80">
//                     <ul className="mt-2 border border-gray-200 divide-y divide-gray-200 rounded-md font-semibold bg-blue-100">
//                         {ipList.map((ip, index) => (
//                             <li key={index} className="px-4 py-3 text-sm flex flex-col space-y-1">
//                                 <span className="font-medium">{ip.ip}</span>
//                                 <div className="text-gray-600 text-xs">
//                                     <span className="block">Latitude: {ip.latitude}</span>
//                                     <span className="block">Longitude: {ip.longitude}</span>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default IPManagement;

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavSide from "../components/NavSide";
import { faArrowsRotate, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

const IPManagement = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [adminCompanyName, setAdminCompanyName] = useState("");
  const [ipList, setIpList] = useState([]); // Initialize as an empty array

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role || "guest";

    if (userRole !== "admin") {
      router.push("/forbidden");
      return;
    }

    setAdminCompanyName(decodedToken.adminCompanyName);
  }, []);

  useEffect(() => {
    fetchIPAddresses();
  }, []);

  const fetchIPAddresses = async () => {
    try {
      const response = await axios.get("http://103.159.85.246:4000/api/salary/ip", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });
      setIpList(response.data);
    } catch (error) {
      console.error("Error fetching IP addresses:", error);
      showError("Failed to fetch IP addresses");
    }
  };

  const fetchGeolocationData = async () => {
    try {
      const {
        data: { ip, latitude, longitude },
      } = await axios.get("https://ipapi.co/json/");
      setIpAddress(ip);
      setLatitude(latitude);
      setLongitude(longitude);
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
      showError("Failed to fetch geolocation data");
    }
  };

  const handleAddLocation = async () => {
    try {
      if (!latitude || !longitude || !ipAddress) {
        showError("Fields cant be empty");
        return;
      }

      await axios.post(
        "http://103.159.85.246:4000/api/salary/ip",
        {
          adminCompanyName,
          latitude,
          longitude,
          ip: ipAddress,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        }
      );
      setIpAddress("");
      setLatitude("");
      setLongitude("");
      setErrorMessage("");
      fetchIPAddresses();
    } catch (error) {
      console.error("Error adding location:", error);
      showError("Location already added");
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  const handleDeleteLocation = async (ip) => {
    try {
      await axios.delete("http://103.159.85.246:4000/api/salary/ip", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
        data: { ip }, // Sending the IP in the request body
      });
      fetchIPAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting location:", error);
      showError("Failed to delete location");
    }
  };

  
  return (
    <>
      <NavSide />
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4 mt-20 border-gray-300 border">
        <h1 className="text-lg text-orange-600 font-bold">
          {" "}
          Add Lat./Long. Location{" "}
        </h1>
        <div>
          <label
            htmlFor="ipAddress"
            className="block text-sm font-medium text-gray-700"
          >
            IP Address:
          </label>
          <input
            id="ipAddress"
            type="text"
            className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={ipAddress}
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude:
          </label>
          <input
            id="latitude"
            type="text"
            className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={latitude}
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude:
          </label>
          <input
            id="longitude"
            type="text"
            className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={longitude}
            readOnly
          />
        </div>
        <div className="justify-between">
          <button
            className="inline-flex items-center px-10 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-5"
            onClick={handleAddLocation}
          >
            Add Loc
          </button>
          <button
            className="inline-flex items-center px-8 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 mt-2"
            onClick={fetchGeolocationData}
          >
            <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
            Fetch Loc
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
        <h3 className="text-base font-medium">Stored Location:</h3>
        <div className="mt-2 overflow-y-auto max-h-80">
          <ul className="mt-2 border border-gray-200 divide-y divide-gray-200 rounded-md font-semibold bg-blue-100">
            {ipList.map((ip, index) => (
              <li
                key={index}
                className="px-4 py-3 text-sm flex justify-between items-center space-y-1"
              >
                <div>
                  <span className="font-medium">{ip.ip}</span>
                  <div className="text-gray-600 text-xs">
                    <span className="block">Latitude: {ip.latitude}</span>
                    <span className="block">Longitude: {ip.longitude}</span>
                  </div>
                </div>
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteLocation(ip.ip)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default IPManagement;


