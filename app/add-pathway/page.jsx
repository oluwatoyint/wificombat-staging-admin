"use client"

import React, { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { post, uploadFile } from '../utils/axiosHelpers';
import Alert from '../components/alert/Alert';
import BtnLoader from '../components/btnLoader/BtnLoader';
import { useRouter } from 'next/navigation';

const AddPathway = () => {

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [pathwayData, setPathwayData] = useState({
        title: '',
        description: '',
        cover_image: ""
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPathwayData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 16 * 1024 * 1024) { // 16MB limit
            setIsUploading(true);
            const uploadResponse = await uploadFile(
                '/media/upload', // Adjust this endpoint
                selectedFile,
                'photo'
            );

            if(uploadResponse) setIsUploading(false);
            
            if (uploadResponse?.success) {
                setMsg("File Uploaded Successfully.");
                setAlertType('success')
                setUploadedFile(uploadResponse.data)
                pathwayData.cover_image = uploadResponse.data.id
            } else {
                setMsg("Upload failed. Please try again.");
                setAlertType('error')
            }
            console.log(uploadResponse.data);
            
        } else {
            setMsg("File size must be less than 16MB.");
            setAlertType('error')
        }
    };

    async function savePathway(){
        try {
            setLoading(true)
            const response = await post('/course-pathways/', pathwayData);
            console.log(response);
            setMsg("Pathway created successfully.");
            setAlertType('success');
            setPathwayData({
                title: '',
                description: '',
                cover_image: ""
            });
            setUploadedFile(null);
            router.back()
        } catch (error) {
            console.log(error);
            setMsg(error.message || "An error occurred");
            setAlertType('error');
        } finally{
            setLoading(false)
        }
    }

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Pathway Details</p>
            <div className='mt-10'>
                <p>Title</p>
                <input name="title" value={pathwayData.title} onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Pathway Title' />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Description</p>
                <textarea name="description" value={pathwayData.description} onChange={handleInputChange} className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter a description...'></textarea>
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
                                <p className='text-[#131314] font-[700] my-1'>Upload Image</p>
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
                    <button onClick={savePathway} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Pathway</button>
            }
        </div>
    </div>
  )
}

export default AddPathway
