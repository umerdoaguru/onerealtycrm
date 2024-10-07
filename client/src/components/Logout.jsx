import React from 'react'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/UserSlice';
import {  useNavigate } from 'react-router-dom';


function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const handleLogout = () => {
    // Display a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to log out?');

    // If user confirms, dispatch the logout action and redirect
    if (confirmed) {
      dispatch(logoutUser());
      navigate('/');
    }
  };
  return (
  
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
  Logout
</button>
  )
}

export default Logout