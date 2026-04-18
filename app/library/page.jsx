"use client"

import React, { useEffect, useState } from 'react'
import CardLoader from '../components/cardLoader/CardLoader'
import { get } from '../utils/axiosHelpers'
import { GoChevronRight } from 'react-icons/go'
import { useRouter } from 'next/navigation'

const page = () => {

    const [allPathways, setAllPathways] = useState()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [msg, setMsg] = useState('')
    const [alertType, setAlertType] = useState('')

    async function getPathways(){
        try {
            setLoading(true)
            const response = await get(`/course-pathways/`)
            setAllPathways(response.data)
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

    useEffect(() => {
        getPathways()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {
            allPathways?.length === 0 &&
            <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                <p>No Library Found</p>
                {/* <button onClick={() => router.push(`/pathway/${path}/${id}/add-flashcard`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add First Flashcard</button> */}
            </div>
        }
        {
            allPathways?.map((pathway, index) => (
                <div key={index} className='border p-4 mb-3 flex items-center justify-between rounded-[10px]'>
                    <div className='flex items-center gap-3'>
                        <div className='p-1 bg-gray-950 rounded-full overflow-hidden'>
                            <img src={pathway?.cover_image?.media} className='w-[35px] h-[35px]' alt="" />
                        </div>
                        <p className='font-[500]'>{pathway?.title}</p>
                    </div>
                    <GoChevronRight onClick={() => router.push(`/library/${pathway.id}`)} className='text-[20px] cursor-pointer'/>
                </div>
            ))
        }
        {
            loading &&
            <div className='flex justify-center items-center'>
                <CardLoader />
            </div>
        }
    </div>
  )
}

export default page
