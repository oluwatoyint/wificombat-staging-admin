"use client"

import { get, put, remove } from '../../../../../../utils/axiosHelpers'
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../../../utils/quillEditorConfig"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import dynamic from 'next/dynamic'
import Alert from '../../../../../../components/alert/Alert';
import BtnLoader from '../../../../../../components/btnLoader/BtnLoader';


const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const LessonQuizesInfo = () => {

    const { id, path, moduleId, lesson } = useParams()
    const router = useRouter()
    const [lessonInfo, setLessonInfo] = useState()
    const [edit, setEdit] = useState(true)
    const [note, setNote] = useState()
    const [video_embed, setVideoEmbed] = useState()
    const [transcript, setTranscript] = useState()

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        cover_image: '',
        module: '',
        order: 0
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getLessonQuizInfo(){
        try {
            const response = await get(`/lesson-quizzes/get-all/${lesson}`)
            console.log("All Lesson Quizes", response);
            
            // setLessonInfo(response.data)
            // setLessonData({
            //     title: response.data.title,
            //     description: response.data.description,
            //     order: response.data.order
            // })
            // setVideoEmbed(response.data.video_embed)
            // setTranscript(response.data.transcript)
            // setNote(response.data.note)
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteQuiz(){

    }

    useEffect(() => {
        getLessonQuizInfo()
    }, [])


  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='flex items-center justify-between'>
            <p className='text-[#131314] text-[24px] font-[700] capitalize'>{lessonInfo?.title}</p>
            <p className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.back()}> Lesson Info</p>
        </div>
        <div className='my-10'>
            <div className='w-[95%] py-5 px-4 rounded-[10px]'>
                
            </div>
        </div>
    </div>
  )
}

export default LessonQuizesInfo