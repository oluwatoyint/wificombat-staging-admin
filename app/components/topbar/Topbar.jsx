"use client";

import React, { useEffect, useState } from 'react';
import { BiBell, BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { BsChevronLeft } from 'react-icons/bs';

const Topbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userImage, setUserImage] = useState("");

  const router = useRouter(); // useRouter hook for navigation

  const searchLinks = [
    {
      name: "Upload",
      href: "/dashboard",
      icon: "/assets/dashboard.svg"
    }
  ];

  // Handler to update search term and suggestion
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      // Generate dynamic suggestions
      setSuggestion(
        searchLinks
          .map(
            (link) => `Search for "${term}" in ${link.name}`
          )
          .join(' | ')
      );
    } else {
      setSuggestion('');
    }
  };

  // Handle suggestion selection and redirect
  const handleSuggestionClick = (href) => {
    router.push(href); // Use the router to navigate to the selected link
  };

  useEffect(() => {
    // Check if `localStorage` exists and fetch user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setUserImage(user.profile_pic?.media);
    }
  }, []);

  return (
    <div className='w-[82.5%] px-8 py-8 right-0 lg:flex items-center justify-between border-b fixed z-[10] bg-white'>
      <div className='flex gap-3 items-center'>
        <div>
          <p className='text-[#131314] text-[22px] font-[600]'>Hi, Admin</p>
          <p>Welcome back, {firstName} {lastName}</p>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <div className='border border-[#E5E5E6] w-[600px] rounded-[8px] flex items-center py-[6px] pl-2'>
            <BiSearch />
            <input
              type="text"
              placeholder="Search..."
              className='pl-2 outline-none w-full'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {searchTerm && (
            <div className='absolute top-[40px] left-0 bg-white border border-[#E5E5E6] p-2 w-[600px] rounded-b-[8px] text-[#1D2939]'>
              <div>
                {searchLinks.map((link, index) => (
                  <p
                    key={index}
                    className='cursor-pointer hover:text-blue-500 py-1'
                    onClick={() => handleSuggestionClick(link.href)}
                  >
                    {`Search for "${searchTerm}" in ${link.name}`}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-[#E6F6FE] p-2 rounded-[6px]'>
            <BiBell className='text-[20px]' />
          </div>
          {
            <img src={userImage || "/assets/userIcon.svg"} className='w-[40px] h-[40px] object-cover rounded-full' alt="" />
          }
        </div>
      </div>
    </div>
  );
};

export default Topbar;
