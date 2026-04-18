"use client"

import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsFilter } from 'react-icons/bs'
import useFetch from '../hooks/useFetch'
import Cookies from 'js-cookie'

const Dashboard = () => {

  const [search, setSearch] = useState('')
  const [activities, setActivities] = useState([])
  // const [data, setData] = useState(null)
  const token = Cookies.get('token')
  const { data, error, loading, refetch } = useFetch(
    "https://wificombat-staging-backend-production.up.railway.app/administration/dashboard/stats",
    { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
  )

  

  async function fetchDashboardActivities() {
    const response = await fetch("https://wificombat-staging-backend-production.up.railway.app/recent-activities", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    const jsonData = await response.json()
    setActivities(jsonData.data)
    // setData(jsonData)
    console.log(jsonData);
  }

  // async function fetchDashboardStats() {
  //   const response = await fetch("https://wificombat-staging-backend-production.up.railway.app/administration/dashboard/stats", {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     }
  //   })
  //   const jsonData = await response.json()
  //   setData(jsonData)
  //   console.log(jsonData);
  // }
  // /recent-activities
  useEffect(() => {
    // fetchDashboardStats()
    fetchDashboardActivities()
  },[])

  console.log(data);
  
  // administration/dashboard/stats

  return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            <div className='w-[100%]'>
                <div className='grid grid-cols-4 gap-6'>
                  <div className='flex gap-3 p-3 rounded-[10px] border border-[#E5E5E6] items-start'>
                    <img src="./assets/totalUsers.svg" alt="" />
                    <div>
                      <p>Total Users</p>
                      <p className='font-[700] text-[40px] my-[-5px] text-[#131314]'>{data?.data?.total_users?.count.toLocaleString()}</p>
                      <p className={data?.data?.total_users?.trend === "increase" ? 'text-[#18B600]' : 'text-red-500'}>
                      {data?.data?.total_users?.trend === "increase" ? <span>+</span> : <span>-</span> } {data?.data?.total_users?.percentage}% {data?.data?.total_users?.period}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-3 rounded-[10px] border border-[#E5E5E6] items-start'>
                    <img src="./assets/totalSchools.svg" alt="" />
                    <div>
                      <p>Active Schools</p>
                      <p className='font-[700] text-[40px] my-[-5px] text-[#131314]'>{data?.data?.active_schools?.count.toLocaleString()}</p>
                      <p className={data?.data?.active_schools?.trend === "increase" ? 'text-[#18B600]' : 'text-red-500'}>
                      {data?.data?.active_schools?.trend === "increase" ? <span>+</span> : <span>-</span> } {data?.data?.active_schools?.percentage}% {data?.data?.active_schools?.period}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-3 rounded-[10px] border border-[#E5E5E6] items-start'>
                    <img src="./assets/totalCourses.svg" alt="" />
                    <div>
                      <p>Courses Enrollment</p>
                      <p className='font-[700] text-[40px] my-[-5px] text-[#131314]'>{data?.data?.courses_enrollment?.count.toLocaleString()}</p>
                      <p className={data?.data?.courses_enrollment?.trend === "increase" ? 'text-[#18B600]' : 'text-red-500'}>
                        {data?.data?.courses_enrollment?.trend === "increase" ? <span>+</span> : <span>-</span> } {data?.data?.courses_enrollment?.percentage}% {data?.data?.courses_enrollment?.period}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-3 rounded-[10px] border border-[#E5E5E6] items-start'>
                    <img src="./assets/totalTutors.svg" alt="" />
                    <div>
                      <p>Total Tutors</p>
                      <p className='font-[700] text-[40px] my-[-5px] text-[#131314]'>{data?.data?.total_tutors?.count.toLocaleString()}</p>
                      <p className={data?.data?.total_tutors?.trend === "increase" ? 'text-[#18B600]' : 'text-red-500'}>
                      {data?.data?.total_tutors?.trend === "increase" ? <span>+</span> : <span>-</span> } {data?.data?.total_tutors?.percentage}% {data?.data?.total_tutors?.period}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mx-4 flex items-center justify-between mt-10 border-b pb-3">
                    <p className="text-[#131314] font-[600] text-[16px]">Recent Activities</p>
                    <div className="flex items-center gap-3">
                        <div className="border flex items-center p-2 rounded-[8px] w-[300px]">
                            <BiSearch className="text-[18px]" />
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                className="w-full outline-none pl-1"
                                placeholder="Search"
                            />
                        </div>
                        {/* <div className="flex items-center gap-2 border p-2 rounded-[8px] w-[100px] cursor-pointer">
                            <BsFilter className="text-[18px]" />
                            <p>Filters</p>
                        </div> */}
                    </div>
                </div>
                <div className='mt-[2rem]'>
                  {
                      activities?.filter(item =>{
                        if (search === "") return item
                        else if(
                                item.activity_type.toLowerCase().includes(search.toLowerCase())
                            )return item
                      }).map((item, index) => (
                      <div key={index} className='flex items-center justify-between text-[#4B4B4E] border-b py-5'>
                          <div className='flex items-center gap-4'>
                              <div className='p-3 bg-[#F2F2F3] rounded-[8px]'>
                                {
                                    item.activity_type === 'login' ?
                                    <img src="/assets/login.svg" alt=""/>
                                    :
                                    item.activity_type === 'profile' ?
                                    <img src="/assets/userIcon.svg" alt=""/>
                                    :
                                    item.activity_type === 'assignment'?
                                    <img src="/assets/assignments.svg" alt=""/>
                                    :
                                    item.activity_type === 'course'?
                                    <img src="/assets/assignments.svg" alt=""/>
                                    :
                                    <img src="/assets/profile.svg" alt=""/>
                                }
                              </div>
                              <div>
                                <div className='flex items-center gap-4 mb-1'>
                                  <p className='pb-[2px] capitalize font-[600]'>{item?.activity_type}</p>
                                  <p className='bg-[#E6F6FE] px-3 py-[2px] flex items-center gap-2 rounded-full text-[14px] text-[#0784C3] capitalize'> <span className='p-1 rounded-full bg-[#0784C3]'></span>{item?.role}</p>
                                </div>
                                <p className='w-[500px]'>{item?.description}</p>
                              </div>
                          </div>
                          <p>{new Date(item?.created_at).toDateString()}</p>
                      </div>
                    ))
                  }
                </div>
            </div>
        </div>
  )
}

export default Dashboard
