

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FaHistory } from "react-icons/fa";
// import { RiSecurePaymentLine } from "react-icons/ri";
// import { BsFileEarmarkPerson, BsHouse } from "react-icons/bs";
// import { MdOutlineManageAccounts } from "react-icons/md";
// import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

// const EmployeeSider = () => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);

//   const getSidebarClass = (path) => {
//     return location.pathname === path ? "bg-blue-800 shadow-lg" : "";
//   };

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       {/* Hamburger Button - Hidden on large screens */}
//       <button
//         className="fixed top-18 md:top-14 left-4 z-50 text-black lg:hidden" // Hidden on large screens (lg)
//         onClick={toggleSidebar}
//       >
//         <AiOutlineMenu size={25} />
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed mt-12 inset-y-0 left-0 bg-[#01060c] overflow-hidden lg:translate-x-0 transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out lg:w-40 md:w-20 lg:block`}
//       >
//         {/* Close (Cross) Button - Hidden on large screens */}
//         <button
//           className="absolute top-3 right-3 text-white lg:hidden" // Hidden on large screens (lg)
//           onClick={toggleSidebar}
//         >
//           <AiOutlineClose size={25} />
//         </button>

//         <div className="flex flex-col items-center pt-10">
//           <ul className="flex flex-col items-center space-y-4 w-full">
//             <li className={`w-full ${getSidebarClass("/employees-dashboard")}`}>
//               <Link to="/employees-dashboard" className="flex flex-col items-center py-3">
//                 <BsHouse className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-sm lg:text-base">
//                   Dashboard
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />

//             <li className={`w-full ${getSidebarClass("/employee-leads")}`}>
//               <Link to="/employee-leads" className="flex flex-col items-center py-3">
//                 <FaHistory className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-sm lg:text-base">
//                  Assigned Leads
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />

//             <li className={`w-full ${getSidebarClass("/employee-report")}`}>
//               <Link to="/employee-report" className="flex flex-col items-center py-3">
//                 <RiSecurePaymentLine className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-sm lg:text-base">
//                   Report
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />

//             <li className={`w-full ${getSidebarClass("/employee-data-export")}`}>
//               <Link to="/employee-data-export" className="flex flex-col items-center py-3">
//                 <BsFileEarmarkPerson className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-sm lg:text-base">
//                   Data Export
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />

//             <li className={`w-full ${getSidebarClass("/employee-quotation-invoice")}`}>
//               <Link to="/employee-quotation-invoice" className="flex flex-col items-center py-1">
//                 <BsFileEarmarkPerson className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-center text-sm lg:text-base">
//                   Quotation <br /> <span>&</span> <br /> Invoice
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />

//             <li className={`w-full ${getSidebarClass("/employee-profile")}`}>
//               <Link to="/employee-profile" className="flex flex-col items-center py-3">
//                 <MdOutlineManageAccounts className="text-white text-2xl lg:text-3xl" />
//                 <h3 className="hidden lg:inline text-white text-center text-sm lg:text-base">
//                   Employees Profile
//                 </h3>
//               </Link>
//             </li>

//             <hr className="w-full border-gray-400" />
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeSider;





import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { BsFileEarmarkPerson, BsHouse } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const EmployeeeSider = () => {
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
        // className="fixed top-18 md:top-14 left-4 z-50 text-black lg:hidden" // Hidden on large screens (lg)
        className="fixed top-18 top-14 left-4 z-50 text-black 2xl:hidden" // Hidden on large screens (lg)
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={25} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed mt-12 inset-y-0 left-0 bg-[#01060c] overflow-hidden 2xl:translate-x-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-20 md:w-40 lg:block z-50`}
      >
        {/* Close (Cross) Button - Hidden on large screens */}
        <button
          className="absolute top-3 right-3 text-white 2xl:hidden" // Hidden on large screens (lg)
          onClick={toggleSidebar}
        >
          <AiOutlineClose size={25} />
        </button>

        <div className="flex flex-col items-center pt-10 max-h-screen overflow-auto	">
          <ul className="flex flex-col items-center space-y-4 w-full pb-16">
            <li className={`w-full ${getSidebarClass("/employees-dashboard")}`}>
              <Link to="/employees-dashboard" className="flex flex-col items-center py-3">
                <BsHouse className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Dashboard
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-leads")}`}>
              <Link to="/employee-leads" className="flex flex-col items-center py-3">
                <FaHistory className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                Assigned Leads
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-report")}`}>
              <Link to="/employee-report" className="flex flex-col items-center py-3">
                <RiSecurePaymentLine className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Reports
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-data-export")}`}>
              <Link to="/employee-data-export" className="flex flex-col items-center py-3">
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs max-md:pt-3 lg:inline text-white md:text-base">
                  Data Export
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-quotation-invoice")}`}>
              <Link to="/employee-quotation-invoice" className="flex flex-col items-center py-1">
                <BsFileEarmarkPerson className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                  Quotation <br /> <span>&</span> <br /> Invoice
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />

            <li className={`w-full ${getSidebarClass("/employee-profile")}`}>
              <Link to="/employee-profile" className="flex flex-col items-center py-3">
                <MdOutlineManageAccounts className="text-white text-2xl md:text-3xl" />
                <h3 className="text-xs text-center max-md:pt-3 lg:inline text-white md:text-base">
                Employees Profile
                </h3>
              </Link>
            </li>

            <hr className="w-full border-gray-400" />
          </ul>
        </div>
      </div>
    </>
  );
};

export default EmployeeeSider;