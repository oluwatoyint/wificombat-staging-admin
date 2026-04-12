"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../../../../../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post, put, remove, uploadFile } from '../../../../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import Alert from '../../../../../components/alert/Alert';
import BtnLoader from '../../../../../components/btnLoader/BtnLoader';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const AssignmentInfo = () => {

    const { id, assignmentId } = useParams()
    const [dropDown, setDropDown] = useState('')

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [grading_description, setGradingDescription] = useState();
    const [description, setDescription] = useState();
    const [modul, setModule] = useState();
    const [allModules, setModules] = useState()
    const router = useRouter()
    const [assignmentData, setAssignmentData] = useState({
        title: '',
        description: '',
        module: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getModuleInfo(){
        try {
            const response = await get(`/modules/get_all?course_id=${id}`)
            console.log(response);
            
            setModules(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getAssignmentInfo(){
        try {
            const response = await get(`/assignments/${assignmentId}`)
            console.log(response);
            setAssignmentData({
                title: response.data.title,
                description: response.data.description,
                module: response.data.module.id
            })
            setGradingDescription(response.data.grading_description)
            setDescription(response.data.description)
            setModule(response.data.module)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateAssignment(){
        const assignmentToUpdate = {...assignmentData, grading_description, description}
        console.log(assignmentToUpdate);
        try {
            setLoading(true)
            const response = await put(`/assignments/${assignmentId}/`, assignmentToUpdate);
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
        } catch (error) {
            setMsg("An error occurred while updating assignment.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    async function deleteAssignment(){
        try {
            setLoading(true)
            const response = await remove(`/assignments/${assignmentId}/`);
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            router.back()
        } catch (error) {
            setMsg("An error occurred while deleting assignment.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getAssignmentInfo()
        getModuleInfo()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[90%] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Assignment Details</p>
            <div className='flex items-center gap-5 mt-10'>
                <div className='w-full'>
                    <div className='flex items-center gap-3 w-full'>
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
                <div className='w-full'>
                    <p>Assignment Title</p>
                    <input value={assignmentData.title} name='title' onChange={handleInputChange} type="text" className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' placeholder='Coding Fundamental 1' />
                </div>
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Assignment Description</p>
                {/* <textarea value={assignmentData.description} onChange={handleInputChange} name='description' className='text-[#667085] outline-none border w-full border-[#D0D5DD] rounded-[8px] p-2 mt-1 resize-none h-[150px]' placeholder='Enter assignment description'></textarea> */}
                <ReactQuill theme="snow" className='react-quill' value={description} onChange={e => setDescription(e)} formats={formats} modules={modules} />
            </div>
            <div className='mt-5'>
                <p className='text-[#344054]'>Grading description</p>
                <ReactQuill theme="snow" className='react-quill' value={grading_description} onChange={e => setGradingDescription(e)} formats={formats} modules={modules} />
            </div>
            <div className='flex justify-between'>
                <p></p>
                {
                    loading ?
                    <BtnLoader />
                    :
                    <div className='flex justify-between'>
                        <p></p>
                        <div className='flex gap-5 text-[14px]'>
                            <button onClick={updateAssignment} className='border border-[#131314] mt-5 w-[150px] p-[6px] rounded-[10px] ml-auto block text-[#131314] font-[500]'>Update Assignment</button>
                            <button onClick={deleteAssignment} className='bg-[#F00101] mt-5 w-[150px] p-[6px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500]'>Delete Assignment</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default AssignmentInfo