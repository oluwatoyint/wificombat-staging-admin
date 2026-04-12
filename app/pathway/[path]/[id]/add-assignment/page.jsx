"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post } from '../../../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import Alert from '../../../../components/alert/Alert';
import BtnLoader from '../../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AddAssignment = () => {

    const { id } = useParams()
    const router = useRouter()
    const [dropDown, setDropDown] = useState('')

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [grading_description, setGradingDescription] = useState();
    const [description, setDescription] = useState();
    const [modul, setModule] = useState();
    const [allModules, setModules] = useState()
    const [assignmentData, setAssignmentData] = useState({
        title: '',
        description: '',
        cover_image: '',
        grading_description: '',
        module: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getModules(){
        try {
            const response = await get(`/modules/get_all?course_id=${id}`)
            console.log(response);
            
            setModules(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getModules()
    }, [])

    async function saveAssignment(){
        const assignmentToUpload = {...assignmentData, grading_description, description}
        console.log(assignmentToUpload);
        try {
            setLoading(true)
            const response = await post('/assignments/', assignmentToUpload);
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            setAssignmentData({
                title: '',
                description: '',
                cover_image: '',
                module: ''
            });
            setGradingDescription("")
            router.back()
        } catch (error) {
            setMsg("An error occurred while creating assignment.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    // async function getCourseInfo(){
    //     try {
    //         const response = await get(`/courses/${id}/get_by_id/`)
    //         setCourseInfo(response.data)
    //         moduleData.course = response.data.id
    //         console.log(response.data);
            
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const mango = just monkey blast collect brand enable sorry problem shoot april print perfect



  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Assignment Details</p>
            <div className='mt-10'>
                <div className='flex items-center gap-3 w-full mt-5'>
                    <div className='w-full relative'>
                        <p>Select Module</p>
                        <div onClick={() => setDropDown(dropDown === "selectModule" ? "" : "selectModule")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>{modul?.title}</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                        {
                            dropDown === 'selectModule' &&
                            <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                {allModules?.map((mdl, index) => (
                                    <li key={index} onClick={() => {
                                        setModule(mdl)
                                        assignmentData.module = mdl.id
                                        setDropDown(null)
                                    }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{mdl.title}</li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <p>Assignment Title</p>
                <input value={assignmentData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Grading description</p>
                <ReactQuill theme="snow" className='react-quill' value={grading_description} onChange={e => setGradingDescription(e)} formats={formats} modules={modules} />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Assignment Description</p>
                <ReactQuill theme="snow" className='react-quill' value={description} onChange={e => setDescription(e)} formats={formats} modules={modules} />
                {/* <textarea value={assignmentData.description} onChange={handleInputChange} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter assignment description'></textarea> */}
            </div>
            {
                loading ?
                    <div className='bg-[#B1B1B4] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                        <BtnLoader />
                    </div>
                    :
                    <button onClick={saveAssignment} className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'>Save Assignment</button>
            }
        </div>
    </div>
  )
}

export default AddAssignment