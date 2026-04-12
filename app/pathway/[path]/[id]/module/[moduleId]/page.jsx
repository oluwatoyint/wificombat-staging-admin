"use client"

import { get, put, remove, uploadFile } from '../../../../../utils/axiosHelpers'
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../../utils/quillEditorConfig"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import BtnLoader from '../../../../../components/btnLoader/BtnLoader';
import Alert from '../../../../../components/alert/Alert';
import { PiCameraLight } from 'react-icons/pi';


const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const ModuleInfo = () => {

    const { id, path, moduleId } = useParams()
    const router = useRouter()
    const [moduleInfo, setModuleInfo] = useState()
    const [edit, setEdit] = useState(true)
    const [objectives, setObjectives] = useState()
    const [learning_outcome, setLearningOutcome] = useState()
    const [coverPhotoId, setCoverPhotoId] = useState('')
    const [badgeIconId, setBadgeIconId] = useState('');
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedBadge, setUploadedBadge] = useState(null);
    const [isUploadingBadge, setIsUploadingBadge] = useState(false);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [moduleData, setModuleData] = useState({
        title: '',
        order: '',
        description: '',
        cover_image: '',
        badge_icon: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModuleData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getModuleInfo(){
        try {
            const response = await get(`/modules/${moduleId}`)
            console.log(response.data);
            
            setModuleInfo(response.data)
            setModuleData({
                title: response.data.title,
                description: response.data.description,
                cover_image: response.data?.cover_image?.media,
                badge_icon: response.data?.badge_icon?.media,
                order: response.data.order,
            })
            setLearningOutcome(response.data.learning_outcome)
            setObjectives(response.data.objectives)
            setCoverPhotoId(response.data.cover_image.id)
            setBadgeIconId(response.data.badge_icon.id)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateModule(){
        const moduleDataToUpdate = {...moduleData, objectives, learning_outcome, badge_icon:badgeIconId, cover_image:coverPhotoId}
        console.log(moduleDataToUpdate);
        
        try {
            setLoading(true)
            const response = await put(`/modules/${moduleId}/`, moduleDataToUpdate)
            setMsg(response.message);
            setAlertType('success');
            getModuleInfo()
            console.log(response);
        } catch (error) {
            setMsg(error.message || "An error occurred while updating module.");
            setAlertType('error');
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    async function deleteModule(){
        try {
            setLoading(true)
            const response = await remove(`/modules/${moduleId}/`)
            console.log(response);
            router.back()
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getModuleInfo()
    }, [])

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
                setCoverPhotoId(uploadResponse.data.id)
                updateModuleAfterImageUpload(uploadResponse.data.id, imageType)
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
                updateModuleAfterImageUpload(uploadResponse.data.id, imageType)
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

    const updateModuleAfterImageUpload = async (imageId, imageType) => {
        let moduleToUpdate
        if(imageType === 'badge_icon'){
            moduleToUpdate = {...moduleData, objectives, cover_image:coverPhotoId, learning_outcome, badge_icon:imageId}
            console.log("Used For Updating");
            
        }
        if(imageType === 'cover_image'){
            moduleToUpdate = {...moduleData, objectives, cover_image:imageId, learning_outcome, badge_icon:badgeIconId}
            console.log("Used For Updating 123");
        }
        try {
            setLoading(true)
            const response = await put(`/modules/${moduleId}/`, moduleToUpdate)
            setMsg(response.message);
            setAlertType('success');
            getModuleInfo()
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
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='flex items-center justify-between'>
            <p className='text-[#131314] text-[24px] font-[700] capitalize'>{moduleInfo?.title}</p>
            {/* <p className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push('/add-module')}> <BiPlus /> Add {selectedTab}</p> */}
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

                <div className='flex items-center gap-5'>
                    {moduleData.cover_image && (
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
                                        <img src={`${moduleData?.cover_image}`} className='w-[200px] h-[200px] object-cover'  alt="" />
                                    }
                                </>
                            }
                        </div>
                    )}
                    {moduleData?.badge_icon && (
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
                                        <img src={moduleData?.badge_icon} className='w-full h-full object-cover' alt="" />
                                    }
                                </>
                            }
                        </div>
                    )}
                </div>


                {/* {
                    moduleData.cover_image &&
                    <img src={`${moduleData?.cover_image}`} className='w-[200px] h-[200px] object-cover'  alt="" />
                } */}
                <div className='w-full relative mt-5'>
                    <p>Module Title</p>
                    <div className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2'>
                    {
                        edit ?
                        <input type="text" name='title' onChange={handleInputChange} value={moduleData?.title}  className='w-full text-[#656765] outline-none py-1' />
                        :
                        <p className='text-[#656765] py-1'>{moduleInfo?.title}</p>
                    }
                    </div>
                </div>
                <div className='w-full relative mt-5'>
                    <p>Order Number</p>
                    <div className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2'>
                    {
                        edit ?
                        <input type="text" name='order' onChange={handleInputChange} value={moduleData?.order}  className='w-full text-[#656765] outline-none py-1' />
                        :
                        <p className='text-[#656765] py-1'>{moduleInfo?.order}</p>
                    }
                    </div>
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Module Objective</p>
                    {
                        edit ?
                        <div className='mt-1'>
                            <ReactQuill theme="snow" className='react-quill' value={objectives} onChange={e => setObjectives(e)} formats={formats} modules={modules} />
                        </div>
                        :
                        <p dangerouslySetInnerHTML={{ __html: objectives }} className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' />
                    }
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Module Learning Outcome</p>
                    {
                        edit ?
                        <div className='mt-1'>
                            <ReactQuill theme="snow" className='react-quill' value={learning_outcome} onChange={e => setLearningOutcome(e)} formats={formats} modules={modules} />
                        </div>
                        :
                        <p dangerouslySetInnerHTML={{ __html: learning_outcome }} className='text-[#656765] py-1 border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' />
                    }
                </div>
                <div className='mt-5'>
                    <p className='text-[#344054]'>Module Description</p>
                    {
                        edit ?
                        <textarea name='description' onChange={handleInputChange} value={moduleData?.description} className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Module Objectives'></textarea>
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
                        <div className='flex gap-5'>
                            <button onClick={updateModule} className='border border-[#131314] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#131314] font-[500]'>Save Changes</button>
                            <button onClick={deleteModule} className='bg-[#F00101] mt-5 w-[150px] py-[6px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500]'>Delete Module</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default ModuleInfo