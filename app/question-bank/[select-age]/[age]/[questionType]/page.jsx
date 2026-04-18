"use client"

import Alert from '../../../../components/alert/Alert'
import axios from 'axios'
import Cookies from 'js-cookie'
import { get, post, remove } from '../../../../utils/axiosHelpers'
// import { post } from '@/app/utils/axiosHelpers'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiChevronRight, BiQuestionMark } from 'react-icons/bi'
import { GoPlus } from 'react-icons/go'
import { IoCloseOutline, IoNewspaperOutline } from 'react-icons/io5'
import { BsPencil } from 'react-icons/bs'
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal'

const Question = () => {
    const router = useRouter()
    const { age, questionType } = useParams()
    const [showQuestionTab, setShowQuestionTab] = useState(false)
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('')
    const [careerInterestQuestions, setCareerInterestQuestions] = useState([])
    const [confirmModal, setConfirmModal] = useState()

    // Updated structure for questions and options
    const [questions, setQuestions] = useState([
        { 
            id: 1,
            question_type: questionType === "determine-career-interest" ? "determine_interest" : "determine_interest_level",
            age_grp: age,
            qus: "",
            correct_answer: "",
            options: [
                { opt_pathway: "coding", opt_text: "", opt_label: "a", value: 1 },
                { opt_pathway: "gaming", opt_text: "", opt_label: "b", value: 2 },
                { opt_pathway: "multi_media", opt_text: "", opt_label: "c", value: 3 },
                { opt_pathway: "robotics", opt_text: "", opt_label: "d", value: 4 },
                { opt_pathway: "ai", opt_text: "", opt_label: "e", value: 5 }
            ]
        }
    ]);
      
    const categories = [
        { id: 'coding', label: 'Coding', opt_label: 'a', value: 1 },
        { id: 'gaming', label: 'Gaming', opt_label: 'b', value: 2 },
        { id: 'multi_media', label: 'Multimedia', opt_label: 'c', value: 3 },
        { id: 'robotics', label: 'Robotics and IOT', opt_label: 'd', value: 4 },
        { id: 'ai', label: 'AI', opt_label: 'e', value: 5 }
    ];
    
    const addQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            question_type: questionType === "determine-career-interest" ? "determine_interest" : "determine_interest_level",
            age_grp: age,
            qus: "",
            correct_answer: "",
            options: categories.map((cat, index) => ({
                opt_pathway: cat.id,
                opt_text: "",
                opt_label: cat.opt_label,
                value: cat.value
            }))
        };
        setQuestions([...questions, newQuestion]);
    };
    
    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };
    
    const updateQuestion = (id, value) => {
        setQuestions(questions.map(q => 
            q.id === id ? { ...q, qus: value } : q
        ));
    };

    const updateAnswer = (id, value) => {
        setQuestions(questions.map(q => 
            q.id === id ? { ...q, correct_answer: value } : q
        ));
    };
    
    const updateOption = (questionId, categoryId, value) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.map(opt => 
                    opt.opt_pathway === categoryId ? { ...opt, opt_text: value } : opt
                );
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };
    
    async function getCareerInterestQuestions(){
        try {
            const response = await get(`/assessement/determine-career-interest/?age_grp=${age}&question_type=determine_interest`)
            console.log(response);

            setCareerInterestQuestions(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getInterestLevelQuestions(){
        try {
            const response = await get(`/assessement/determine-career-interest/?age_grp=${age}&question_type=determine_interest_level`)
            console.log(response);

            setCareerInterestQuestions(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect( ()=> {
        if (questionType === "determine-interest-level") {
            getInterestLevelQuestions()
        } else {
            getCareerInterestQuestions()
        }

        console.log(questionType);
        
    },[])

    const saveQuestions = async () => {
        // Format questions to match the required structure
        const formattedQuestions = questions.map(({ id, ...rest }) => rest);
        console.log('Saving questions:', formattedQuestions);
        try {
            setLoading(true)
            const response = await post('/assessement/determine-career-interest/bulk_create/', formattedQuestions)
            // const response = await fetch('https://wificombat-staging-backend-production.up.railway.app/assessement/determine-career-interest/bulk_create/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(formattedQuestions),
            // });
            console.log(response);
            setMsg(response.message);
            setAlertType('success');
            setShowQuestionTab(false)
            if (questionType === "determine-interest-level") {
                getInterestLevelQuestions()
            } else {
                getCareerInterestQuestions()
            }
            // router.back()
        } catch (error) {
            setMsg("An error occurred while creating assignment.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
        // alert('Questions saved successfully!');
    };

    async function deleteQuestion(id){
        try {
            setLoading(true)
            const response = await remove(`/assessement/determine-career-interest/${id}/`)
            console.log(response);
            if (questionType === "determine-interest-level") {
                getInterestLevelQuestions()
            } else {
                getCareerInterestQuestions()
            }
            setMsg('Question deleted successfully')
            setAlertType('success')
            setConfirmModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            {confirmModal && (
                <ConfirmationModal
                    modalInfo={{
                        title: 'Delete Question?',
                        content: `Are you sure you want to delete this question?`,
                        confirmButtonText: 'Submit',
                        confirmFunction: () => deleteQuestion(confirmModal.id),
                    }}
                    setConfirmModal={setConfirmModal}
                    load={loading}
                />
            )}
            <div className='w-[100%] flex items-center justify-between flex-col gap-5'>
                {
                    careerInterestQuestions?.length > 0 &&
                    <>
                        <div className='flex items-center justify-between w-[100%] gap-2 pb-8'>
                            <div className='flex flex-col justify-start gap-2'>
                                <p className='text-[16px] text-[#131314] font-bold'>
                                    {
                                        questionType === "determine-interest-level" ?
                                        <span className='text-[#131314] text-[16px] font-bold'>Determine Interest Level</span>
                                        :
                                        <span className='text-[#131314] text-[16px] font-bold'>Determine Career Interest</span>
                                    }
                                </p>
                                <p className='text-[14px] text-[#131314]'>Age {age}</p>
                            </div>
                            {
                                showQuestionTab ?
                                <button onClick={() => setShowQuestionTab(false)} className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2 '>View Questions</button>
                                    :
                                <button onClick={() => setShowQuestionTab(true)} className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2 '>Add More Questions</button>
                            }
                        </div>
                        {
                            !showQuestionTab &&
                            <div className='w-[100%]'>
                                {
                                    careerInterestQuestions?.map((question, index) => (
                                        <div key={index} className='flex items-center justify-between w-[100%] gap-2 mb-4  border-b pb-2'>
                                            <p className='text-[16px] text-[#131314]'>{question.qus}</p>
                                            <div className='flex items-center gap-5'>
                                                <BsPencil className='text-[#131314] text-[20px] cursor-pointer' onClick={() => router.push(`/question-bank/select-age/${age}/${questionType}/${question.id}`)} />
                                                <IoCloseOutline onClick={() => setConfirmModal({ id: question.id })} className='text-[#131314] text-[20px] cursor-pointer' />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </>
                }
                {
                    careerInterestQuestions?.length === 0 &&
                        <>
                            {
                                !showQuestionTab &&
                                <div>
                                    <p>No Questions Yet </p>
                                    <button onClick={() => setShowQuestionTab(true)} className='bg-[#131314] text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'>Add Question</button>
                                </div>
                            }
                        </>
                }
                {
                    showQuestionTab &&
                    <div className="w-full p-4 bg-white rounded-lg border">
                        <div className='flex items-center justify-between mb-6'>
                            <div className="flex justify-between items-start gap-3 flex-col">
                                {
                                    questionType === "determine-interest-level" ?
                                    <h1 className="text-lg font-bold">Determine Interest Level</h1>
                                    :
                                    <h1 className="text-lg font-bold">Determine Career Interest</h1>
                                }
                                <div className="text-lg font-medium">Age {age}</div>
                            </div>
                            <button 
                                onClick={addQuestion}
                                className="flex items-center px-4 py-2 bg-black text-white rounded-lg"
                            >
                                <GoPlus />
                                Add Question
                            </button>
                        </div>

                        {questions.map((question, index) => (
                            <div key={question.id} className="mb-8 mt-[50px] p-6 border rounded-lg relative">
                                <button 
                                    onClick={() => removeQuestion(question.id)}
                                    className="absolute text-[20px] top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                                >
                                    <IoCloseOutline />
                                </button>
                            
                                <div className="my-4">
                                    <input
                                    type="text"
                                    placeholder="Enter Question"
                                    value={question.qus}
                                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                {categories.map(category => {
                                    const option = question.options.find(opt => opt.opt_pathway === category.id);
                                    return (
                                        <div key={category.id} className="flex items-center mb-3">
                                            <div className="flex items-center w-36">
                                                <input 
                                                type="radio" 
                                                name={`category-${question.id}`} 
                                                id={`${category.id}-${question.id}`} 
                                                className="w-4 h-4 mr-2"
                                                />
                                                <label htmlFor={`${category.id}-${question.id}`} className="text-sm">
                                                {category.label}
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Option 1"
                                                value={option ? option.opt_text : ""}
                                                onChange={(e) => updateOption(question.id, category.id, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg ml-2"
                                            />
                                        </div>
                                    );
                                })}
                                {
                                    questionType === "determine-interest-level" &&
                                    <div className="my-4">
                                        <label htmlFor="Correct Answer" className='block mb-2'>Correct Answer</label>
                                        <input
                                            type="text"
                                            placeholder="b"
                                            value={question.correct_answer}
                                            onChange={(e) => updateAnswer(question.id, e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                }
                            </div>
                        ))}
                        <button 
                            onClick={saveQuestions}
                            className="px-6 py-2 bg-black text-white rounded-lg w-full"
                        >
                            Save Questions
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Question