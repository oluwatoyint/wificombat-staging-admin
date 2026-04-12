"use client"

import React, { useEffect, useState } from 'react'
import { get } from '../../utils/axiosHelpers'
import { GoChevronRight } from 'react-icons/go'
import { useParams, useRouter } from 'next/navigation'
import { BiPlus } from 'react-icons/bi'
// import { get } from '@/app/utils/axiosHelpers'

const page = () => {

    const [pathwayInfo, setPathwayInfo] = useState()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { id } = useParams()
    const [msg, setMsg] = useState('')
    const [alertType, setAlertType] = useState('')
    const [libraries, setLibraries] = useState()

    async function getPathwayInfo(){
        try {
            setLoading(true)
            const response = await get(`/course-pathways/${id}`)
            setPathwayInfo(response.data)
            console.log(response);
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                setAlertType('error')
                setMsg('Network Error')
            }
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    async function getLibraries(){
        try {
            setLoading(true)
            const response = await get(`/library/?pathway_id=${id}`)
            setLibraries(response)
            console.log("library ===>>> ", response);
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                setAlertType('error')
                setMsg('Network Error')
            }
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getPathwayInfo()
        getLibraries()
    }, [])

    // const handleLibraryClick = (libraryType, libraryId) => {
    //     if(libraryType === 'video'){
    //         router.push(`/library/${id}/${libraryId}`)
    //     }else if(libraryType === 'slide'){
    //         router.push(`/library/${id}/${libraryId}`)
    //     }
    // }

  return (
    <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {
            pathwayInfo &&
            <div className='flex items-center justify-between border-b border-[#E5E5E6] pb-2'>
                <p className='text-[18px] text-[#131314] font-[500]'>{pathwayInfo?.title}</p>
                {
                    libraries?.data?.length > 0 && 
                    <button onClick={() => router.push(`/library/${id}/add-library`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add a new video or slide</button>
                }
            </div>
        }
        <div className='py-5 px-4'>
            <div className='mt-10'>
                {
                    libraries?.data?.length === 0 &&
                    <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                        <p>No videos or slides yet</p>
                        <button onClick={() => router.push(`/library/${id}/add-library`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add a new video or slide</button>
                    </div>
                }

                <div className='grid grid-cols-3 gap-4 w-full'>
                    {
                        libraries?.data?.map((library, index) => (
                            <div key={index} className='w-[100%] shadow p-3 rounded-[15px] cursor-pointer' onClick={() => router.push(`/library/${id}/${library.id}`)}>
                                <img src={`${library.media?.media}`} alt="" className='w-full h-[120px] object-cover' />
                                <div className='flex gap-4 mt-4'>
                                    <p className='text-[#4B4B4E] font-[500]'>{library?.title}</p>
                                    <p className='text-[#636369] text-[15px]'>{library?.library_type}</p>
                                    {/* <p className='text-[#323234] text-[14px]'>{trimText(lesson.description, 80)}</p> */}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default page