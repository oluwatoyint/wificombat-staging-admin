"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiPathDuotone } from "react-icons/pi";
import { usePathname } from "next/navigation";

import {
  MdOutlineLogout,
} from "react-icons/md";
import { motion } from "framer-motion";
// import { normalizePath } from "@/app/utils/paths";
import Image from "next/image";
// import { raleway } from "@/app/fonts";
import Link from "next/link";
// import { useMain } from "@/app/context/MainContext";
import Cookies from 'js-cookie';
import { BsQuestionLg } from "react-icons/bs";

export const navigationLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: "/assets/dashboard.svg",
        current: false,
    },
    {
        name: "Students",
        href: "/students",
        icon: "/assets/students.svg",
        current: false,
    },
    {
      name: "Schools",
      href: "/schools",
      icon: "/assets/schools.svg",
      current: false,
    },
    {
        name: "Tutors/Facilitators",
        href: "/teachers",
        icon: "/assets/tutors.svg",
        current: false,
    },
    {
        name: "Upload",
        href: "/upload",
        icon: "/assets/upload.svg",
        current: false,
    },
    {
        name: "Pathways",
        href: "/pathways",
        icon: <PiPathDuotone />,
        current: false,
    },
    {
        name: "Profile",
        href: "/profile",
        icon: "/assets/profile.svg",
        current: false,
    },
    {
        name: "Question Bank",
        href: "/question-bank",
        icon: "/assets/question.png",
        current: false,
    }
];



const getBackgroundColor = (age) => {
  if (age >= 1 && age <= 3) return "#BC00DD";
  if (age >= 4 && age <= 6) return "#FFB700";
  if (age >= 7 && age <= 12) return "#6BCAFA";
  if (age >= 13 && age <= 18) return  "#0784C3";
  return "#000"
};

