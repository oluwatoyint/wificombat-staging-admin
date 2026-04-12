"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiPlus, BiTrash } from 'react-icons/bi'
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

const AddFlashCard = () => {

    const { id } = useParams()
    const router = useRouter()
    const [dropDown, setDropDown] = useState('')

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [modul, setModule] = useState();
    const [allModules, setModules] = useState();
    
    // Initialize with one flashcard item
    const [flashcards, setFlashcards] = useState([
        { module: '', question: '', answer: '' }
    ]);

    const handleQuestionChange = (index, value) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index].question = value;
        setFlashcards(updatedFlashcards);
    };

    const handleAnswerChange = (index, value) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index].answer = value;
        setFlashcards(updatedFlashcards);
    };

    const addNewFlashcard = () => {
        // Add a new flashcard with the current module ID if available
        setFlashcards([...flashcards, { 
            module: modul?.id || '', 
            question: '', 
            answer: '' 
        }]);
    };
    
    const removeFlashcard = (index) => {
        if (flashcards.length > 1) {
            const updatedFlashcards = flashcards.filter((_, i) => i !== index);
            setFlashcards(updatedFlashcards);
        }
    };

    // Update module ID for all flashcards when a module is selected
    const updateModuleForAllFlashcards = (moduleId) => {
        const updatedFlashcards = flashcards.map(card => ({
            ...card,
            module: moduleId
        }));
        setFlashcards(updatedFlashcards);
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

    async function saveFlashcard(){
        console.log({"flashcards": flashcards});
        
        try {
            setLoading(true)
            // Send the flashcards array directly
            const response = await post('/flashcards/bulk_create/', {"flashcards": flashcards});
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            // Reset form
            setFlashcards([{ module: '', question: '', answer: '' }]);
            setModule(null);
            router.back()
        } catch (error) {
            setMsg("An error occurred while creating flashcards.");
            setAlertType('error');
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Flashcard Details</p>
            <div className='mt-10'>
                <div className='flex items-center gap-3 w-full mt-5'>
                    <div className='w-full relative'>
                        <p>Select Module</p>
                        <div onClick={() => setDropDown(dropDown === "selectModule" ? "" : "selectModule")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>{modul?.title || 'Select a module'}</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                        {
                            dropDown === 'selectModule' &&
                            <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                {allModules?.map((mdl, index) => (
                                    <li key={index} onClick={() => {
                                        setModule(mdl);
                                        updateModuleForAllFlashcards(mdl.id);
                                        setDropDown(null);
                                    }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{mdl.title}</li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
                <button 
                    onClick={addNewFlashcard} 
                    className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center ml-auto gap-2'
                    disabled={!modul?.id}
                > 
                    <BiPlus /> Add Summary
                </button>
            </div>
            
            {/* Render all flashcard inputs */}
            {flashcards.map((flashcard, index) => (
                <div key={index} className="mt-8 border-t pt-5 border-gray-200">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">Flashcard {index + 1}</p>
                        {flashcards.length > 1 && (
                            <button 
                                onClick={() => removeFlashcard(index)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <BiTrash /> Remove
                            </button>
                        )}
                    </div>
                    <div className='mt-3'>
                        <input 
                            value={flashcard.question} 
                            onChange={(e) => handleQuestionChange(index, e.target.value)} 
                            type="text" 
                            className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' 
                            placeholder='Enter Question' 
                        />
                    </div>
                    <div className='mt-5'>
                        <p className='text-[#344054]'>Answer {index + 1}</p>
                        <ReactQuill 
                            theme="snow" 
                            className='react-quill' 
                            value={flashcard.answer} 
                            onChange={(value) => handleAnswerChange(index, value)} 
                            formats={formats} 
                            modules={modules} 
                            placeholder='Enter answer'
                        />
                    </div>
                </div>
            ))}
            
            {
                loading ?
                    <div className='bg-[#B1B1B4] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                        <BtnLoader />
                    </div>
                    :
                    <button 
                        onClick={saveFlashcard} 
                        className='bg-[#B1B1B4] mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] hover:bg-[#131314]'
                        // disabled={!modul?.id || flashcards.some(fc => !fc.question)}
                    >
                        Save Flashcard
                    </button>
            }
        </div>
    </div>
  )
}

export default AddFlashCard