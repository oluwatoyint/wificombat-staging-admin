"use client"

import { get } from '../../../utils/axiosHelpers'
import CourseDetails from '../../../components/courseDetails/CourseDetails'
import ModuleComponent from '../../../components/moduleComponent/ModuleComponent'
import FlashcardComponent from '../../../components/flashcardComponent/FlashcardComponent'
import LessonComponent from '../../../components/lessonComponent/LessonComponent'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import CapstoneProjectComponent from '../../../components/capstoneProjectComponent/CapstoneProjectComponent'
import AssignmentComponent from '../../../components/assignmentComponent/AssignmentComponent'

const PathwayInfo = () => {

    const { id, path } = useParams()
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState()
    const [currentPath, setCurrentPath] = useState('')
    const [pathwayInfo, setPathwayInfo] = useState()
    const [courseInfo, setCourseInfo] = useState()
    const [navigationPath, setNavigationPath] = useState('')

    const tabs = [
        {
            title: 'Course Details',
            path: 'add-course',
            component: <CourseDetails courseInfo={courseInfo}/>
        },
        {
            title: 'Modules',
            path: 'add-module',
            component: <ModuleComponent />
        },
        {
            title: 'Flashcards',
            path: 'add-flashcard',
            component: <FlashcardComponent />
        },
        {
            title: 'Lessons',
            path: 'add-lesson',
            component: <LessonComponent />
        },
        {
            title: 'Assignment',
            path: 'add-assignment',
            component: <AssignmentComponent />
        },
        {
            title: 'Capstone Project',
            path: 'add-project',
            component: <CapstoneProjectComponent />
        },
    ]

    useEffect(() => {
        const selectedPath = localStorage.getItem('selectedPath')
        console.log({selectedPath, selectedTab, currentPath});
        
        if(selectedPath){
            setSelectedTab(selectedPath)
            if(selectedPath === 'Course Details'){
                setNavigationPath(`/pathway/${path}/add-course`)
            }else if(selectedPath === 'Modules'){
                setNavigationPath(`/pathway/${path}/${id}/add-module`)
            }else if(selectedPath === 'Lessons'){
                setNavigationPath(`/pathway/${path}/${id}/add-lesson`)
            }else if(selectedPath === 'Assignment'){
                setNavigationPath(`/pathway/${path}/${id}/add-assignment`)
            }else if(selectedPath === 'Flashcards'){
                setNavigationPath(`/pathway/${path}/${id}/add-flashcard`)
            }else{
                setNavigationPath(`/pathway/${path}/${id}/add-capstone-project`)
            }
        } else {
            setSelectedTab(tabs[0].title)
            setCurrentPath('add-course')
        }
    },[selectedTab, navigationPath])

    async function getPathwayInfo(){
        try {
            const response = await get(`/course-pathways/${path}`)
            setPathwayInfo(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getCourseInfo(){
        try {
            const response = await get(`/courses/${id}/get_by_id/`)
            setCourseInfo(response.data)
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPathwayInfo()
        getCourseInfo()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        <div className='flex items-center justify-between'>
            <p className='text-[#131314] text-[20px] font-[700] capitalize mb-5'>{pathwayInfo?.title} / {courseInfo?.title}</p>
            <p className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push(navigationPath)}> <BiPlus /> Add {selectedTab}</p>
        </div>
        <div className='flex items-center border-b justify-between pb-6'>
            <div>
                {
                    tabs.map((tab, index) => (
                        <button key={index} onClick={() => {
                            router.push(`/pathway/${path}/${id}`)
                            setSelectedTab(tab.title)
                            setCurrentPath(tab.path)
                            localStorage.setItem('selectedPath', tab.title)
                        }} className={ selectedTab === tab.title ? `bg-[#0784C3] px-5 py-1 text-white rounded-full mx-1` : `hover:bg-[#0784C3] text-[#636369] px-5 py-1 hover:text-white rounded-full mx-1`}>
                            {tab.title}
                        </button>
                    ))
                }
            </div>
        </div>
        <div className='my-10'>
            {
                selectedTab === "Course Details" &&
                tabs[0].component
            }
            {
                selectedTab === "Modules" &&
                tabs[1].component
            }
            {
                selectedTab === "Flashcards" &&
                tabs[2].component
            }
            {
                selectedTab === "Lessons" &&
                tabs[3].component
            }
            {
                selectedTab === "Assignment" &&
                tabs[4].component
            }
            {
                selectedTab === "Capstone Project" &&
                tabs[5].component
            }
        </div>
    </div>
  )
}

export default PathwayInfo