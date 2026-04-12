"use client"

import { get, put, remove } from '../../../../../utils/axiosHelpers'
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../../utils/quillEditorConfig"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiPlus } from 'react-icons/bi'
import dynamic from 'next/dynamic'
import Alert from '../../../../../components/alert/Alert';
import BtnLoader from '../../../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AddCapstoneProject = () => {

    const { id, projectId } = useParams()
    const router = useRouter()
    const [grading_description, setGradingDescription] = useState()
    const [video_embed, setVideoEmbed] = useState()
    const [transcript, setTranscript] = useState()

    const [courseInfo, setCourseInfo] = useState()
    const [allCourses, setAllCourses] = useState()
    const [dropDown, setDropDown] = useState()

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        course: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function updateProject(){
        const projectToUpdate = {...projectData, video_embed, transcript, grading_description}
        console.log(projectToUpdate);
        
        try {
            setLoading(true)
            const response = await put(`/projects/${projectId}/`, projectToUpdate);
            setMsg(response.message);
            setAlertType('success');
            console.log(response);
        } catch (error) {
            setMsg(error.message);
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    async function deleteProject(){
        try {
            setLoading(true)
            const response = await remove(`/projects/${projectId}/`)
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            router.back()
            
        } catch (error) {
            setMsg("An error occurred while deleting project.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    async function getAllCourse(){
        try {
            const response = await get(`/courses/get_all/`)
            setAllCourses(response.data)
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    async function getProjectInfo(){
        try {
            const response = await get(`/projects/${projectId}`)
            console.log(response);
            setProjectData({
                title: response.data.title,
                description: response.data.description,
                course: response.data.course.id
            })
            setCourseInfo(response.data.course)
            setVideoEmbed(response.data.video_embed)
            setTranscript(response.data.transcript)
            setGradingDescription(response.data.grading_description)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getAllCourse()
        getProjectInfo()
    },[])

    // const mango = just monkey blast collect brand enable sorry problem shoot april print perfect



  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Project Details</p>
            <div className='w-full relative mt-10'>
                <p>Course</p>
                <div onClick={() => setDropDown(dropDown === "selectCourse" ? "" : "selectCourse")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                    <p className='text-[#656765]'>{courseInfo?.title}</p>
                    <BiChevronDown className='text-[22px]' />
                </div>
                {
                    dropDown === 'selectCourse' &&
                    <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2 h-[150px] overflow-y-auto'>
                        {allCourses?.map((course, index) => (
                            <li key={index} onClick={() => {
                                setCourseInfo(course)
                                projectData.course = course.id
                                setDropDown(null)
                            }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{course.title}</li>
                        ))}
                    </ul>
                }
            </div>
            {/* <div className=''>
                <p>Course</p>
                <p className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2'>{courseInfo?.title}</p>
            </div> */}
            <div className='mt-5'>
                <p>Project Title</p>
                <input value={projectData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Project Description</p>
                <textarea value={projectData.description} onChange={handleInputChange} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a Learning Outcome'></textarea>
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Video Embed</p>
                <ReactQuill theme="snow" className='react-quill' value={video_embed} onChange={e => setVideoEmbed(e)} formats={formats} modules={modules} />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Project Transcript</p>
                <ReactQuill theme="snow" className='react-quill' value={transcript} onChange={e => setTranscript(e)} formats={formats} modules={modules} />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Grading Description</p>
                <ReactQuill theme="snow" className='react-quill' value={grading_description} onChange={e => setGradingDescription(e)} formats={formats} modules={modules} />
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
                    <div className='flex justify-between'>
                        <p></p>
                        <div className='flex itemc-center gap-4'>
                            <button onClick={updateProject} className='border border-[#131314] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#131314] font-[500]'>Update Project</button>
                            <button onClick={deleteProject} className='bg-[#F00101] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500]'>Delete Project</button>
                        </div>
                    </div>
            }
        </div>
    </div>
  )
}

export default AddCapstoneProject