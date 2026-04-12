"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post, uploadFile } from '../../../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import Alert from '../../../../components/alert/Alert';
import BtnLoader from '../../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AddModule = () => {

    const { id } = useParams()
    const [objectives, setObjectives] = useState()
    const [learning_outcome, setLearningOutcome] = useState()
    const [courseInfo, setCourseInfo] = useState()
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedBadge, setUploadedBadge] = useState(null);
    const [moduleData, setModuleData] = useState({
        title: '',
        course: '',
        description: '',
        order: null,
        cover_image: '',
        badge_icon: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingBadge, setIsUploadingBadge] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModuleData(prev => ({
            ...prev,
            [name]: name === 'order' ? (value === '' ? null : Number(value)) : value, // Convert 'order' to a number
        }));
    };

    // TODO: Make file upoloads use one funtion

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 16 * 1024 * 1024) { // 16MB limit
            try {
                setIsUploading(true);
                const uploadResponse = await uploadFile(
                    '/media/upload', // Adjust this endpoint
                    selectedFile,
                    'photo'
                );
                
                setMsg("File Uploaded Successfully.");
                setAlertType('success')
                setUploadedFile(uploadResponse.data)
                moduleData.cover_image = uploadResponse.data.id
            } catch (error) {
                setMsg("Upload failed. Please try again.");
                setAlertType('error')
                
            }finally {
                setIsUploading(false);
            }
            
        } else {
            setMsg("File size must be less than 16MB.");
            setAlertType('error')
        }
    };

    const handleFileChangeForBadgeIconUpload = async (e) => {
        console.log(e);
        
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 16 * 1024 * 1024) { // 16MB limit
            try {
                setIsUploadingBadge(true);
                const uploadResponse = await uploadFile(
                    '/media/upload', // Adjust this endpoint
                    selectedFile,
                    'photo'
                );
                
                setMsg("File Uploaded Successfully.");
                setAlertType('success')
                setUploadedBadge(uploadResponse.data)
                moduleData.badge_icon = uploadResponse.data.id
            } catch (error) {
                console.log(error);
                setMsg("Upload failed. Please try again.");
                setAlertType('error')
                
            }finally{
                setIsUploadingBadge(false);
            }
        } else {
            setMsg("File size must be less than 16MB.");
            setAlertType('error')
        }
    };

    async function saveModule(){
        const moduleToUpload = {...moduleData, objectives, learning_outcome}

        console.log(moduleToUpload);
        try {
            setLoading(true)
            const response = await post('/modules/', moduleToUpload);
            console.log(response);
            if(response) setLoading(false)
            setMsg(response.message);
            setAlertType('success');
            setModuleData({
                title: '',
                course: '',
                description: '',
                // order: null,
                cover_image: '',
                badge_icon: ''
            });
            setObjectives('')
            setLearningOutcome('')
            setUploadedFile(null);
            router.back()
            
        } catch (error) {
            setMsg("An error occurred while creating pathway.");
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
            moduleData.course = response.data.id
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
            <p className='text-[18px] text-[#131314] font-[500]'>Module Details</p>
            <div className='mt-10'>
                <p>Course</p>
                <p className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2'>{courseInfo?.title}</p>
            </div>
            <div className='mt-5'>
                <p>Module Title</p>
                <input value={moduleData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
            </div>
            <div className='mt-5'>
                <p>Order Number</p>
                <input value={moduleData.order || ''} name='order' onChange={handleInputChange} type="number" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Enter order number' />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Module Objective</p>
                <ReactQuill theme="snow" className='react-quill' value={objectives} onChange={e => setObjectives(e)} formats={formats} modules={modules} />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Learning Outcome</p>
                <ReactQuill theme="snow" className='react-quill' value={learning_outcome} onChange={e => setLearningOutcome(e)} formats={formats} modules={modules} />
            </div>
            {/* <div className='flex items-center gap-3 w-full mt-5'>
                <div className='w-full relative' onClick={() => setDropDown(dropDown === "numberOfLesson" ? "" : "numberOfLesson")}>
                    <p>Number of Lesson..</p>
                    <div className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        <p className='text-[#656765]'>{selectedStage}</p>
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'numberOfLesson' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                            {stages.map(stage => (
                                <li key={stage} onClick={() => {
                                    setSelectedStage(stage)
                                    setDropDown(null)
                                }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{stage}</li>
                            ))}
                        </ul>
                    }
                </div>
            </div> */}
            <div className='mt-5'>
                <p className='text-[#344054]'>Module Description</p>
                <textarea value={moduleData.description} onChange={handleInputChange} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a Learning Outcome'></textarea>
            </div>
            <div className='border border-[#E866FF] p-3 rounded-[10px] mt-5 h-[220px]'>
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
                                <p className='text-[#131314] font-[700] my-1'>Upload Module Cover Image</p>
                                <p className='text-[#636369]'>Or click to browse (16 MB)</p>
                            </div>
                        }
                    </>
                }
            </div>

            <div className='border border-[#E866FF] p-3 rounded-[10px] mt-5 h-[220px]'>
                { isUploadingBadge ?
                    <div className='flex items-center flex-col justify-center text-[13px] mt-[4rem] gap-2'>
                        <img src="/assets/loader1.gif" className='w-[30px]' alt="" />
                        <p className='capitalize'>File Upload In Progress, Please Do Not Refresh this page.</p> 
                    </div>
                    :
                    <>
                        {
                            uploadedBadge ? 
                            <div className='flex items-center justify-center flex-col border border-dashed border-[#CBCBCD] rounded-[8px] py-1 relative h-full'>
                                <input type="file" onChange={handleFileChangeForBadgeIconUpload} className='absolute opacity-0 h-full w-full' />
                                <div className='p-3 h-[200px] w-full'>
                                    <img src={uploadedBadge.media} className='w-full h-full object-contain' alt="" />
                                </div>
                            </div>
                            :
                            <div className='flex items-center justify-center flex-col border border-dashed border-[#CBCBCD] rounded-[8px] py-1 relative h-full'>
                                <input type="file" onChange={handleFileChangeForBadgeIconUpload} className='absolute opacity-0 h-full w-full' />
                                <div className='p-3 shadow-xl rounded-lg'>
                                    <img src="/assets/cloud.svg" alt="" />
                                </div>
                                <p className='text-[#131314] font-[700] my-1'>Upload Badge Icon</p>
                                <p className='text-[#636369]'>Or click to browse (16 MB)</p>
                            </div>
                        }
                    </>
                }
            </div>
            {
                loading ?
                    <div className='bg-[#B1B1B4] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                        <BtnLoader />
                    </div>
                    :
                    <button onClick={saveModule} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Module</button>
            }
        </div>
    </div>
  )
}

export default AddModule