const Sidebar = (userAge) => {
  const router = useRouter();
  const pathname = usePathname();
//   const pathname = normalizePath(usePathname());
const [toggleSidebar, setToggleSidebar] = useState();
const [activeLink, setActiveLink] = useState();
const [toggleButtonVisible, setToggleButtonVisible] = useState(true);
const [expanded, setExpanded] = useState();

const [navigationState, setNavigationState] = useState(navigationLinks);

const handleItemClick = (clickedItemName) => {
  // Update the `current` property
  console.log(clickedItemName);
  
  const updatedNavigation = navigationState.map((item) =>
    item.name === clickedItemName
      ? { ...item, current: true }
      : { ...item, current: false }
  );
  setNavigationState(updatedNavigation);
};

  const sidebarVariants = {

    iconsOnly: {
      width: "8rem", // Width when showing icons only
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },

    full: {
      width: "16rem", // Full width when showing sidebar content
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

//   useEffect(() => {
//     setActiveLink(pathname);
//   }, [pathname]);

  const handleToggle = () => {
    if (toggleSidebar) {
      setToggleButtonVisible(false); 
      setTimeout(() => {
        setToggleSidebar(!toggleSidebar);
        setTimeout(() =>setToggleButtonVisible(true), 300); // Show the button after the sidebar transition
      }, 100)
    } 
    else {
      setToggleSidebar(!toggleSidebar);
    }
  };

  const handleExpand = (name) => {
    setExpanded(expanded === name ? undefined : name);
  };



//   const isCareerPathActive = pathname.startsWith("/dashboard/career-path");
  const backgroundColor = getBackgroundColor(userAge)
  const borderColor =  getBackgroundColor(userAge)
  const textColor = getBackgroundColor(userAge)
  return (
    <div className={`hidden lg:fixed lg:inset-y-0 z-50 lg:flex lg:flex-col 
    transition duration-700 ease-in-out ${toggleSidebar ? "w-fit" : "lg:w-64"}`}>
{/* bg-[#BC00DD] */}
      <motion.div 
      initial="full"
      animate={toggleSidebar ? "iconsOnly" : "full"}
      style={{ backgroundColor }}
      className={` flex grow flex-col gap-y-16 overflow-y-auto  px-6 pb-4`}>

      {/* {toggleButtonVisible && ( 
        <motion.div
          whileHover={{scale:1.1 }}
          whileTap={{scale:0.9 }}
          transition={{duration:1 }}
          onClick={handleToggle}
          style={{ borderColor }}
          className="toggle-button hidden z-[53] small-view-arrow-bg absolute 
          h-8 w-8 bg-white lg:flex items-center 
          justify-center rounded-full border shadow-xl top-8 right-[-1rem] transition 
          duration-300 cursor-pointer"
        >
          {toggleSidebar ? (
            <MdOutlineKeyboardDoubleArrowRight size={14} style={{ color: textColor }} />
          ) : (
            <MdOutlineKeyboardDoubleArrowLeft size={14}  style={{ color: textColor }} />
          )}
        </motion.div>
      )} */}

        <Link 
        href={`/`}
        className="flex h-16 shrink-0 items-center">
         <Image
            src={`/assets/E-learn-logo.svg`}
            alt={`logo`}
            width={120}
            height={120}
            className="mt-5 object-contain text-neutral-400"
          />
        </Link>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-5">
                <li
                className={
                  pathname.includes('dashboard')
                    ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                    : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/dashboard.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/dashboard'>Dashboard</Link>
                </li>
                <li
                className={
                  pathname.includes('students')
                    ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                    : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/students.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/students'>Students</Link>
                </li>
                <li
                className={
                  pathname.includes('school')
                    ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                    : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/schools.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/schools'>Schools</Link>
                </li>
                <li
                className={
                  pathname.includes('teachers')
                    ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                    : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/tutors.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/teachers'>Tutors/Facilitators</Link>
                </li>
                <li
                className={
                  pathname.includes('upload') || pathname.includes('library') || pathname.includes('discount')
                    ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                    : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/upload.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/upload'>Upload</Link>
                </li>
                <li
                className={
                  pathname.includes('pathway')
                  ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex items-center gap-[6px] px-3`
                  : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3 items-center`
                }
                >
                  <PiPathDuotone className="text-[20px] text-white"/>
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/pathways'>Pathways</Link>
                </li>
                <li
                className={
                  pathname.includes('profile')
                  ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                  : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/profile.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/profile'>Profile</Link>
                </li>
                <li
                className={
                  pathname.includes('question')
                  ? `cursor-pointer bg-[#0784C3] rounded-[6px] flex gap-[6px] px-3`
                  : `cursor-pointer hover:bg-gray-800 rounded-[6px] flex gap-[6px] px-3`
                }
                >
                  <img src="/assets/question.svg" alt="" />
                  <Link className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`} href='/question-bank'>Question Bank</Link>
                </li>
                {/* {navigationState.map((item) => (
                  <li key={item.name}
                    className={
                      item.current
                        ? `cursor-pointer bg-[#0784C3] rounded-[6px]`
                        : `cursor-pointer hover:bg-gray-800 rounded-[6px]`
                    }>
                    <Link href={item.href}
                        onClick={() => handleItemClick(item.name)}
                        className={`text-gray-200 hover:text-white group flex items-center gap-x-3 rounded-md p-3 text-lg leading-6 font-medium transition duration-700 ease-in-out ${ toggleSidebar && "w-fit mx-auto" }`}>
                        <img src={item.icon} alt="" />
                        {!toggleSidebar && item.name}
                    </Link>
                  </li>
                ))} */}
              </ul>
            </li>

            <li className="mt-auto">
              <a
                href="/login"
                className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 
                text-gray-200 hover:bg-gray-800 hover:text-white"
                onClick={() => Cookies.remove('token')}
              >
                <MdOutlineLogout
                  className={ `h-6 w-6 shrink-0 ${toggleSidebar && "mx-auto"}` }
                  aria-hidden="true"
                />
                {!toggleSidebar && `Logout`}
              </a>
            </li>
          </ul>
        </nav>
      </motion.div>
    </div>
  );
};

export default Sidebar;
