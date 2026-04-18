"use client"

import { get } from '../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { trimText } from '../../utils/trimText';
import CardLoader from '../cardLoader/CardLoader';

const LessonComponent = () => {

    const { path, id } = useParams()
    const [allLessons, setAllLessons] = useState()
    const [dropDown, setDropDown] = useState('')
    const [allModules, setModules] = useState()
    const [modul, setModule] = useState();
    const [loading, setLoading] = useState(false)
    
    async function getModules(){
        try {
            const response = await get(`/modules/get_all?course_id=${id}`)
            console.log(response);
            
            setModules(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    
    async function getAllLessons() {
        try {
            setLoading(true)
            const response = await get(`/lessons/get_all?course_id=${id}`)
            console.log(response.data);
            
            const sortedLessons = response.data.sort((a, b) => a.order - b.order);
        
            setAllLessons(sortedLessons);
            
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    async function getLessons(moduleId) {
        try {
            setLoading(true)
            const response = await get(`/lessons/get_all?module_id=${moduleId}`)
            console.log(response.data);
            
            setAllLessons(response.data)
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllLessons()
        getModules()
    }, [])
  
  
  const router = useRouter()

  return (
    <div>
        <div className='flex justify-between mb-5'>
            <p></p>
            <div>
                <div className='flex items-center gap-3 w-[250px]'>
                {
                    allModules?.length > 0 &&
                    <div className='w-full relative'>
                        <p>Select Module</p>
                        <div onClick={() => setDropDown(dropDown === "selectModule" ? "" : "selectModule")} className='border flex items-center justify-between py-[6px] mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>{modul?.title ? modul.title : "All"}</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                            <>
                                {
                                    dropDown === 'selectModule' &&
                                    <ul className='absolute z-10 top-[70px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                            <li className='py-1 px-2 cursor-pointer hover:bg-slate-200' onClick={() => {
                                                setDropDown(null)
                                                setModule(null)
                                                getAllLessons()
                                            }}>All</li>
                                        {allModules?.map((mdl, index) => (
                                            <li key={index} onClick={() => {
                                                setModule(mdl)
                                                getLessons(mdl.id)
                                                setDropDown(null)
                                            }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{mdl.title}</li>
                                        ))}
                                        <>
                                            {
                                                allModules?.length === 0 &&
                                                <p className='text-[#656765] text-center my-10'>No modules found</p>
                                            }
                                        </>
                                    </ul>
                                }
                            </>
                    </div>
                }
                </div>
            </div>
        </div>
        {
            allLessons?.length === 0 &&
            <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                <p>No lessons found for this course or module.</p>
                <button onClick={() => router.push(`/pathway/${path}/${id}/add-lesson`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add Lesson</button>
            </div>
        }
        <div className='grid gap-4 grid-cols-2'>
        {
            allLessons?.map((lesson, index) => (
                <div key={index} className='w-[100%] shadow p-3 rounded-[15px] cursor-pointer flex gap-3' onClick={() => router.push(`/pathway/${path}/${id}/lesson/${lesson.id}`)}>
                    {/* <img src={`${lesson.cover_image?.media}`} alt="" className='w-[200px] h-[120px] object-cover' /> */}
                    <div>
                        <p className='text-[#4B4B4E] mb-1 mt-4 font-[500]'>{lesson.title}</p>
                        <p className='text-[#636369] mb-1'>Level {lesson?.module?.course?.level}</p>
                        <p className='text-[#323234] text-[14px]'>{trimText(lesson.description, 80)}</p>
                    </div>
                </div>
            ))
        }
        </div>
        {
          loading &&
          <div className='flex justify-center items-center'>
            <CardLoader />
          </div>
        }
    </div>
  )
}

export default LessonComponent
