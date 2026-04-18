"use client"

import React, { useEffect, useState } from 'react'
import { BiSearch, BiTrash } from 'react-icons/bi'
import moment from 'moment';
import { BsEye, BsFilter } from 'react-icons/bs'
import { get, remove } from '../../utils/axiosHelpers';
import { IoArrowDownOutline } from 'react-icons/io5';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from '../../components/alert/Alert';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import ArrayItemLoader from '../../components/arrayItemLoader/ArrayItemLoader';
import useFetch from '../../hooks/useFetch';
import useCacheStore from '../../stores/cacheStore'
import BtnLoader from '../../components/btnLoader/BtnLoader';

const SchoolInfo = () => {

        const { id } = useParams();

        const { data, error, loading, refetch } = useFetch(
            `https://wificombat-staging-backend-production.up.railway.app/administration/get-users?school_id=${id}`,
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
    

    const deleteUser = async (id) => {
        try {
            setLoad(true)
          const response = await remove(`/administration/get-users/${id}`)
            if (response) setLoad(false)
            if (response?.success) {
                setMsg('User deleted successfully')
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

    const [dropDown, setDropDown] = useState()
    const filterOptions = [
        {
            name: 'All',
            value: 'all',
        },
        {
            name: 'By Students',
            value: 'students',
        },
        {
            name: 'By Teachers',
            value: 'teachers',
        }
    ]
    const [filter, setFilter] = useState(filterOptions[0]);

    const applyFilter = (data) => {
        setFilter(data)
    }


    // Use the paginated data if available, otherwise use the initial data
    const schoolInfo = paginatedData || data;

    return (
        <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            {confirmModal && (
                <ConfirmationModal
                    modalInfo={{
                        title: 'Delete User',
                        content: 'Are you sure you want to delete this user?',
                        confirmButtonText: 'Delete',
                        confirmFunction: () => deleteUser(confirmModal.id),
                    }}
                    setConfirmModal={setConfirmModal}
                    load={load}
                />
            )}
            <div className="w-[100%] border py-5 rounded-[10px]">
                <div className="mx-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[#101828] text-[19px]">Total Users</p>
                            <p className="text-[#056494] bg-[#E6F6FE] py-1 px-[8px] rounded-full">
                                {schoolInfo?.count} users
                            </p>
                        </div>
                        <p className="text-[#475467] text-[14px]">Oversee all student and teachers activities</p>
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
                        <div className="flex items-center gap-2 border p-2 rounded-[8px] cursor-pointer relative" onClick={() => setDropDown(dropDown === 'filter' ? '' : 'filter')}>
                            <BsFilter className="text-[18px]" />
                            <p>{filter.name}</p>
                            { dropDown === 'filter' &&
                                <ul className="absolute top-11 w-[120px] text-[14px] bg-white border rounded-[8px] py-2 px-2 z-[100] right-0">
                                    {filterOptions.map((option, index) => (
                                        <li key={index} className="py-1 px-2 hover:bg-[#E6F6FE] cursor-pointer" onClick={() => applyFilter(option)}>
                                            {option.name}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-[#475467] border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[#1D2939] font-medium">
                                <th className="py-4 px-4">
                                    <div className="flex gap-1 items-center">
                                        <p>Users</p>
                                        <IoArrowDownOutline className="text-sm" />
                                    </div>
                                </th>
                                {/* <th className="py-4 px-4">Email</th> */}
                                <th className="py-4 px-4">User Type</th>
                                <th className="py-4 px-4">Class</th>
                                <th className="py-4 px-4">Date Joined</th>
                                <th className="py-4 px-4">Activity Log</th>
                                <th className="py-4 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schoolInfo?.data?.filter(user =>{
                                if (search === "") return user
                                else if(
                                        // user.full_name.toLowerCase().includes(search.toLowerCase())
                                        user.email.toLowerCase().includes(search.toLowerCase())
                                    )return user
                            }).map((user, index) => (
                            <tr
                                key={index}
                                className={`border-t ${
                                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-100 transition-colors`}
                            >
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        {
                                            user?.profile_pic?.media ?
                                            <img
                                                src={user?.profile_pic?.media}
                                                className="w-[40px] h-[40px] rounded-full object-cover"
                                                alt={user.first_name}
                                            />
                                            :
                                            <>
                                                {
                                                    user.role === 'student' ?
                                                    <img
                                                        src='/assets/student-avatar.svg'
                                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                                        alt={user.first_name}
                                                        />
                                                    :
                                                    <img
                                                        src='/assets/teacher-avatar.svg'
                                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                                        alt={user.first_name}
                                                        />
                                                }
                                            </>
                                        }
                                        <div>
                                            <div className='flex items-center gap-3'>
                                                <p className="font-medium text-[#1D2939]">{user.first_name ? user.first_name : "N/A"}</p>
                                                <p className="font-medium text-[#1D2939]">{user.last_name ? user.last_name : "N/A"}</p>
                                            </div>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">{user.role}</td>
                                <td className="py-4 px-4">{user._class}</td>
                                <td className="py-4 px-4 capitalize">{ new Date(user.date_joined).toDateString() }</td>
                                <td className="py-4 px-4">
                                    <Link
                                        href={`/activity/${user.id}`}
                                        className="bg-[#E6F6FE] text-[#0784C3] px-2 py-1 rounded-full"
                                    >
                                        View
                                    </Link>
                                </td>
                                <td className="px-4 pt-6 flex gap-8 items-center">
                                    <Link href={`/user/${user.id}`}>
                                        <BsEye className="cursor-pointer text-[18px] text-[#1D2939] hover:text-blue-500" />
                                    </Link>
                                    <BiTrash
                                        onClick={() => setConfirmModal({ id: user.id })}
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
                        Page {schoolInfo?.current_page} of {schoolInfo?.total_pages}
                    </p>
                    {
                        load ? 
                        <BtnLoader />
                        :
                        <div className="flex gap-2">
                            {schoolInfo?.previous !== null && (
                                <button
                                    className="border px-3 py-1 rounded-[6px]"
                                    onClick={() => getPaginatedData(schoolInfo.previous)}
                                >
                                    Previous
                                </button>
                            )}
                            {schoolInfo?.next !== null && (
                                <button
                                    className="border px-3 py-1 rounded-[6px]"
                                    onClick={() => getPaginatedData(schoolInfo.next)}
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

export default SchoolInfo