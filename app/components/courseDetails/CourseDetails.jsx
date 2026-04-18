"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi';
import { PiCameraLight } from "react-icons/pi";
import { get, put, remove, uploadFile } from '../../utils/axiosHelpers';
import { useParams } from 'next/navigation';
import Alert from '../alert/Alert';
import { useRouter } from 'next/navigation';

import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
      <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
    ),
});

const CourseDetails = ({courseInfo}) => {

    const { id, path } = useParams()
    const router = useRouter()
    const [edit, setEdit] = useState(true)
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
    const [pathwayArray, setPathwayArray] = useState([])
    const [coverImageId, setCoverImageId] = useState('');
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null);
    const [intro_video, setIntroVideo] = useState()
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [uploadedBadge, setUploadedBadge] = useState(null);
    const [isUploadingBadge, setIsUploadingBadge] = useState(false);
    const [badgeIconId, setBadgeIconId] = useState('');

    const [courseData, setCourseData] = useState({
        title: courseInfo?.title || '',
        description: courseInfo?.description || '',
        cover_image: courseInfo?.cover_image || '',
        level: courseInfo?.level || '',
        stage: courseInfo?.stage || '',
        course_pathway: courseInfo?.course_pathway || '',
        amount: courseInfo?.amount || '',
        badge_icon: courseInfo?.badge_icon,
    })

    useEffect(() => {
        if (courseInfo) {
            setCourseData({
                title: courseInfo.title || '',
                description: courseInfo.description || '',
                cover_image: courseInfo.cover_image || '',
                level: courseInfo.level || '',
                stage: courseInfo.stage || '',
                course_pathway: courseInfo.course_pathway || '',
                amount: courseInfo.amount || '',
                badge_icon: courseInfo?.badge_icon,
            })
            setSelectedLevel(courseInfo.level || 'Select Level')
            setSelectedStage(courseInfo.stage || 'Select Stage')
            setSelectedPathway(courseInfo.course_pathway || 'Select a Pathway')
            setCoverImageId(courseInfo.cover_image.id)
            setBadgeIconId(courseInfo.badge_icon.id)
            setIntroVideo(courseInfo.intro_video || '')
        }
    }, [courseInfo])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
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
    },[])

    async function updateCourse(){
        const courseToUpdate = {...courseData, course_pathway:courseData.course_pathway.id, cover_image:coverImageId, badge_icon:badgeIconId, intro_video:intro_video}
        console.log(courseToUpdate);
        
        try {
            const response = await put(`/courses/${id}/modify/`, courseToUpdate)
            // getLessonInfo()
            setMsg("Course Updated Successfully.");
            setAlertType('success')
            console.log(response)
        } catch (error) {
            console.log(error)
            setMsg("Failed to update course.");
            setAlertType('error')
        }
    }

    async function deleteCourse(){
        try {
            const response = await remove(`/courses/${id}/remove/`)
            console.log(response);
            router.push(`/pathway/${path}`)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = async (e) => {
        let imageType = 'cover_image'

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
                setCoverImageId(uploadResponse.data.id)
                updateCourseAfterImageUpload(uploadResponse.data.id, imageType)
            } catch (error) {
                console.log(error);
                
                setMsg("Upload failed. Please try again.");
                setAlertType('error')
                
            }finally{
                setIsUploading(false)
                setLoading(false)
            }
            
        } else {
            setMsg("File size must be less than 16MB.");
            setAlertType('error')
        }
    };

    const handleFileChangeForBadgeIconUpload = async (e) => {
        let imageType = 'badge_icon'
        
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 16 * 1024 * 1024) { // 16MB limit
            try {
                setIsUploadingBadge(true);
                const uploadResponse = await uploadFile(
                    '/media/upload', // Adjust this endpoint
                    selectedFile,
                    'photo'
                );
                console.log("uploadResponse ==========>>> ", uploadResponse);
                console.log("uploadResponse Id ==========>>> ", uploadResponse.data.id);
                setUploadedBadge(uploadResponse.data)
                setBadgeIconId(uploadResponse.data.id)
                updateCourseAfterImageUpload(uploadResponse.data.id, imageType)
                setMsg("File Uploaded Successfully.");
                setAlertType('success')
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

    const updateCourseAfterImageUpload = async (imageId, imageType) => {
        let courseToUpdate
        if(imageType === 'badge_icon'){
            
            courseToUpdate = {...courseData, course_pathway:courseData.course_pathway.id, badge_icon:imageId, cover_image:coverImageId, intro_video:intro_video}
            console.log("Used For Updating");
            
        }
        if(imageType === 'cover_image'){
            
            courseToUpdate = {...courseData, course_pathway:courseData.course_pathway.id, badge_icon:badgeIconId, cover_image:imageId, intro_video:intro_video}
            console.log("Used For Updating 123");
        }
        try {
            setLoading(true)
            const response = await put(`/courses/${id}/modify/`, courseToUpdate)
            setMsg(response.message);
            setAlertType('success');
            // getModuleInfo()
            console.log(response);
        } catch (error) {
            setMsg(error.message || "An error occurred while updating module.");
            setAlertType('error');
            console.log(error)
        }finally{
            setLoading(false)
        }
        console.log("Image Info", {imageId, imageType});
        
    }

  return (
    <div>
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[95%] py-5 px-4 rounded-[10px]'>
            <div className='flex items-center gap-5'>
                {courseInfo?.cover_image?.media && (
                    <div className='relative w-[200px] h-[200px] border'>
                        <input onChange={handleFileChange} type="file" name="" id="" className='absolute top-[-9px] z-[1] h-[35px] w-[33px] right-[-7px] bg-red-400 opacity-0 cursor-pointer'/>
                        <div className='absolute top-[-10px] right-[-10px] bg-gray-100 p-2 flex items-center justify-center rounded-full cursor-pointer'>
                            <PiCameraLight className='text-[22px]'/>
                        </div>

                        { isUploading ?
                            <div className='flex items-center flex-col justify-center text-[11px] mt-[4rem] gap-2 text-center'>
                                <img src="/assets/loader1.gif" className='w-[30px]' alt="" />
                                <p className='capitalize'>File Upload In Progress, Please Do Not Refresh this page.</p> 
                            </div>
                            :
                            <>
                                {
                                    uploadedFile ?
                                    <img src={uploadedFile.media} className='w-full h-full object-contain' alt="" />
                                    :
                                    <img src={courseInfo.cover_image.media} className='w-full h-full object-cover' alt="" />
                                }
                            </>
                        }
                    </div>
                )}
                {courseInfo?.badge_icon?.media && (
                    <div className='relative w-[200px] h-[200px] border'>
                        <input onChange={handleFileChangeForBadgeIconUpload} type="file" name="" id="" className='absolute top-[-9px] z-[1] h-[35px] w-[33px] right-[-7px] bg-red-400 opacity-0 cursor-pointer'/>
                        <div className='absolute top-[-10px] right-[-10px] bg-gray-100 p-2 flex items-center justify-center rounded-full cursor-pointer'>
                            <PiCameraLight className='text-[22px]'/>
                        </div>

                        { isUploadingBadge ?
                            <div className='flex items-center flex-col justify-center text-[11px] mt-[4rem] gap-2 text-center'>
                                <img src="/assets/loader1.gif" className='w-[30px]' alt="" />
                                <p className='capitalize'>File Upload In Progress, Please Do Not Refresh this page.</p> 
                            </div>
                            :
                            <>
                                {
                                    uploadedBadge ?
                                    <img src={uploadedBadge.media} className='w-full h-full object-contain' alt="" />
                                    :
                                    <img src={courseInfo.badge_icon.media} className='w-full h-full object-cover' alt="" />
                                }
                            </>
                        }
                    </div>
                )}
            </div>
            <div className='mt-10'>
                <p>Course Title.</p>
                <div className='border py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2'>
                    {
                        edit === true ?
                        <input type="text" onChange={handleInputChange} value={courseData?.title} name='title' className='w-full text-[#000] outline-none py-1' />
                        :
                        <p className='text-[#000] py-1'>{courseData?.title}</p>
                    }
                </div>
            </div>
            <div className='flex items-center gap-3 w-full mt-5'>
                <div className='w-full'>
                    <p>Course Amount</p>
                    <input name="amount" value={courseData.amount} onChange={handleInputChange} type="number" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='10,000' />
                </div>
                <div className='w-full relative'>
                    <p>Course Pathway</p>
                    <div onClick={() => setDropDown(dropDown === "pathway" ? "" : "pathway")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {/* <input type="text" value={selectedLevel} className='outline-none text-[#656765]' placeholder='Level 1'/> */}
                        {
                            selectedPathway?
                            <p className='text-[#656765]'>{selectedPathway?.title}</p>
                            :
                            <p className='text-[#656765]'>Select A Pathway</p>
                        }
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'pathway' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2 h-[200px] overflow-y-auto'>
                            {pathwayArray.map(pathway => (
                                <li key={pathway.id} onClick={() => {
                                    // setSelectedLevel(pathway)
                                    setDropDown(null)
                                    setSelectedPathway(pathway)
                                    courseData.course_pathway = pathway
                                }} className='py-[6px] px-2 cursor-pointer hover:bg-slate-200'>{pathway.title}</li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <div className='flex items-center gap-3 w-full mt-5'>
                <div className='w-full relative'>
                    <p>Course Level</p>
                    <div onClick={() => setDropDown(dropDown === "level" ? "" : "level")} className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {
                            edit === true ?
                            <p className='text-[#000] py-1'>Level {selectedLevel}</p>
                            :
                            <p className='text-[#000] py-1'>Level {courseInfo?.level}</p>
                        }
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
                    <div onClick={() => setDropDown(dropDown === "stage" ? "" : "stage")} className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        {
                            edit === true ?
                            <p className='text-[#000] py-1 capitalize'>{selectedStage}</p>
                            :
                            <p className='text-[#000] py-1 capitalize'>{courseInfo?.stage}</p>
                        }
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'stage' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4]'>
                            {stages.map(stage => (
                                <li key={stage.value} onClick={() => {
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
                {
                    edit === true ?
                    <textarea name='description' onChange={handleInputChange} value={courseData?.description} className='text-[#000] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a description...'></textarea>
                    :
                    <p className='text-[#000] border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]'>{courseInfo?.description}</p>
                }
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Intro Video</p>
                <ReactQuill theme="snow" className='react-quill' value={intro_video} onChange={e => setIntroVideo(e)} formats={formats} modules={modules} />
            </div>
            <div className='flex justify-between'>
                <p></p>
                <div className='flex gap-5'>
                    <button onClick={updateCourse} className='border border-[#131314] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#131314] font-[500]'>Edit Course</button>
                    <button onClick={deleteCourse} className='bg-[#F00101] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500]'>Delete Course</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CourseDetails
