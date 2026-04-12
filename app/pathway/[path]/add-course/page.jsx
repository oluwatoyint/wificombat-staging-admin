"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import Alert from '../../../components/alert/Alert'
import BtnLoader from '../../../components/btnLoader/BtnLoader'
import { get, post, uploadFile } from '../../../utils/axiosHelpers'
import { useParams, useRouter } from 'next/navigation'

import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
      <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
    ),
});

const AddCourse = () => {

    const { path } = useParams()
    const router = useRouter()
    const [dropDown, setDropDown] = useState()
    const stages = [
        {
            title: 'Beginner/Elementry',
            value: "beginner"
        },
        {
            title: 'Intermediate/Middle School',
            value: "intermediate"
        },
        {
            title: 'Advance/High School',
            value: "advance"
        }
    ]
    const levels = ["1", "2", "3", "4", "5", "6", "7"]
    const [selectedLevel, setSelectedLevel] = useState('Select Level')
    const [selectedStage, setSelectedStage] = useState('Select Stage')
    const [selectedPathway, setSelectedPathway] = useState()
    
    const [intro_video, setIntroVideo] = useState()
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedBadge, setUploadedBadge] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingBadge, setIsUploadingBadge] = useState(false);
    const [pathwayArray, setPathwayArray] = useState([])

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        cover_image: '',
        level: '',
        stage: '',
        course_pathway: '',
        amount: '',
        badge_icon: ''
    })

    async function getCurrentPathway(){
        try {
            const response = await get(`/course-pathways/${path}`)
            setSelectedPathway(response.data)
            courseData.course_pathway = response.data.id
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }

    async function getPathways(){
        try {
            const response = await get(`/course-pathways/`)
            setPathwayArray(response.data)
            // setPathwayArray(response.data)
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPathways()
        getCurrentPathway()
    }, [])

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
                courseData.cover_image = uploadResponse.data.id
                console.log(uploadResponse.data);
            } catch (error) {
                console.log(error);
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
                courseData.badge_icon = uploadResponse.data.id
                console.log(uploadResponse.data);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // async function saveCourse(){
    //     try {
    //         setLoading(true)
    //         const response = await post('/course-pathways/', pathwayData);
    //         console.log(response);
    //         if(response) setLoading(false)
    //         if(response.success){
    //             setMsg("Pathway created successfully.");
    //             setAlertType('success');
    //             setPathwayData({
    //                 title: '',
    //                 description: '',
    //                 cover_image: ""
    //             });
    //             setUploadedFile(null);
    //         }
    //         if(!response.success){
    //             setMsg("An error occurred while creating pathway.");
    //             setAlertType('error');
    //         }
            
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async function saveCourse() {
        console.log(courseData);
        const costToSave = { ...courseData, intro_video }
        
        try {
            setLoading(true)
            const response = await post('/courses/add/', costToSave);
            console.log(response);
            if(response) setLoading(false)
            setMsg("Course created successfully.");
            setAlertType('success');
            setCourseData({
                title: '',
                description: '',
                cover_image: '',
                level: '',
                stage: '',
                course_pathway: '',
                amount: ''
            });
            setUploadedFile(null);
            router.push(`/pathway/${path}`)
        } catch (error) {
            setMsg("An error occurred while creating course.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    // const mango = just monkey blast collect brand enable sorry problem shoot april print perfect



  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[810px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Course Details</p>
            <div className='mt-10'>
                <p>Course Title</p>
                <input name="title" value={courseData.title} onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
            </div>
            <div className='flex items-center gap-3 w-full mt-5'>
                <div className='w-full'>
                    <p>Course Amount</p>
                    <input name="amount" value={courseData.amount} onChange={handleInputChange} type="number" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='10,000' />
                </div>
                <div className='w-full relative'>
                    <p>Course Pathway</p>
                    <div className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {/* <input type="text" value={selectedLevel} className='outline-none text-[#656765]' placeholder='Level 1'/> */}
                        {
                            selectedPathway?
                            <p className='text-[#656765]'>{selectedPathway?.title}</p>
                            :
                            <p className='text-[#656765]'>Course Pathway</p>
                        }
                        {/* <BiChevronDown className='text-[22px]' /> */}
                    </div>
                    {/* {
                        dropDown === 'pathway' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2 h-[200px] overflow-y-auto'>
                            {pathwayArray.map(pathway => (
                                <li key={pathway.id} onClick={() => {
                                    // setSelectedLevel(pathway)
                                    setDropDown(null)
                                    setSelectedPathway(pathway)
                                    courseData.course_pathway = pathway.id
                                }} className='py-[6px] px-2 text-[13px] cursor-pointer hover:bg-slate-200'>{pathway.title}</li>
                            ))}
                        </ul>
                    } */}
                </div>
            </div>
            <div className='flex items-center gap-3 w-full mt-5'>
                <div className='w-full relative'>
                    <p>Course Level</p>
                    <div onClick={() => setDropDown(dropDown === "level" ? "" : "level")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {/* <input type="text" value={selectedLevel} className='outline-none text-[#656765]' placeholder='Level 1'/> */}
                        {
                            selectedLevel !== "Select Level" ?
                            <p className='text-[#656765]'>Level {selectedLevel}</p>
                            :
                            <p className='text-[#656765]'>Select Level</p>
                        }
                        {/* <p className='text-[#656765]'>Level {selectedLevel}</p> */}
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'level' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2 h-[200px] overflow-y-auto'>
                            {levels.map(level => (
                                <li key={level} onClick={() => {
                                    setSelectedLevel(level)
                                    setDropDown(null)
                                    courseData.level = level
                                }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>Level {level}</li>
                            ))}
                        </ul>
                    }
                </div>
                <div className='w-full relative'>
                    <p>Course  Stage</p>
                    <div onClick={() => setDropDown(dropDown === "stage" ? "" : "stage")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {/* <input type="text" className='outline-none text-[#656765]' placeholder='Level 1'/> */}
                        <p className='text-[#656765]'>{selectedStage?.title}</p>
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'stage' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                            {stages.map(stage => (
                                <li key={stage.title} onClick={() => {
                                    setSelectedStage(stage)
                                    setDropDown(null)
                                    courseData.stage = stage.value
                                }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{stage.title}</li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Course Description</p>
                <textarea name="description" value={courseData.description} onChange={handleInputChange} className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a description...'></textarea>
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Intro Video</p>
                <ReactQuill theme="snow" className='react-quill' value={intro_video} onChange={e => setIntroVideo(e)} formats={formats} modules={modules} />
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
                                <p className='text-[#131314] font-[700] my-1'>Upload course thumbnail</p>
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
                                <p className='text-[#131314] font-[700] my-1'>Upload course badge</p>
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
                    <button onClick={saveCourse} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Course</button>
            }
        </div>
    </div>
  )
}

export default AddCourse