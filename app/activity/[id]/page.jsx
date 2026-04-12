"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';
import { get } from '../../utils/axiosHelpers';
import ArrayItemLoader from '../../components/arrayItemLoader/ArrayItemLoader';

const ActivityLog = () => {
    const { id } = useParams();
    const tabs = ["all", "login", "courses", "assignment"]
    const [selectedTab, setSelectedTab] = useState(tabs[0])
    const [student, setStudent] = useState()
    const [allActivities, setAllActivities] = useState([]) // Store all activities
    const [filteredActivities, setFilteredActivities] = useState([]) // Store filtered activities
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState()
    const [dropDown, setDropDown] = useState('')
    const filterOptions = [
        {
            title: 'All',
            value: 'all'
        },
        {
            title: 'Login',
            value: 'login'
        },
        {
            title: 'Courses',
            value: 'courses'
        },
        {
            title: 'Assignment',
            value: 'assignment'
        },
        {
            title: 'Profile',
            value: 'profile'
        },
        {
            title: 'Project',
            value: 'project'
        },
        {
            title: 'Enrollment',
            value: 'enrollment'
        },
        {
            title: 'Career Pathway',
            value: 'career_pathway'
        },
        {
            title: 'Report',
            value: 'report'
        },
        {
            title: 'Studies',
            value: 'studies'
        },
        {
            title: 'Upload',
            value: 'upload'
        },
        {
            title: 'Add',
            value: 'add'
        }
    ]

    const fetchStudentData = async () => {
        try {
            const response = await get(`/administration/get-users/${id}`)
            if(response) setLoading(false)
            setStudent(response.data)
        } catch (error) {
            console.error('Error fetching student data:', error)
        }
    }

    const fetchStudentActivity = async () => {
        try {
            const response = await get(`/profile/user/${id}/activities`)
            if(response) setLoading(false)
            if(response.success === true) {
                setAllActivities(response.data)
                setFilteredActivities(response.data) // Initially show all activities
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        }
    }

    const filterData = (tab) => {
        setSelectedTab(tab)
        if (tab === "all") {
            setFilteredActivities(allActivities)
        } else {
            const filtered = allActivities.filter(item => item.activity_type === tab)
            setFilteredActivities(filtered)
        }
    }

    // Handle search functionality
    useEffect(() => {
        if (allActivities.length) {
            const searchedActivities = allActivities.filter(activity => 
                activity.description.toLowerCase().includes(search.toLowerCase()) ||
                activity.activity_type.toLowerCase().includes(search.toLowerCase())
            )
            
            // Apply both search and tab filters
            const finalFiltered = selectedTab === "all" 
                ? searchedActivities 
                : searchedActivities.filter(item => item.activity_type === selectedTab)
                
            setFilteredActivities(finalFiltered)
        }
    }, [search, selectedTab, allActivities])

    useEffect(() => {
        fetchStudentData()
        fetchStudentActivity()
    }, [])

    function applyFilter(){

    }

    return (
        <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            <div className='w-[100%] py-5 rounded-[10px]'>
                <div className='flex items-center justify-between text-[14px]'>
                    <div className='flex items-center gap-2'>
                        {
                            student?.profile_pic?.media ?
                            <img
                                src={student?.profile_pic?.media}
                                className='w-[70px] h-[70px] object-cover rounded-full'
                                alt={student?.full_name}
                            />
                            :
                            <>
                                {
                                    student?.role === 'student' ?
                                    <img
                                        src='/assets/student-avatar.svg'
                                        className='w-[70px] h-[70px] object-cover rounded-full'
                                        alt={student?.full_name}
                                        />
                                    :
                                    <img
                                        src='/assets/teacher-avatar.svg'
                                        className='w-[70px] h-[70px] object-cover rounded-full'
                                        alt={student?.full_name}
                                        />
                                }
                            </>
                        }
                        {/* <img src={student?.profile_pic?.media} className='w-[70px] h-[70px] object-cover rounded-full' alt="" /> */}
                        <div>
                            <p className='font-[700] text-[#131314] mb-[6px]'>{student?.full_name}</p>
                            <p className='text-[#323234]'>{student?.email}</p>
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-[#4B4B4E] font-[600] mb-[6px]'>Date Joined</p>
                        <p className='teext-[#4B4B4E]'>{new Date(student?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className='flex items-center justify-between mt-9 border-b pb-6'>
                    <div>
                        {tabs.map((tab, index) => (
                            <button 
                                key={index} 
                                onClick={() => filterData(tab)} 
                                className={selectedTab === tab 
                                    ? `bg-[#0784C3] px-5 py-1 text-white rounded-full mx-2 capitalize` 
                                    : `capitalize hover:bg-[#0784C3] text-[#636369] px-5 py-1 hover:text-white rounded-full mx-2`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='border flex items-center p-2 rounded-[8px] w-[300px]'>
                            <BiSearch className='text-[18px]'/>
                            <input 
                                onChange={e => setSearch(e.target.value)} 
                                type="text" 
                                className='w-full outline-none pl-1' 
                                placeholder='Search'
                            />
                        </div>
                        <div className="flex items-center gap-2 border p-2 rounded-[8px] cursor-pointer relative">
                            <BsFilter className="text-[18px]" onClick={() => setDropDown(dropDown === 'filter' ? '' : 'filter')}/>
                            <p>{filter?.title}</p>
                            { dropDown === 'filter' &&
                                <ul className="absolute top-11 w-[160px] text-[14px] bg-white border rounded-[8px] py-2 px-2 z-[100] right-0">
                                    {filterOptions.map((option, index) => (
                                        <li key={index} className="py-2 px-2 hover:bg-[#E6F6FE] cursor-pointer flex items-center gap-1">
                                            <input type="checkbox" name="" id="" />
                                            {option.title}
                                        </li>
                                    ))}
                                    <button onClick={() => applyFilter()} className='bg-[#0884C3] mt-22 w-full py-1 px-2 rounded-[5px] text-white'>Apply Filter</button>
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                <div className='mt-7'>
                    {loading && <ArrayItemLoader />}
                    {filteredActivities?.length === 0 && 
                        <p className='text-[#4B4B4E] text-center mt-5'>No activity log found</p>
                    }
                    {filteredActivities?.map((activity, index) => (
                        <div key={index} className='flex items-center justify-between text-[#4B4B4E] border-b pb-2 mb-4'>
                            <div className='flex items-center gap-4'>
                                <div className='p-3 bg-[#F2F2F3] rounded-[8px]'>
                                    {
                                        activity.activity_type === 'login' ?
                                        <img src="/assets/login.svg" alt=""/>
                                        :
                                        activity.activity_type === 'profile' ?
                                        <img src="/assets/userIcon.svg" alt=""/>
                                        :
                                        activity.activity_type === 'assignment'?
                                        <img src="/assets/assignments.svg" alt=""/>
                                        :
                                        activity.activity_type === 'course'?
                                        <img src="/assets/assignments.svg" alt=""/>
                                        :
                                        <img src="/assets/profile.svg" alt=""/>
                                    }
                                </div>
                                <div>
                                    <p className='pb-[2px] capitalize font-[600]'>{activity.activity_type}</p>
                                    <p>{activity.description}</p>
                                </div>
                            </div>
                            <p>{new Date(activity.created_at).toDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ActivityLog