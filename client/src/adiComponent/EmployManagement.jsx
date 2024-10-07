import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencilSquare, BsTrash, BsPlusCircle } from 'react-icons/bs';
import Modal from '../adiComponent/Modal'; // Assuming you have a modal component
import Sider from '../components/Sider';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MainHeader from '../components/MainHeader';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password:'',
    position: '',
    phone: '',
    salary: '' // Added salary to the state
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/getAllEmployees');
      const { employees } = response.data;
      setEmployees(employees || []); // Ensure employees is always an array
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For phone number, allow only numeric values
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only digits and limit to 10 characters
      setNewEmployee((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyPress = (e) => {
    // Allow only numeric keys and control keys (e.g., backspace, arrow keys)
    if (e.target.name === 'phone') {
      if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  const validateForm = async () => {
    const errors = {};

    // Validate Name
    if (!newEmployee.name) errors.name = 'Name is required';

    // Validate Email
    if (!newEmployee.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) errors.email = 'Email is invalid';
    else if (await isEmailTaken(newEmployee.email)) errors.email = 'Email is already taken';

    // Validate Password
    if (!newEmployee.password) errors.password = 'Password is required';

    // Validate Position
    if (!newEmployee.position) errors.position = 'Position is required';

    // Validate Phone
    if (!newEmployee.phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(newEmployee.phone)) errors.phone = 'Phone number must be 10 digits';

    // Validate Salary
    if (!newEmployee.salary) errors.salary = 'Salary is required';
    else if (isNaN(newEmployee.salary) || newEmployee.salary <= 0) errors.salary = 'Salary must be a positive number';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isEmailTaken = async (email) => {
    try {
      const response = await axios.get('https://crmdemo.vimubds5.a2hosted.com/api/checkEmail', {
        params: { email },
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false; // Assuming email check fails means it's not taken
    }
  };

  const handleSaveEmployee = async () => {
    if (!await validateForm()) return; // Stop saving if validation fails

    try {
      if (editingIndex !== null) {
        // Update existing employee
        const employeeToUpdate = employees[editingIndex];
        await axios.put(`https://crmdemo.vimubds5.a2hosted.com/api/updateEmployee/${employeeToUpdate.employeeId}`, newEmployee);
      } else {
        // Add new employee
        await axios.post('https://crmdemo.vimubds5.a2hosted.com/api/addEmployee', newEmployee);
      }
      setNewEmployee({
        name: '',
        email: '',
        password:'',
        position: '',
        phone: '',
        salary: '' // Reset salary field
      });
      setShowForm(false);
      fetchEmployees(); // Fetch employees to update the list
    } catch (error) {
      console.error('Error saving employee:', error.response?.data || error.message);
    }
  };

  const handleEditEmployee = (index) => {
    const employeeToEdit = employees[index];
    setNewEmployee({
      name: employeeToEdit.name,
      email: employeeToEdit.email,
      password: employeeToEdit.password,
      position: employeeToEdit.position,
      phone: employeeToEdit.phone,
      salary: employeeToEdit.salary // Set salary for editing
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this employee?');
    if (isConfirmed) {
      try {
        await axios.delete(`https://crmdemo.vimubds5.a2hosted.com/api/deleteEmployee/${employeeId}`);
        fetchEmployees(); // Fetch employees to update the list
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee-single/${employeeId}`); 
  };

  return (

    <>
     <MainHeader/>
     <Sider/>
     <div className=" container px-3 pt-5">
      <h1 className="text-2xl text-center mt-[2rem] font-medium">Employee Management</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      </div>

     <div className=" container  mt-12 flex flex-col min-h-screen lg:flex-row">
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col-reverse items-start justify-between mb-8 lg:flex-row lg:items-center">
       
          <button
            onClick={() => { setShowForm(true); setEditingIndex(null); }}
            className="flex items-center px-4 py-2 font-medium text-white transition duration-200 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
          >
            <BsPlusCircle className="mr-2 font-medium" /> Add Employee
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-sm font-semibold text-left text-gray-600 uppercase bg-gray-200">
                <th className="px-4 py-3 sm:px-6">Name</th>
                <th className="px-4 py-3 sm:px-6">Email</th>
                <th className="px-4 py-3 sm:px-6">Role</th>
                <th className="px-4 py-3 sm:px-6">Phone</th>
                <th className="px-4 py-3 sm:px-6">Salary</th> {/* Added Salary Column */}
                <th className="px-4 py-3 sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees
                  .filter((employee) => employee && employee.name) // Ensure employee and employee.name exist
                  .map((employee, index) => (
                    <tr
                      key={employee.employeeId}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleEmployeeClick(employee.employeeId)} // Navigate on row click
                    >
                      <td className="px-4 py-4 sm:px-6">{employee.name}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.email}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.position}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.phone}</td>
                      <td className="px-4 py-4 sm:px-6">{employee.salary}</td> {/* Display Salary */}
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex space-x-2 sm:space-x-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditEmployee(index); }} // Now index is available
                            className="text-blue-500 transition duration-200 hover:text-blue-600"
                          >
                            <BsPencilSquare size={20} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(employee.employeeId); }}
                            className="text-red-500 transition duration-200 hover:text-red-600"
                          >
                            <BsTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <h3 className="mb-4 text-lg font-bold">{editingIndex !== null ? "Edit Employee" : "Add Employee"}</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={`p-2 border rounded-lg ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}

            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`p-2 border rounded-lg ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
          
            <input
              type="text"
              name="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              placeholder="password"
              className={`p-2 border rounded-lg ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
          
           
            <input
              type="text"
              name="position"
              value={newEmployee.position}
              onChange={handleInputChange}
              placeholder="Position"
              className={`p-2 border rounded-lg ${validationErrors.position ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.position && <p className="text-sm text-red-500">{validationErrors.position}</p>}

            <input
              type="text"
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Phone"
              className={`p-2 border rounded-lg ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}

            <input
              type="text"
              name="salary"
              value={newEmployee.salary}
              onChange={handleInputChange}
              placeholder="Salary"
              className={`p-2 border rounded-lg ${validationErrors.salary ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.salary && <p className="text-sm text-red-500">{validationErrors.salary}</p>}
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={() => setShowForm(false)} // Cancel button to close modal
              className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEmployee}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {editingIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </Modal>
      </main>
    </div>
    </>
   
  );
};

export default EmployeeManagement;
