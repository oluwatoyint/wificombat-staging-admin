"use client"

import React, { useState, useEffect } from 'react';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

const CheckboxAndMultipleChoiceText = () => {

    const [selectedTime, setSelectedTime] = useState(null);
    const [dropDown, setDropDown] = useState(null);
  
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
      question: '',
      options: [
          { text_option: '', option_label: 'a' },
          { text_option: '', option_label: 'b' },
          { text_option: '', option_label: 'c' },
          { text_option: '', option_label: 'd' }
      ],
      correct_answer: '',
      type: null,
      timeLimit: null,
    });
  
    // Form validation errors
    const [errors, setErrors] = useState({});
  
    const questionDuration = [
      { value: 15, label: '15 minutes' },
      { value: 30, label: '30 minutes' },
      { value: 45, label: '45 minutes' },
      { value: 60, label: '1 hour' },
      { value: 90, label: '1.5 hours' },
      { value: 120, label: '2 hours' },
    ];
  
    // Validation function
    const validateQuestion = () => {
      const newErrors = {};
  
      // Check question type
      if (!currentQuestion.type) {
        newErrors.type = 'Please select a question type';
      }
  
      // Check question text
      if (!currentQuestion.question.trim()) {
        newErrors.question = 'Question text is required';
      }
  
      // Check options for multiple choice
      if (currentQuestion.type === 'multiple_choice') {
          currentQuestion.options.forEach((option, index) => {
            if (!option.text_option.trim()) {
              newErrors[`option_${option.option_label}`] = `Option ${option.option_label.toUpperCase()} is required`;
            }
          });
  
        // Check correct answer
        if (!currentQuestion.correct_answer.trim()) {
          newErrors.correct_answer = 'Correct answer is required';
        }
      }
  
      // Check time limit
      if (!currentQuestion.timeLimit) {
        newErrors.timeLimit = 'Please select a time limit';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleAddQuestion = () => {
      // Validate the question before adding
      if (validateQuestion()) {
        // Create a copy of the current question to add to the array
        const questionToAdd = { ...currentQuestion };
        
        // Add the question to the array
        setQuizQuestions(prev => [...prev, questionToAdd]);
  
        // Reset the form
        setCurrentQuestion({
          question: '',
          options: [
              { text_option: '', option_label: 'a' },
              { text_option: '', option_label: 'b' },
              { text_option: '', option_label: 'c' },
              { text_option: '', option_label: 'd' }
          ],
          correct_answer: '',
          type: null,
          timeLimit: null,
        });
        setSelectedQuestionType(null);
        setSelectedTime(null);
        setErrors({});
      }
  
      console.log(quizQuestions);
      
    };
  
    const handleInputChange = (field, value) => {
      setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
      // Clear specific error when user starts typing
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    };
  
    const handleOptionChange = (label, value) => {
      const updatedOptions = currentQuestion.options.map(option => 
        option.option_label === label 
          ? { ...option, text_option: value }
          : option
      );
  
      setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
  
      // Clear specific option error
      if (errors[`option_${label}`]) {
        const newErrors = { ...errors };
        delete newErrors[`option_${label}`];
        setErrors(newErrors);
      }
    };

  return (
    <div>
        <div className="w-full mt-3">
          <input
            type="text"
            value={currentQuestion.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            className={`py-3 mt-1 border ${
              errors.question ? 'border-red-500' : 'border-[#B1B1B4]'
            } outline-none rounded-[8px] w-full text-[#656765] px-2`}
            placeholder="Enter Question"
          />
          {errors.question && (
            <p className="text-red-500 text-sm mt-1">{errors.question}</p>
          )}
        </div>

        <div className="my-5">
            <p>Options</p>
            {currentQuestion.options.map((option) => (
            <div key={option.option_label} className="flex items-center gap-6 mb-2">
                <div className="flex items-center gap-3">
                <p className="p-[5px] border rounded-[4px]"></p>
                <p>{option.option_label}</p>
                </div>
                <input
                type="text"
                value={option.text_option}
                onChange={(e) => handleOptionChange(option.option_label, e.target.value)}
                className={`py-2 mt-1 border ${
                    errors[`option_${option.option_label}`] ? 'border-red-500' : 'border-[#B1B1B4]'
                } outline-none rounded-[8px] w-full text-[#656765] px-2`}
                placeholder={`Enter Option ${option.option_label}`}
                />
                {errors[`option_${option.option_label}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`option_${option.option_label}`]}</p>
                )}
            </div>
            ))}
        </div>

        <div className="w-full mt-3">
          <p>Correct Answer</p>
          <input
            type="text"
            value={currentQuestion.correct_answer}
            onChange={(e) => handleInputChange('correct_answer', e.target.value)}
            className={`py-3 mt-1 border ${
              errors.correct_answer ? 'border-red-500' : 'border-[#B1B1B4]'
            } outline-none rounded-[8px] w-full text-[#656765] px-2`}
            placeholder="Correct Answer"
          />
          {errors.correct_answer && (
            <p className="text-red-500 text-sm mt-1">{errors.correct_answer}</p>
          )}
        </div>

        <div className='mt-5'>
          <p>Set Time</p>
          <div 
            className='w-full relative' 
            onClick={() => setDropDown(dropDown === "questionDurationTime" ? "" : "questionDurationTime")}
          >
            <div className='border flex items-center justify-between py-[10px] mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
              <p className='text-[#656765]'>{selectedTime?.label || "Select Duration"}</p>
              <BiChevronDown className='text-[22px]' />
            </div>
            {dropDown === 'questionDurationTime' && (
              <ul className='absolute z-10 top-[60px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                {questionDuration?.map((time, index) => (
                  <li 
                    key={index} 
                    onClick={() => {
                      setSelectedTime(time);
                      handleInputChange('timeLimit', time.value);
                      setDropDown(null);
                    }} 
                    className='py-1 px-2 cursor-pointer hover:bg-slate-200'
                  >
                    {time.label}
                  </li>
                ))}
              </ul>
            )}
            {errors.timeLimit && (
              <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>
            )}
          </div>
        </div>
    </div>
  )
}

export default CheckboxAndMultipleChoiceText
