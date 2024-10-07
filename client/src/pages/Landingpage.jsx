import React from "react";
import { Link } from "react-router-dom";

import { MdEmojiPeople, MdManageAccounts, MdPeople } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { MdOutlineEditNote } from "react-icons/md";
import { ImLab } from "react-icons/im";
import img from '../images/crmimage.avif'
import styled from "styled-components";

const Landingpage = () => {
  return (
    <Wrapper>
      <div className="min-h-screen flex items-center justify-center">
        <section className="vh-100">
          <div className="container h-full">
            <div className="flex justify-center items-center h-full">
              <div className="w-full max-w-screen-lg">
                <div className="bg-white rounded-3xl shadow-lg">
                  <div className="p-8">
                    <div className="flex flex-wrap justify-center">
                    <div className="w-full md:w-1/2 lg:w-2/3 flex items-center">
                        <img
                          src={img}
                          className="w-full"
                          alt="Sample"
                        />
                      </div>
                      <div className="w-full md:w-1/2 lg:w-1/3 mb-8 md:mb-0 ">
                        <p className="heading text-center text-xl font-bold mb-8  ">
                          Please Select User
                        </p>
                        <div className="space-x-3 mx-4">
                       
                          <Link
                           
                            to='/admin-login'
                          >
                            <button
                              className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center"
                            >
                              <MdManageAccounts className="mr-2" />
                              Admin
                            </button>
                          </Link>

                      

                          <Link
                           
                            to='/employee-login'
                          >
                            <button
                              className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none flex items-center justify-center"
                            >
                              <MdPeople className="mr-2" />
                           Employees
                            </button>
                          </Link>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default Landingpage;

const Wrapper = styled.div`
.heading{
  
  @media screen and (max-width:768px) {
    margin-top: 1rem;
  }
}

`

