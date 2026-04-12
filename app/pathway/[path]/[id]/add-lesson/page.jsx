"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post, remove, uploadFile } from '../../../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import Alert from '../../../../components/alert/Alert';
import BtnLoader from '../../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AddLesson = () => {

    const { path, id } = useParams()
    const router = useRouter()
    const [note, setNote] = useState()
    const [video_embed, setVideoEmbed] = useState()
    const [transcript, setTranscript] = useState()

    const [courseInfo, setCourseInfo] = useState()

    const [currentTab, setCurrentTab] = useState('add-lesson')
    // const [currentTab, setCurrentTab] = useState('lesson-quiz')

    const [allModules, setModules] = useState()
    const [selectedModule, setSelectedModule] = useState()
    const [dropDown, setDropDown] = useState()
    
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [createdLesson, setCreatedLesson] = useState()
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        // cover_image: '',
        module: '',
        order: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: name === 'order' ? (value === '' ? null : Number(value)) : value, // Convert 'order' to a number
        }));
    };

    async function getModules(){
        try {
            const response = await get(`/modules/get_all?course_id=${id}`)
            setModules(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function saveLesson(){
        const lessonToUpload = {...lessonData, video_embed, transcript, note}
        try {
            setLoading(true)
            const response = await post('/lessons/', lessonToUpload);
            console.log(response.data);
            if(response) setLoading(false)
            setMsg(response.message);
            setAlertType('success');
            setLessonData({
                title: '',
                description: '',
                cover_image: '',
                module: '',
            });
            setTranscript('')
            setVideoEmbed('')
            setUploadedFile(null)
            setNote('');
            // setCurrentTab('lesson-quiz')
            setCreatedLesson(response.data)
            router.push(`/pathway/${path}/${id}/add-lesson/${response.data.id}/add-lesson-quiz`)
        } catch (error) {
            console.log(error);
            setMsg(error.message || "An error occurred while creating lesson.");
            setAlertType('error');
        }finally{
            setLoading(false)
        }
    }

    async function getCourseInfo(){
        try {
            const response = await get(`/courses/${id}/get_by_id/`)
            setCourseInfo(response.data)
            lessonData.course = response.data.id
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getModules()
        getCourseInfo()
    },[])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            {
                currentTab === 'add-lesson' &&
                <>
                    <p className='text-[18px] text-[#131314] font-[500]'>Lesson Details</p>
                    <div className='flex flex-row-reverse items-center justify-between w-full gap-5 mt-10'>
                        <div className='w-full'>
                            <p>Order Number</p>
                            <input value={lessonData.order || ''} name='order' onChange={handleInputChange} type="number" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Enter order number' />
                        </div>
                        <div className='flex items-center gap-3 w-full'>
                            <div className='w-full relative' onClick={() => setDropDown(dropDown === "module" ? "" : "module")}>
                                <p>Select Module</p>
                                <div className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                                    <p className='text-[#656765]'>{selectedModule?.title}</p>
                                    <BiChevronDown className='text-[22px]' />
                                </div>
                                {
                                    dropDown === 'module' &&
                                    <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                        {allModules?.map((mdl, index) => (
                                            <li key={index} onClick={() => {
                                                setSelectedModule(mdl)
                                                lessonData.module = mdl.id
                                                setDropDown(null)
                                            }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{mdl.title}</li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-5'>
                        <p>Lesson Title</p>
                        <input value={lessonData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Enter lesson title' />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Lesson Transcript</p>
                        <ReactQuill theme="snow" className='react-quill' value={transcript} onChange={e => setTranscript(e)} formats={formats} modules={modules} />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Lesson Note</p>
                        <ReactQuill theme="snow" className='react-quill' value={note} onChange={e => setNote(e)} formats={formats} modules={modules} />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Video Embed</p>
                        <ReactQuill theme="snow" className='react-quill' value={video_embed} onChange={e => setVideoEmbed(e)} formats={formats} modules={modules} />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Lesson Description</p>
                        <textarea onChange={handleInputChange} value={lessonData.description} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a Lesson Description'></textarea>
                    </div>
                    {/* <div className='border border-[#E866FF] p-3 rounded-[10px] mt-5 h-[220px]'>
                        { isUploading ?
                            <div className='flex items-center flex-col justify-center text-[13px] mt-[4rem] gap-2'>
                                <img src="/assets/loader1.gif" className='w-[30px]' alt="" />
                                <p className='capitalize'>File Upload In Progress, Please Do Not Refresh this page.</p> 
                            </div>
                            :
                            <>
                                {
                                    uploadedFile ? 
                                    <div className='flex items-center justify-center flex-col border border-dashed border-[#CBCBCD] rounded-[8px] py-1 relative h-full'>
                                        <input type="file" onChange={handleFileChange} className='absolute opacity-0 h-full w-full' />
                                        <div className='p-3 h-[200px] w-full'>
                                            <img src={uploadedFile.media} className='w-full h-full object-contain' alt="" />
                                        </div>
                                    </div>
                                    :
                                    <div className='flex items-center justify-center flex-col border border-dashed border-[#CBCBCD] rounded-[8px] py-1 relative h-full'>
                                        <input type="file" onChange={handleFileChange} className='absolute opacity-0 h-full w-full' />
                                        <div className='p-3 shadow-xl rounded-lg'>
                                            <img src="/assets/cloud.svg" alt="" />
                                        </div>
                                        <p className='text-[#131314] font-[700] my-1'>Upload Image</p>
                                        <p className='text-[#636369]'>Or click to browse (16 MB)</p>
                                    </div>
                                }
                            </>
                        }
                    </div> */}
                    {
                        loading ?
                            <div className='bg-[#B1B1B4] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                                <BtnLoader />
                            </div>
                            :
                            <button onClick={saveLesson} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Lesson</button>
                    }

                    <div className='flex justify-between mt-5 border-t py-5'>
                        <p>Page 1 of 2</p>
                        {/* {
                            alertType === 'success' &&
                            <button className='border px-3 py-1 rounded-[5px]' onClick={() => setCurrentTab('lesson-quiz')}>Next</button>
                        } */}
                    </div>
                </>
            }

            {/* {
                currentTab === "lesson-quiz" &&
                <LessonQuiz setCurrentTab={setCurrentTab} createdLesson={createdLesson}/>
            } */}

        </div>
    </div>
  )
}

export default AddLesson