"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post, uploadFile } from '../../../../utils/axiosHelpers';
import { useParams } from 'next/navigation';
import Alert from '../../../../components/alert/Alert';
import BtnLoader from '../../../../components/btnLoader/BtnLoader';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AddCapstoneProject = () => {

    const { id } = useParams()
    const router = useRouter()
    const [grading_description, setGradingDescription] = useState()
    const [video_embed, setVideoEmbed] = useState()
    const [transcript, setTranscript] = useState()

    const [courseInfo, setCourseInfo] = useState()

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

    async function saveProject(){
        console.log({...projectData, video_embed, transcript, grading_description});
        const projectToUpload = {...projectData, video_embed, transcript, grading_description}
        
        try {
            setLoading(true)
            const response = await post('/projects/', projectToUpload);
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            setProjectData({
                title: '',
                course: '',
                description: '',
                cover_image: ''
            });
            setVideoEmbed('')
            setTranscript('')
            setGradingDescription('');
            router.back();
        } catch (error) {
            setMsg("An error occurred while creating project.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    async function getCourseInfo(){
        try {
            const response = await get(`/courses/${id}/get_by_id/`)
            setCourseInfo(response.data)
            projectData.course = response.data.id
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getCourseInfo()
    },[])

    // const mango = just monkey blast collect brand enable sorry problem shoot april print perfect



  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Project Details</p>
            <div className='mt-10'>
                <p>Course</p>
                <p className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2'>{courseInfo?.title}</p>
            </div>
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
                    <button onClick={saveProject} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Project</button>
            }
        </div>
    </div>
  )
}

export default AddCapstoneProject