"use client"

import React, { useState } from 'react';
import { BiChevronDown, BiEditAlt, BiPlus } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { useParams } from 'next/navigation';
import { post, uploadFile } from '../../../../../../utils/axiosHelpers';
import Alert from '../../../../../../components/alert/Alert';
import ConfirmationModal from '../../../../../../components/confirmationModal/ConfirmationModal';

const LessonQuiz = () => {
  const { newLessonId } = useParams();
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dropDown, setDropDown] = useState(null);
  const [msg, setMsg] = useState('');
  const [alertType, setAlertType] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUploads, setImageUploads] = useState({
    a: null, b: null, c: null, d: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    a: null, b: null, c: null, d: null
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: null,
    question: '',
    correct_answer: '', 
    options: [
      { text_option: '', option_label: 'a', image_option: null },
      { text_option: '', option_label: 'b', image_option: null },
      { text_option: '', option_label: 'c', image_option: null },
      { text_option: '', option_label: 'd', image_option: null }
    ],
    timeLimit: null,
  });

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'multiple_image', label: 'Multiple Image' },
    { value: 'true_false', label: 'True Or False' },
    { value: 'fill_in_blank', label: 'Fill In Blank' },
    { value: 'check_box', label: 'Check Box' },
    { value: 'short_answer', label: 'Short Answer' },
  ];

  const questionDuration = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

  const handleFileUpload = async (label, file) => {
    if (!file) return;
  
    try {
      const response = await uploadFile(
        '/media/upload', // Adjust this endpoint
        file,
        'photo'
      );
  
      console.log(response);
      
      // Update imageUploads state
      setImageUploads(prev => ({
        ...prev,
        [label]: response.fileId
      }));
  
      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [label]: reader.result
        }));
  
        // Update the currentQuestion options with fileId and preview
        const updatedOptions = currentQuestion.options.map(option =>
          option.option_label === label 
            ? { 
                ...option, 
                text_option: response.fileId, // Store the fileId here
                image_option: reader.result // Store the preview here
              }
            : option
        );
        
        setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setMsg('File upload failed');
      setAlertType('error');
    }
  };

  const validateQuestion = () => {
    const newErrors = {};

    if (!currentQuestion.type) {
      newErrors.type = 'Please select a question type';
    }

    if (!currentQuestion.question.trim()) {
      newErrors.question = 'Question text is required';
    }

    if (!currentQuestion.timeLimit) {
      newErrors.timeLimit = 'Please select a time limit';
    }

    switch (currentQuestion.type) {
      case 'multiple_choice':
      case 'check_box':
        currentQuestion.options.forEach((option) => {
          if (!option.text_option.trim()) {
            newErrors[`option_${option.option_label}`] = `Option ${option.option_label.toUpperCase()} is required`;
          }
        });
        if (!currentQuestion.correct_answer.trim()) {
          newErrors.correct_answer = 'Correct answer is required';
        }
        break;

      case 'multiple_image':
        currentQuestion.options.forEach((option) => {
          if (!option.text_option) {
            newErrors[`option_${option.option_label}`] = `Image for Option ${option.option_label.toUpperCase()} is required`;
          }
        });
        if (!currentQuestion.correct_answer.trim()) {
          newErrors.correct_answer = 'Correct answer is required';
        }
        break;

      case 'fill_in_blank':
      case 'short_answer':
        if (!currentQuestion.correct_answer.trim()) {
          newErrors.correct_answer = 'Answer is required';
        }
        break;

      case 'true_false':
        if (!currentQuestion.correct_answer.trim()) {
          newErrors.correct_answer = 'Please select True or False';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    console.log(quizQuestions);
    
    if (validateQuestion()) {
      const questionToAdd = { 
        ...currentQuestion, 
        lesson: newLessonId 
      };
      setQuizQuestions(prev => [...prev, questionToAdd]);
      resetForm();
    }
  };

  const handleUpdateQuestion = () => {
    if (validateQuestion()) {
      const updatedQuestions = quizQuestions.map((question, index) => 
        index === editIndex ? currentQuestion : question
      );
      setQuizQuestions(updatedQuestions);
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentQuestion({
      type: null,
      question: '',
      options: [
        { text_option: '', option_label: 'a', image_option: null },
        { text_option: '', option_label: 'b', image_option: null },
        { text_option: '', option_label: 'c', image_option: null },
        { text_option: '', option_label: 'd', image_option: null }
      ],
      correct_answer: '',
    });
    setSelectedQuestionType(null);
    setSelectedTime(null);
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
    setImageUploads({ a: null, b: null, c: null, d: null });
    setImagePreviews({ a: null, b: null, c: null, d: null });
  };

  const handleInputChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
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
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = quizQuestions[index];
    setCurrentQuestion(questionToEdit);
    setSelectedQuestionType({ value: questionToEdit.type, label: questionToEdit.type });
    setSelectedTime(questionToEdit.timeLimit);
    setIsEditing(true);
    setEditIndex(index);

    if (questionToEdit.type === 'multiple_image') {
      const previews = {};
      const uploads = {};
      questionToEdit.options.forEach(option => {
        if (option.image_option) {
          previews[option.option_label] = option.image_option;
          uploads[option.option_label] = option.text_option;
        }
      });
      setImagePreviews(previews);
      setImageUploads(uploads);
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuizQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const submitLessonQuiz = async () => {
    try {
      setLoad(true);
      const response = await post('/lesson-quizzes/bulk_create/', { quizzes: quizQuestions });
      setMsg(response.message);
      setQuizQuestions([]);
      setAlertType('success');
      setConfirmModal(null);
    } catch (error) {
      console.error(error);
      setMsg("An error occurred");
      setAlertType('error');
    } finally {
      setLoad(false);
    }
  };

  const renderQuestionForm = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
      // case 'multiple_image':
      case 'check_box':
        return (
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
              </div>
            ))}
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
          </div>
        );

        case 'multiple_image':
          return (
            <div className="my-5">
              <p>Image Options</p>
              {currentQuestion.options.map((option) => (
                <div key={option.option_label} className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-3">
                    <p className="p-[5px] border rounded-[4px]"></p>
                    <p>{option.option_label.toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(option.option_label, e.target.files[0])}
                      className={`py-2 mt-1 border ${
                        errors[`option_${option.option_label}`] ? 'border-red-500' : 'border-[#B1B1B4]'
                      } outline-none rounded-[8px] w-full text-[#656765] px-2`}
                    />
                    {imagePreviews[option.option_label] && (
                      <img 
                        src={imagePreviews[option.option_label]} 
                        alt={`Option ${option.option_label}`} 
                        className="mt-2 max-w-[200px] max-h-[200px] object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="w-full mt-3">
                <p>Correct Answer</p>
                <input
                  type="text"
                  value={currentQuestion.correct_answer}
                  onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                  className={`py-3 mt-1 border ${
                    errors.correct_answer ? 'border-red-500' : 'border-[#B1B1B4]'
                  } outline-none rounded-[8px] w-full text-[#656765] px-2`}
                  placeholder="Enter Correct Answer (Option Label)"
                />
              </div>
            </div>
          );

      case 'fill_in_blank':
        return (
          <div className="w-full mt-3">
            <p>Correct Answer</p>
            <input
              type="text"
              value={currentQuestion.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              className={`py-3 mt-1 border ${
                errors.correct_answer ? 'border-red-500' : 'border-[#B1B1B4]'
              } outline-none rounded-[8px] w-full text-[#656765] px-2`}
              placeholder="Enter Answer"
            />
            {errors.correct_answer && (
              <p className="text-red-500 text-sm mt-1">{errors.correct_answer}</p>
            )}
          </div>
        );

      case 'true_false':
        return (
          <div className="w-full mt-3">
            <p>Correct Answer</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleInputChange('correct_answer', 'True')}
                className={`px-4 py-2 rounded-[4px] ${
                  currentQuestion.correct_answer === 'True'
                    ? 'bg-[#131314] text-white'
                    : 'border border-[#B1B1B4]'
                }`}
              >
                True
              </button>
              <button
                onClick={() => handleInputChange('correct_answer', 'False')}
                className={`px-4 py-2 rounded-[4px] ${
                  currentQuestion.correct_answer === 'False'
                    ? 'bg-[#131314] text-white'
                    : 'border border-[#B1B1B4]'
                }`}
              >
                False
              </button>
            </div>
            {errors.correct_answer && (
              <p className="text-red-500 text-sm mt-1">{errors.correct_answer}</p>
            )}
          </div>
        );

      case 'short_answer':
        return (
          <div className="w-full mt-3">
            <p>Correct Answer</p>
            <input
              type="text"
              value={currentQuestion.correct_answer}
              onChange={(e) => handleInputChange('correct_answer', e.target.value)}
              className={`py-3 mt-1 border ${
                errors.correct_answer ? 'border-red-500' : 'border-[#B1B1B4]'
              } outline-none rounded-[8px] w-full text-[#656765] px-2`}
              placeholder="Enter Short Answer"
            />
            {errors.correct_answer && (
              <p className="text-red-500 text-sm mt-1">{errors.correct_answer}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            {confirmModal && (
              <ConfirmationModal
                  modalInfo={{
                      title: 'Submit Quiz?',
                      content: `You've created ${quizQuestions?.length} quiz questions. Submit now to save your quiz, or click 'Cancel' to add more questions.`,
                      confirmButtonText: 'Submit',
                      confirmFunction: submitLessonQuiz,
                  }}
                  setConfirmModal={setConfirmModal}
                  load={load}
              />
            )}
            <p className="text-[18px] text-[#131314] font-[500]">Lesson Quiz</p>
            <div className="flex items-center justify-between mt-5">
              <p className="text-[22px] text-[#131314] font-[500]">Quiz Questions</p>
            </div>

            {quizQuestions.map((question, index) => (
                <div key={index} className="my-5 border-b pb-4 flex justify-between items-start">
                  <div>
                      <p>{`Question ${index + 1} : ${question.question}`}</p>
                      {question.type === 'multiple_choice' && (
                        <div className="mt-2">
                            {question.options.map((option) => (
                            <p key={option.option_label}>{`${option.option_label.toUpperCase()}: ${option.text_option}`}</p>
                            ))}
                        </div>
                      )}
                      {question.type === 'multiple_image' && (
                      <div className="mt-2">
                          {question.options.map((option) => (
                          <div key={option.option_label} className="flex items-center">
                              <img src={option.text_option} alt={option.option_label} className="w-16 h-16 mr-2" />
                              {/* <p>{`${option.option_label.toUpperCase()}: ${option.text_option}`}</p> */}
                          </div>
                          ))}
                      </div>
                      )}
                      {question.type === 'check_box' && (
                        <div className="mt-2">
                            {question.options.map((option) => (
                            <div key={option.option_label} className="flex items-center">
                                <input type="checkbox" id={option.option_label} />
                                <label htmlFor={option.option_label} className="ml-2">{`${option.option_label.toUpperCase()}: ${option.text_option}`}</label>
                            </div>
                            ))}
                        </div>
                      )}
                      {/* {question.type === 'fill_in_blank' && (
                      <p className="mt-2">Correct Answer: {question.correct_answer}</p>
                      )}
                      {question.type === 'true_false' && (
                      <p className="mt-2">Correct Answer: {question.correct_answer}</p>
                      )}
                      {question.type === 'short_answer' && (
                      <p className="mt-2">Correct Answer: {question.correct_answer}</p>
                      )} */}
                      <p className="mt-5">Correct Answer: {question.correct_answer}</p>
                      <p className="mt-1">Duration: {question.timeLimit} minutes</p>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => handleEditQuestion(index)} className="text-black text-[22px] border border-[#B1B1B4] rounded-[5px] p-1">
                        <BiEditAlt />
                      </button>
                      <button onClick={() => handleDeleteQuestion(index)} className="text-black text-[22px] border border-[#B1B1B4] rounded-[5px] p-1">
                        <IoCloseOutline />
                      </button>
                  </div>
                </div>
            ))}

            <div>
                <div className="flex items-center justify-between mt-5">
                  <div
                      className="w-[200px] relative"
                      onClick={() => setDropDown(dropDown === 'questionType' ? '' : 'questionType')}
                  >
                      <div className="border flex items-center justify-between py-[10px] mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer">
                        <p className="text-[#656765]">{selectedQuestionType?.label || "Select Question Type"}</p>
                        <BiChevronDown className="text-[22px]" />
                      </div>
                      {dropDown === 'questionType' && (
                      <ul className="absolute z-10 top-[60px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2">
                          {questionTypes.map((type, index) => (
                          <li
                              key={index}
                              onClick={() => {
                              setSelectedQuestionType(type);
                              handleInputChange('type', type.value);
                              setDropDown(null);
                              }}
                              className="py-1 px-2 cursor-pointer hover:bg-slate-200"
                          >
                              {type.label}
                          </li>
                          ))}
                      </ul>
                      )}
                      {errors.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                      )}
                  </div>
                  <button
                      onClick={handleAddQuestion}
                      className="bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2"
                  >
                      <BiPlus /> Add Question
                  </button>
                </div>

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

                {renderQuestionForm()}

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
                      <ul className='absolute z-10 top-[50px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
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

                {isEditing && ( // Show update button only when editing
                <button onClick={handleUpdateQuestion} className="bg-[#131314] text-white px-4 py-2 rounded mt-4">
                    Update Question
                </button>
                )}
            </div>
            <div className='flex items-center justify-between mt-5 border-t'>
                {/* <button className='border px-3 py-1 rounded-[5px]' onClick={() => setCurrentTab('add-lesson')}>Previous</button> */}
                <p>Page 2 of 2</p>
                <button disabled={!quizQuestions?.length} className={`${quizQuestions?.length === 0 && 'bg-[#B1B1B4] cursor-not-allowed'} mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] ${quizQuestions?.length > 0 && 'bg-[#131314]'} cursor-pointer`} onClick={() => setConfirmModal(true)}>Submit</button>
            </div>
        </div>
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
    </div>
  );
};

export default LessonQuiz;