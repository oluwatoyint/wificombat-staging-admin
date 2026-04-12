"use client"

import React, { useEffect, useState } from 'react'
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post, put, remove, uploadFile } from '../../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import Alert from '../../../components/alert/Alert';
import BtnLoader from '../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});



const EditLibrary = () => {

    const { id, libraryInfo } = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [library_type, setLibraryType] = useState();
    const [video_embed, setVideoEmbed] = useState();
    const [libraryData, setLibraryData] = useState({
        title: '',
        description: '',
        media: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLibraryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                libraryData.media = uploadResponse.data.id
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

    async function updateLibrary(){
        const libraryToUpload = {...libraryData, media: uploadedFile.id, video_embed}
        console.log(libraryToUpload);
        try {
            setLoading(true)
            const response = await put(`/library/${libraryInfo}/`, libraryToUpload);
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            setLibraryData({
                title: '',
                media: '',
            });
            router.back()
        } catch (error) {
            setMsg("An error occurred while creating library.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    async function deleteLibrary(){
        try {
            setLoading(true)
            await remove(`/library/${libraryInfo}/`);
            console.log('Library deleted successfully.');
            setMsg('Library deleted successfully.');
            setAlertType('success');
            router.back()
        } catch (error) {
            setMsg("An error occurred while deleting library.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    async function getLibraryInfo(){
        try {
            setLoading(true)
            const response = await get(`/library/${libraryInfo}/`);
            // setAllPathways(response.data)
            setLibraryData({
                title: response.data.title,
                description: response.data.description,
                media: response.data.media.id
            })
            setVideoEmbed(response.data.video_embed)
            setUploadedFile(response.data.media)
            setLibraryType(response.data.library_type)
            console.log(response);
        } catch (error) {
            if(error.code === "ERR_NETWORK"){
                setAlertType('error')
                setMsg('Network Error')
            }
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getLibraryInfo()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <div className='flex items-center justify-between'>
                <p className='text-[18px] text-[#131314] font-[500]'>Video or Slide Details</p>
                {/* <div className='flex items-center gap-3 mt-5'>
                    <div className='w-full relative'>
                        <p>Select Library Type</p>
                        <div onClick={() => setDropDown(dropDown === "selectLibraryType" ? "" : "selectLibraryType")} className='border flex items-center justify-between py-2 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>{library_type?.title}</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                        {
                            dropDown === 'selectLibraryType' &&
                            <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                {libraryType?.map((type, index) => (
                                    <li key={index} onClick={() => {
                                        setLibraryType(type)
                                        setDropDown(null)
                                    }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{type.title}</li>
                                ))}
                            </ul>
                        }
                    </div>
                </div> */}
            </div>

            {
                library_type === 'slide' &&
                <div>
                    <div className='mt-5'>
                        <p>Slide Title</p>
                        <input value={libraryData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
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
                                        <p className='text-[#131314] font-[700] my-1'>Upload Slide</p>
                                        <p className='text-[#636369]'>Or click to browse (16 MB)</p>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            }

            {
                library_type === 'video' &&
                <div>
                    <div className='mt-5'>
                        <p>Video Title</p>
                        <input value={libraryData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Video Emmbed</p>
                        <ReactQuill theme="snow" className='react-quill' value={video_embed} onChange={e => setVideoEmbed(e)} formats={formats} modules={modules} />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Video Transcript</p>
                        <textarea value={libraryData.description} onChange={handleInputChange} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter description'></textarea>
                    </div>
                </div>
            }


            {
                loading ?
                    <div className='bg-[#B1B1B4] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                        <BtnLoader />
                    </div>
                    :
                    <div className='flex items-center justify-end gap-3'>
                        <button onClick={updateLibrary} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Update Library</button>
                        <button onClick={deleteLibrary} className='bg-[#FF0012] mt-5 w-[150px] py-[13px] rounded-[10px] block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Delete Library</button>
                    </div>
            }
        </div>
    </div>
  )
}

export default EditLibrary