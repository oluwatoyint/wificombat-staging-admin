"use client"

import Alert from '../../../../../components/alert/Alert'
import { get, put } from '../../../../../utils/axiosHelpers'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UpdateQuesstion = () => {
    const router = useRouter()
    const { age, questionType, questionId } = useParams()
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('')
    const [isLoading, setIsLoading] = useState(true);

    // Updated structure for questions and options
    const [questions, setQuestions] = useState([]);
      
    const categories = [
        { id: 'coding', label: 'Coding', opt_label: 'a', value: 1 },
        { id: 'gaming', label: 'Gaming', opt_label: 'b', value: 2 },
        { id: 'multi_media', label: 'Multimedia', opt_label: 'c', value: 3 },
        { id: 'robotics', label: 'Robotics and IOT', opt_label: 'd', value: 4 },
        { id: 'ai', label: 'AI', opt_label: 'e', value: 5 }
    ];
    
    const updateQuestion = (id, value) => {
        setQuestions(questions.map(q => 
            q.id === id ? { ...q, qus: value } : q
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
    
    async function getCareerInterestQuestion(){
        try {
            setIsLoading(true);
            const response = await get(`/assessement/determine-career-interest/${questionId}`);
            console.log(response);
            
            // Format the fetched data to match your component's expected structure
            if (response.success && response.data) {
                const questionData = response.data;
                
                // Transform the data to match your component's state structure
                const formattedQuestion = {
                    id: 1, // Use a local ID for the component
                    originalId: questionData.id, // Store the original ID from the API
                    qus_type: questionData.question_type || "determine_interest",
                    age_grp: questionData.age_grp,
                    qus: questionData.qus,
                    options: questionData.options
                };
                
                setQuestions([formattedQuestion]);
            }
        } catch (error) {
            console.log(error);
            setMsg("Failed to load question data");
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCareerInterestQuestion();
    }, [questionId]);

    const updateCareerInterestQuestion = async () => {
        if (questions.length === 0) {
            setMsg("No question data to update");
            setAlertType('error');
            return;
        }
        
        try {
            setLoading(true);
            
            // Get the question with the original ID
            const questionToUpdate = questions[0];
            
            // Format the question for the API
            const formattedQuestion = {
                id: questionToUpdate.originalId,
                qustion_type: questionToUpdate.qustion_type,
                age_grp: questionToUpdate.age_grp,
                qus: questionToUpdate.qus,
                options: questionToUpdate.options.map(opt => ({
                    opt_pathway: opt.opt_pathway,
                    opt_text: opt.opt_text,
                    opt_label: opt.opt_label,
                    value: opt.value
                }))
            };
            
            // Use the appropriate API endpoint for updating
            const response = await put(`/assessement/determine-career-interest/${questionId}/`, formattedQuestion);
            
            console.log(response);
            setMsg("Question updated successfully");
            setAlertType('success');
            
            // Optionally navigate back after successful update
            // router.back();
        } catch (error) {
            setMsg("An error occurred while updating the question.");
            setAlertType('error');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            <div className='w-[100%] flex items-center justify-between flex-col gap-5'>
                <div className="w-full p-4 bg-white rounded-lg border">
                    <div className='flex items-center justify-between mb-6'>
                        <div className="flex justify-between items-start gap-3 flex-col">
                            {
                                questionType === "determine-interest-level" ?
                                <h1 className="text-lg font-bold">Update Interest Level Question</h1>
                                :
                                <h1 className="text-lg font-bold">Update Career Interest Question</h1>
                            }
                            {/* <h1 className="text-lg font-bold">Update Career Interest Question</h1> */}
                            <div className="text-lg font-medium">Age {age}</div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading question data...</div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-8">No question data found</div>
                    ) : (
                        questions.map((question, index) => (
                            <div key={question.id} className="mb-8 mt-[50px] p-6 border rounded-lg relative">
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
                        ))
                    )}

                    <button 
                        onClick={updateCareerInterestQuestion}
                        disabled={isLoading || questions.length === 0 || loading}
                        className={`px-6 py-2 ${loading ? 'bg-gray-500' : 'bg-black'} text-white rounded-lg w-full`}
                    >
                        {loading ? 'Updating...' : 'Update Question'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateQuesstion