live: http://localhost:9000
// Sidebar.js
import React, { useState } from "react";

const Sider = () => {
const [isOpen, setIsOpen] = useState(false);

const toggleSidebar = () => {
setIsOpen(!isOpen);
};

return (

<div>
{/_ Hamburger Menu for Mobile _/}
<div className="md:hidden">
<button
          id="hamburger-btn"
          className="flex items-center p-2 text-white"
          onClick={toggleSidebar}
        >
<svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
<path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
</svg>
</button>
</div>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gray-800 border-r border-gray-700 sm:translate-x-0 md:w-[160px] lg:w-[160px]`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3">Kanban</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  3
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3">Users</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>

);
};

export default Sider;

///////
{/\* <div className="flex justify-items-start max-w-full">

<div>
<Sider />
</div>
<div className="flex flex-col items-center text-center mt-36">
{" "}

          <h1 className="text-blue-900 ">Admin Management</h1>
        </div>
      </div> */}

///add admin
{/_ Form to add new admin _/}
{/_ <div className="bg-gray-50 p-4 rounded mb-6">
<h3 className="text-xl font-semibold mb-3">Add New Admin</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<input
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-2 border rounded"
              />
<input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-2 border rounded"
              />
<input
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="p-2 border rounded"
              />
<input
                type="text"
                name="position"
                value={newAdmin.position}
                onChange={handleInputChange}
                placeholder="Position"
                className="p-2 border rounded"
              />
<input
                type="text"
                name="phone"
                value={newAdmin.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="p-2 border rounded"
              />
<input
                type="text"
                name="salary"
                value={newAdmin.salary}
                onChange={handleInputChange}
                placeholder="Salary"
                className="p-2 border rounded"
              />
</div>
<button
              onClick={handleAddAdmin}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
<BsPlusCircle className="inline-block mr-2" /> Add Admin
</button>
</div> _/}
