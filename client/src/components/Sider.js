import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BsFileEarmarkPerson, BsHouse } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Sider = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getSidebarClass = (path) => {
    return location.pathname === path ? "bg-blue-800 shadow-lg" : "";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button - Hidden on large screens */}
      <button
        className="fixed top-14 md:top-20 left-4 z-50 text-black 
             sm:hidden md:block lg:hidden xl:block 2xl:hidden"
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={25} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed mt-[40px] md:mt-[70px] lg:mt-[60px] inset-y-0 left-0 bg-[#01060c] overflow-hidden xl:translate-x-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-20 md:w-[150px] z-50`}
      >
        {/* Close (Cross) Button - Hidden on large screens */}
        <button
          className="absolute top-3 right-3 text-white xl:hidden" // Hidden on large screens (lg)
          onClick={toggleSidebar}
        >
          <AiOutlineClose size={25} />
        </button>

        <div className="flex flex-col items-center pt-10 max-h-screen overflow-auto	">
          <ul className="flex flex-col items-center space-y-4 w-full pb-16">
            <li
              className={`w-full ${getSidebarClass("/Super-Admin-Dashboard")}`}
            >
              <Link
                to="/Super-Admin-Dashboard"
                className="flex flex-col items-center py-3"
              >
                <BsHouse className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Dashboard
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/leads")}`}>
              <Link to="/leads" className="flex flex-col items-center py-3">
                <FaHistory className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Leads
                </h3>
              </Link>
            </li>

            {/* <hr className="w-full border-gray-400" />
              <li className={`w-full ${getSidebarClass("/social-media-leads")}`}>
                <Link
                  to="/social-media-leads"
                  className="flex flex-col items-center py-3"
                >
                  <FaHistory className="text-white text-2xl md:text-3xl" />
                  <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                    Social Media <br /> <span>Leads</span>
                  </h3>
                </Link>
              </li> */}

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/reporting")}`}>
              <Link to="/reporting" className="flex flex-col items-center py-3">
                <RiSecurePaymentLine className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Reports
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/data-export")}`}>
              <Link
                to="/data-export"
                className="flex flex-col items-center py-3"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Data Export
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/quotation-invoice")}`}>
              <Link
                to="/quotation-section"
                className="flex flex-col items-center py-1"
              >
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Quotation <br /> <span>&</span> <br /> Invoice
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-management")}`}>
              <Link
                to="/employee-management"
                className="flex flex-col items-center py-3"
              >
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Employees Management
                </h3>
              </Link>
            </li>

            {/* <hr className="w-full border-gray-400" />
            <li className={`w-full ${getSidebarClass("/AdminManagement")}`}>
              <Link
                to="/AdminManagement"
                className="flex flex-col items-center py-3"
              >
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Admin Management
                </h3>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sider;
