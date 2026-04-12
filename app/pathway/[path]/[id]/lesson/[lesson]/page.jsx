"use client"

import { get, put, remove } from '../../../../../utils/axiosHelpers'
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../../utils/quillEditorConfig"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Alert from '../../../../../components/alert/Alert';
import BtnLoader from '../../../../../components/btnLoader/BtnLoader';


const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const LessonInfo = () => {

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
        order: 0,
        module:''
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getLessonInfo(){
        try {
            const response = await get(`/lessons/${lesson}`)
            console.log(response);
            
            setLessonInfo(response.data)
            setLessonData({
                title: response.data.title,
                description: response.data.description,
                order: response.data.order.toString(),
                module: response.data.module.id,
            })
            setVideoEmbed(response.data.video_embed)
            setTranscript(response.data.transcript)
            setNote(response.data.note)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateLesson(){
        const { order, ...lessonToUpdate } = {...lessonData, video_embed, transcript, note}
        console.log("lessonToUpdate ===== ", lessonToUpdate);
        
        try {
            setLoading(true)
            await put(`/lessons/${lesson}/`, lessonToUpdate)
            getLessonInfo()
            setMsg("Lesson Updated Successfully.");
            setAlertType('success')
        } catch (error) {
            console.log(error)
            setMsg("Failed to update lesson.");
            setAlertType('error')
        }finally{
            setLoading(false)
        }
    }

    // async function deleteLesson(){
    //     try {
    //         const response = await remove(`/lessons/${moduleId}/`)
    //         console.log(response);
    //         router.push(`/pathway/${path}/${id}`)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async function deleteLesson(){
        try {
            const response = await remove(`/lessons/${lesson}/`)
            console.log(response);
            router.back()
            setMsg("Lesson deleted successfully.");
            setAlertType('success');
        } catch (error) {
            setMsg("An error occurred while deleting lesson.");
            setAlertType('error');
            console.log(error);
        }
    }

    useEffect(() => {
        getLessonInfo()
    }, [])


  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='flex items-center justify-between'>
            <p className='text-[#131314] text-[24px] font-[700] capitalize'>{lessonInfo?.title}</p>
            <p className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push(`/pathway/${path}/${id}/lesson/${lesson}/quiz`)}> Lesson Quizes</p>
        </div>
        <div className='flex items-center border-b justify-between pb-6'>
            {/* <div>
                {
                    tabs.map((tab, index) => (
                        <button key={index} onClick={() => {
                            router.push(`/pathway/${path}/${id}`)
                            setSelectedTab(tab)
                            localStorage.setItem('selectedPath', tab)
                        }} className={ selectedTab === tab ? `bg-[#0784C3] px-5 py-1 text-white rounded-full mx-1` : `hover:bg-[#0784C3] text-[#636369] px-5 py-1 hover:text-white rounded-full mx-1`}>
                            {tab}
                        </button>
                    ))
                }
            </div> */}
        </div>
        <div className='my-10'>
            <div className='w-[95%] py-5 px-4 rounded-[10px]'>
                {/* {
                    lessonData.cover_image &&
                    <img src={`${lessonData?.cover_image}`} className='w-[200px] h-[200px] object-cover'  alt="" />
                } */}
                <div className='w-full relative mt-5'>
                    <p>Lesson Title</p>
                    <div className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2'>
                    {
                        edit ?
                        <input type="text" name='title' onChange={handleInputChange} value={lessonData?.title}  className='w-full text-[#656765] outline-none py-1' />
                        :
                        <p className='text-[#656765] py-1'>{lessonInfo?.title}</p>
                    }
                    </div>
                </div>
                <div className='w-full relative mt-5'>
                    <p>Order Number</p>
                    <div className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2'>
                        
                    {
                        edit ?
                        <input type="text" name='order' onChange={handleInputChange} value={lessonData?.order}  className='w-full text-[#656765] outline-none py-1' />
                        :
                        <p className='text-[#656765] py-1'>{lessonInfo?.order}</p>
                    }
                    </div>
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Lesson Note</p>
                    {
                        edit ?
                        <div className='mt-1'>
                            <ReactQuill theme="snow" className='react-quill' value={note} onChange={e => setNote(e)} formats={formats} modules={modules} />
                        </div>
                        :
                        <p dangerouslySetInnerHTML={{ __html: note }} className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' />
                    }
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Lesson Transcript</p>
                    {
                        edit ?
                        <div className='mt-1'>
                            <ReactQuill theme="snow" className='react-quill' value={transcript} onChange={e => setTranscript(e)} formats={formats} modules={modules} />
                        </div>
                        :
                        <p dangerouslySetInnerHTML={{ __html: transcript }} className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' />
                    }
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Video Embed</p>
                    {
                        edit ?
                        <div className='mt-1'>
                            <ReactQuill theme="snow" className='react-quill' value={video_embed} onChange={e => setVideoEmbed(e)} formats={formats} modules={modules} />
                        </div>
                        :
                        <p dangerouslySetInnerHTML={{ __html: transcript }} className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' />
                    }
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Module Description</p>
                    {
                        edit ?
                        <textarea name='description' onChange={handleInputChange} value={lessonData?.description} className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Module Objectives'></textarea>
                        :
                        <p className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]'>Module Objectives</p>
                    }
                </div>
                <div className='flex justify-between'>
                    <p></p>
                    {
                        loading ?
                        <BtnLoader />
                        :
                        <div className='flex justify-between'>
                            <p></p>
                            <div className='flex gap-5'>
                                <button onClick={updateLesson} className='border border-[#131314] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#131314] font-[500]'>Save Changes</button>
                                <button onClick={deleteLesson} className='bg-[#F00101] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500]'>Delete Lesson</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default LessonInfo