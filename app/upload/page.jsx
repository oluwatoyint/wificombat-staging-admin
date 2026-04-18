"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { get } from '../utils/axiosHelpers'
import { useState } from 'react'
import CardLoader from '../components/cardLoader/CardLoader';
import Alert from '../components/alert/Alert'

const Upload = () => {

  const uploadArray = [
    {
      id:1,
      bgColor: 'bg-[#0784C3]',
      text: 'Coding Pathway',
      link:'/pathway/coding',
      img: '/assets/coding.svg',
    },
    {
      id:2,
      bgColor: 'bg-[#6BCAFA]',
      text: 'Gaming Pathway',
      link:'/pathway/gaming',
      img: '/assets/gaming.svg',
    },
    {
      id:3,
      bgColor: 'bg-[#BC00DD]',
      text: 'Multimedia Pathway',
      link:'/pathway/multimedia',
      img: '/assets/multi-media.svg',
    },
    {
      id:4,
      bgColor: 'bg-[#131314]',
      text: 'Artificial Intelligence Pathway',
      link:'/pathway/ai',
      img: '/assets/ai.svg',
    },
    {
      id:5,
      bgColor: 'bg-[#0784C3]',
      text: 'Robotics/IOT Pathway',
      link:'/pathway/robotics-iot',
      img: '/assets/robotics.svg',
    },
    {
      id:6,
      bgColor: 'bg-[#FFB700]',
      text: 'Techprenuership Pathway',
      link:'/pathway/techprenuership',
      img: '/assets/techprenuership.svg',
    },
  ]

  const router = useRouter()
  const [pathwayArray, setPathwayArray] = useState()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [alertType, setAlertType] = useState('')

  async function getPathways(){
    try {
      setLoading(true)
      const response = await get(`/course-pathways/`)
      setPathwayArray(response.data)
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
      {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
      <div className='w-[100%]'>
        <div className='flex justify-end gap-[10px] mb-5'>
          {/* <p></p> */}
          <button className='bg-[#131314] text-white py-2 px-4 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push('/library')}>Library</button>
          <button className='bg-[#131314] text-white py-2 px-4 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push('/add-pathway')}>Add Pathway</button>
          <button className='bg-[#131314] text-white py-2 px-4 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push('/discount')}>Discount</button>
        </div>
        <div>
          {
            pathwayArray?.length === 0 && 
            <div className='flex justify-center items-center flex-col h-[45vh]'>
              <p className='text-[14px] text-[#131314]'>No Pathways Available</p>
              <button className='bg-[#131314] text-white py-2 px-4 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2 mt-3' onClick={() => router.push('/add-pathway')}>Create A Pathway</button>
            </div>
          }
          <div className='grid grid-cols-3 gap-5'>
            {pathwayArray?.map((pathway, index) => (
              <div onClick={() => router.push(`/pathway/${pathway.id}`)} key={index} className={`flex flex-col justify-center items-center gap-5 p-3 rounded-[10px] h-[250px] cursor-pointer bg-[#0784C3]`}>
                <img src={pathway.cover_image?.media} alt={pathway.title} className='w-[150px] h-[150px] object-contain'/>
                <p className='text-[14px] text-white capitalize font-[600] text-center'>{pathway?.title}</p>
              </div>
            ))}
          </div>
            {
              loading && 
              <div className='flex w-full justify-center items-center flex-col'>
                <CardLoader />
              </div>
            }
        </div>
      </div>
    </div>
  )
}

export default Upload
