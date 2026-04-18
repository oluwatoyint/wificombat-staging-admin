"use client"

import React, { useEffect, useState } from 'react'
import { BiSearch, BiTrash } from 'react-icons/bi'
import moment from 'moment';
import { BsEye, BsFilter } from 'react-icons/bs'
import { get, remove } from '../utils/axiosHelpers';
import { IoArrowDownOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from '../components/alert/Alert';
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal';
import ArrayItemLoader from '../components/arrayItemLoader/ArrayItemLoader';
import useFetch from '../hooks/useFetch';
import useCacheStore from '../stores/cacheStore'
import BtnLoader from '../components/btnLoader/BtnLoader';

const Schools = () => {
    const { data, error, loading, refetch } = useFetch(
            "https://wificombat-staging-backend-production.up.railway.app/administration/get-users?role=school_admin",
            { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
        )

        const [paginatedData, setPaginatedData] = useState(null)
        const [search, setSearch] = useState('')
        const [msg, setMsg] = useState('')
        const [alertType, setAlertType] = useState('')
        const [confirmModal, setConfirmModal] = useState(null)
        const [load, setLoad] = useState(false)

        const { getCacheData, setCacheData, clearCacheByPattern } = useCacheStore()

        const getPaginatedData = async (url) => {
        try {
            // Check cache with a shorter duration (5 minutes)
            const cachedData = getCacheData(url, 5 * 60 * 1000)
            
            if (cachedData) {
            setPaginatedData(cachedData)
            return
        }
        
            setLoad(true)
            const response = await get(url)
            if(response) setLoad(false)
            setPaginatedData(response)
            setCacheData(url, response)
        } catch (error) {
            console.log(error)
        }
    }
    

    const deleteSchool = async (id) => {
        try {
            setLoad(true)
            const response = await remove(`/administration/get-users/${id}`)
            if(response) setLoad(false)
            if (response?.success) {
                setMsg('School deleted successfully')
                setAlertType('success')
                setConfirmModal(false)
                
                // Clear all student-related caches
                clearCacheByPattern('get-users')
                
                // Refetch the current data
                await refetch()
            } else {
                setMsg('An error occurred')
                setAlertType('error')
            }
        } catch (error) {
          console.log(error)
          setMsg('An error occurred')
          setAlertType('error')
        } finally {
          setConfirmModal(false)
        }
    }

    // Use the paginated data if available, otherwise use the initial data
    const schools = paginatedData || data;

    return (
        <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            {confirmModal && (
                <ConfirmationModal
                    modalInfo={{
                        title: 'Delete School',
                        content: 'Are you sure you want to delete this school?',
                        confirmButtonText: 'Delete',
                        confirmFunction: () => deleteSchool(confirmModal.id),
                    }}
                    setConfirmModal={setConfirmModal}
                    load={load}
                />
            )}
            <div className="w-[100%] border py-5 rounded-[10px]">
                <div className="mx-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[#101828] text-[19px]">Schools</p>
                            <p className="text-[#056494] bg-[#E6F6FE] py-1 px-[8px] rounded-full">
                                {schools?.count} schools
                            </p>
                        </div>
                        <p className="text-[#475467] text-[14px]">Oversee all schools activities</p>
                    </div>
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
                        {/* <div className="flex items-center gap-2 border p-2 rounded-[8px] cursor-pointer">
                            <BsFilter className="text-[18px]" />
                            <p>Filter</p>
                        </div> */}
                    </div>
                </div>
                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-[#475467] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[#1D2939] font-medium">
                                <th className="py-4 px-4">
                                    <div className="flex gap-1 items-center">
                                        <p>Schools</p>
                                        <IoArrowDownOutline className="text-sm" />
                                    </div>
                                </th>
                                <th className="py-4 px-4">No of Teachers</th>
                                <th className="py-4 px-4">No of Students</th>
                                <th className="py-4 px-4">Date Joined</th>
                                <th className="py-4 px-4">Activity Log</th>
                                <th className="py-4 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools?.data?.filter(school =>{
                                if (search === "") return school
                                else if(
                                        // school?.full_name.toLowerCase().includes(search.toLowerCase())
                                        school?.email.toLowerCase().includes(search.toLowerCase())
                                    )return school
                            }).map((school, index) => (
                            <tr
                                key={index}
                                className={`border-t ${
                                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-100 transition-colors`}
                            >
                                <td className="py-4 pl-4 flex items-center gap-3">
                                    <img
                                        src={school?.profile_pic?.media ? school?.profile_pic?.media : '/assets/school-reg.webp'}
                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                        alt={school.full_name}
                                    />
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <p className="font-bold text-[##101828]">{school.first_name ? school.first_name : 'N/A' }</p>
                                            <p className="font-bold text-[##101828]">{school.last_name ? school.last_name : 'N/A' }</p>
                                        </div>
                                        <p>{school.email}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">0</td>
                                <td className="py-4 px-4">{school.no_student_you_teach}</td>
                                <td className="py-4 px-4 capitalize">{ new Date(school.date_joined).toDateString() }</td>
                                <td className="py-4 px-4">
                                    <Link
                                        href={`/activity/${school.id}`}
                                        className="bg-[#E6F6FE] text-[#0784C3] px-2 py-1 rounded-full"
                                    >
                                        View
                                    </Link>
                                </td>
                                <td className="px-4 flex gap-8 items-center">
                                    <Link href={`/schoolInfo/${school.id}`}>
                                        <BsEye className="cursor-pointer text-[18px] text-[#1D2939] hover:text-blue-500" />
                                    </Link>
                                    <BiTrash
                                        onClick={() => setConfirmModal({ id: school.id })}
                                        className="cursor-pointer text-[18px] text-red-500 hover:text-red-700"
                                    />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    {loading && (
                        <div className="px-8">
                            <ArrayItemLoader />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between px-4 border-t pt-4 text-[#475467] text-[14px]">
                    <p>
                        Page {schools?.current_page} of {schools?.total_pages}
                    </p>
                    {
                        load ?
                            <BtnLoader />
                        :
                            <div className="flex gap-2">
                                {schools?.previous !== null && (
                                    <button
                                        className="border px-3 py-1 rounded-[6px]"
                                        onClick={() => getPaginatedData(schools.previous)}
                                    >
                                        Previous
                                    </button>
                                )}
                                {schools?.next !== null && (
                                    <button
                                        className="border px-3 py-1 rounded-[6px]"
                                        onClick={() => getPaginatedData(schools.next)}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Schools
