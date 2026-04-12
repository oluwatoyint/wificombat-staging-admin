import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { get } from '../../utils/axiosHelpers';
import { BiPlus } from 'react-icons/bi';
import { trimText } from '../../utils/trimText'
import CardLoader from '../cardLoader/CardLoader';

const ModuleComponent = () => {

  const { id, path } = useParams()
  const [modules, setModules] = useState()
  const [loading, setLoading] = useState(false)

    async function getAllModules(){
        try {
            setLoading(true)
            const response = await get(`/modules/get_all?course_id=${id}`)
            console.log(response);
            
            setModules(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
      getAllModules()
    }, [])
  
  
  const router = useRouter()

  return (
    <div>
        <div className='grid gap-4 grid-cols-4'>
        {
            modules?.map((modul, index) => (
                <div key={index} className='w-[270px] shadow-xl p-3 rounded-[15px] cursor-pointer' onClick={() => router.push(`/pathway/${id}/${id}/module/${modul.id}`)}>
                    <img src={modul?.cover_image?.media} className='h-[150px] object-cover w-full' alt="" />
                    <p className='text-[#4B4B4E] mb-2 mt-4 font-[500]'>{modul?.title}</p>
                    <p className='text-[#636369] mb-1'>Level {modul?.course?.level}</p>
                    <p className='text-[#323234] text-[14px]'>{trimText(modul?.description, 150)}</p>
                </div>
            ))
        }
        </div>
        {
            modules?.length === 0 &&
            <div className='flex justify-center items-center flex-col h-[45vh] gap-3'>
              <p className='text-[#656765] text-center mt-10'>No modules found</p>
              <p className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push(`/pathway/${path}/${id}/add-module`)}> <BiPlus /> Add Module</p>
            </div>
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

export default ModuleComponent