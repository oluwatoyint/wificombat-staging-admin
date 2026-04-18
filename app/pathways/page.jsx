"use client"

import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { BiSearch, BiTrash } from 'react-icons/bi'
import { BsEye, BsFilter, BsPlus } from 'react-icons/bs'
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
import { PiPathDuotone } from 'react-icons/pi';

// import Cookies from 'js-cookie';

const Pathways = () => {

    const { data, error, loading, refetch } = useFetch(
        "https://wificombat-staging-backend-production.up.railway.app/course-pathways/",
        { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
      )
    
      const router = useRouter()
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

      const deleteTeacher = async (id) => {
        try {
            setLoad(true)
            const response = await remove(`/course-pathways/${id}/`)
            setMsg('Pathway deleted successfully')
            setAlertType('success')
            setConfirmModal(false)
            console.log("Deleted");
            
            
            // Clear all teacher-related caches
            clearCacheByPattern('get-users')
            
            // Refetch the current data
            await refetch()
        } catch (error) {
          console.log(error)
          setMsg('An error occurred')
          setAlertType('error')
        } finally {
            setLoad(false)
            setConfirmModal(false)
        }
      }

    // Use the paginated data if available, otherwise use the initial data
    const teachers = paginatedData || data;

    return (
        <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            {confirmModal && (
                <ConfirmationModal
                    modalInfo={{
                        title: 'Delete Pathway',
                        content: 'Are you sure you want to delete this pathway?',
                        confirmButtonText: 'Delete',
                        confirmFunction: () => deleteTeacher(confirmModal.id),
                    }}
                    setConfirmModal={setConfirmModal}
                    load={load}
                />
            )}
            <div className="w-[100%] border py-5 rounded-[10px]">
                <div className="mx-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[#101828] text-[19px]">Pathways</p>
                            <p className="text-[#056494] bg-[#E6F6FE] py-1 px-[8px] rounded-full">
                                {teachers?.count} pathways
                            </p>
                        </div>
                        {/* <p className="text-[#475467] text-[14px]">Oversee all teachers activities</p> */}
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
                        <div onClick={() => router.push('/add-pathway')} className="bg-[#131314] text-white flex items-center gap-2 border py-2 px-3 rounded-[8px] cursor-pointer">
                            <BsPlus className="text-[18px]" />
                            <p>Add Pathway</p>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-[#475467] border-collapse">
                      <thead>
                          <tr className="bg-gray-50 text-[#1D2939] font-medium">
                              <th className="py-4 px-4">
                                  <div className="flex gap-1 items-center">
                                      <p>Pathways</p>
                                      <IoArrowDownOutline className="text-sm" />
                                  </div>
                              </th>
                              <th className="py-4 px-4">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                        {teachers?.data?.filter(teacher =>{
                            if (search === "") return teacher
                            else if(
                                    // teacher.full_name.toLowerCase().includes(search.toLowerCase())
                                    teacher.email.toLowerCase().includes(search.toLowerCase())
                                )return teacher
                        }).map((teacher, index) => (
                        <tr
                            key={index}
                            className={`border-t ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            } hover:bg-gray-100 transition-colors`}
                        >
                            <td className="py-4 pl-4 flex items-center gap-3">
                                <img
                                    src={teacher?.cover_image?.media ? teacher?.cover_image?.media : <PiPathDuotone />}
                                    className="w-[40px] h-[40px] rounded-full object-cover"
                                    alt={teacher.title}
                                />
                                <p className="font-medium text-[#1D2939]">{teacher.title ? teacher.title : 'N/A'}</p>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex gap-8 items-center py-4 px-4">
                                    <Link href={`/pathways/${teacher.id}`}>
                                        <BsEye className="cursor-pointer text-[18px] text-[#1D2939] hover:text-blue-500" />
                                    </Link>
                                    <BiTrash
                                        onClick={() => setConfirmModal({ id: teacher.id })}
                                        className="cursor-pointer text-[18px] text-red-500 hover:text-red-700"
                                    />
                                </div>
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
                        Page {teachers?.current_page} of {teachers?.total_pages}
                    </p>
                    {
                        load ?
                            <BtnLoader />
                        :
                            <div className="flex gap-2">
                                {teachers?.previous !== null && (
                                    <button
                                        className="border px-3 py-1 rounded-[6px]"
                                        onClick={() => getPaginatedData(teachers.previous)}
                                    >
                                        Previous
                                    </button>
                                )}
                                {teachers?.next !== null && (
                                    <button
                                        className="border px-3 py-1 rounded-[6px]"
                                        onClick={() => getPaginatedData(teachers.next)}
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

export default Pathways
