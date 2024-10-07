import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import img from '../../images/lead_profile.png'; // Assuming this will be the employee's image as well
import MainHeader from '../MainHeader';
import EmployeeSider from './EmployeeSider';
import { useSelector } from 'react-redux';

const mockEmployeeData = {
    employeeId: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    salary: "50000.00",
    position: "Software Engineer",
    designation: "Developer",
    createdTime: "2024-09-01 12:00:00",
    signature: "john-sign.png",
    photo: "john-profile.png"
  };

function EmployeeProfile() {
  const [user, setUser] = useState([]); // Initialize state for employee data
  const EmpId = useSelector(state => state.auth.user.id);
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api//employeeProfile/${EmpId}`); // Fetch employee data
        setUser(response.data[0]); // Set employee data to state
        console.log(response.data); // Debug: log employee data
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, [EmpId]);

  // Mock data for testing (remove once API is working)



  return (
    <>
         <MainHeader/>
         <EmployeeSider/>
      <div className="container mt-[5rem]">
        <h1 className="text-2xl text-center mt-[2rem]">Employee Profile</h1>
        <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
        <div className="flex flex-wrap mb-4">
          <div className="w-full lg:w-1/3">
            <img
              src={user.photo ? `path_to_images/${user.photo}` : img} // Use employee photo if available
              alt="employee-profile"
              className="rounded-lg"
            />
          </div>
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              <div>
                <label className="text-info">Employee ID</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.employeeId}</p>
                </div>
              </div>

              <div>
                <label className="text-info">Name</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.name}</p>
                </div>
              </div>

              <div>
                <label className="text-info">Email</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.email}</p>
                </div>
              </div>

              <div>
                <label className="text-info">Phone</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-info">Position</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.position}</p>
                </div>
              </div>

              <div>
                <label className="text-info">Salary</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{user.salary}</p>
                </div>
              </div>


              <div>
                <label className="text-info">Created Date</label>
                <div className="p-2 bg-gray-100 rounded">
                  <p className="m-0">{moment(user.createdTime).format('DD/MM/YYYY')}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeProfile;