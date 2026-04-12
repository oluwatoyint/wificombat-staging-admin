"use client"

import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { formats, modules } from "../utils/quillEditorConfig"

import dynamic from 'next/dynamic'
import { get, post } from '../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation';
import BtnLoader from '../components/btnLoader/BtnLoader';
import Alert from '../components/alert/Alert';
import { IoCloseOutline } from 'react-icons/io5';

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});

const CreateDiscount = () => {

    const { id } = useParams()
    const router = useRouter()
    const [dropDown, setDropDown] = useState('')

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [grading_description, setGradingDescription] = useState();
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedCoursesIds, setSelectedCoursesIds] = useState([]);
    const [allCourses, setCourses] = useState([])
    const [discountData, setDiscountData] = useState({
        courses: [],
        is_active: true,
        max_uses: 0,
        percentage_off: '',
        code: '',
        start_date: '',
        expiration_date: ''
    });

    const percentArray = ['25', '50', '75', '100']
    const usageArray = [25, 50, 75, 100, 150, 200]

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDiscountData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDiscountData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function getCourses(){
        try {
            const response = await get(`/courses/get_all/`)
            console.log(response);
            
            setCourses(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCourses()
    }, [])

    const selectCourse = (course) => {
        // Check if the course is already selected
        if (!selectedCoursesIds.includes(course.id)) {
            // Add the course to the selected courses array
            setSelectedCourses([...selectedCourses, course]);
            
            // Add the course ID to the selectedCoursesIds array
            const newSelectedIds = [...selectedCoursesIds, course.id];
            setSelectedCoursesIds(newSelectedIds);
            
            // Update the discountData with the new array of course IDs
            setDiscountData(prev => ({
                ...prev,
                courses: newSelectedIds
            }));
        }
        
        // Close the dropdown
        setDropDown(null);
    };

    const removeCourse = (courseId) => {
        // Remove the course from selectedCourses
        const updatedCourses = selectedCourses.filter(course => course.id !== courseId);
        setSelectedCourses(updatedCourses);
        
        // Remove the course ID from selectedCoursesIds
        const updatedIds = selectedCoursesIds.filter(id => id !== courseId);
        setSelectedCoursesIds(updatedIds);
        
        // Update the discountData
        setDiscountData(prev => ({
            ...prev,
            courses: updatedIds
        }));
    };

    async function saveDiscount(){
        console.log(discountData);
        
        try {
            setLoading(true)
            const response = await post('/administration/discount-codes/', discountData);
            console.log(response);
            setMsg(response.message || "Discount created successfully");
            setAlertType('success');
            
            // Reset form after successful submission
            setDiscountData({
                courses: [],
                is_active: true,
                max_uses: '',
                percentage_off: '',
                code: '',
                start_date: '',
                expiration_date: ''
            });
            setSelectedCourses([]);
            setSelectedCoursesIds([]);
            
            router.back()
        } catch (error) {
            setMsg("An error occurred while creating discount.");
            setAlertType('error');
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className='w-[800px] py-5 px-4 border border-[#E5E5E6] rounded-[10px]'>
            <p className='text-[18px] text-[#131314] font-[500]'>Discount Details</p>
            <div className='mt-10'>
                <div className='flex flex-col gap-3 w-full mt-5'>
                    <div className='w-full relative'>
                        <p>Select Course(s)</p>
                        <div onClick={() => setDropDown(dropDown === "selectCourse" ? "" : "selectCourse")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>Select course(s)</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                        {
                            dropDown === 'selectCourse' &&
                            <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2 h-[200px] overflow-y-scroll'>
                                {allCourses?.map((course, index) => (
                                    <li key={index} onClick={() => selectCourse(course)} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{course.title}</li>
                                ))}
                            </ul>
                        }
                    </div>
                    
                    {/* Display selected courses */}
                    {selectedCourses.length > 0 && (
                        <div className='mt-2'>
                            <p className='mb-2'>Selected Course(s):</p>
                            <div className='flex flex-wrap gap-2'>
                                {selectedCourses.map((course) => (
                                    <div key={course.id} className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                                        <span className='mr-2'>{course.title}</span>
                                        <IoCloseOutline 
                                            className='cursor-pointer text-gray-600 hover:text-red-500' 
                                            onClick={() => removeCourse(course.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='mt-5'>
                <div className='w-full relative'>
                    <p>Percentage Off</p>
                    <div onClick={() => setDropDown(dropDown === "percent" ? "" : "percent")} className='border flex items-center justify-between py-3 mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                        <p className='text-[#656765]'>{discountData.percentage_off ? `${discountData.percentage_off}% off` : 'Select percentage'}</p>
                        <BiChevronDown className='text-[22px]' />
                    </div>
                    {
                        dropDown === 'percent' &&
                        <ul className='absolute z-10 top-[80px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                            {percentArray?.map((percent, index) => (
                                <li key={index} onClick={() => {
                                    setDiscountData(prev => ({
                                        ...prev,
                                        percentage_off: percent
                                    }));
                                    setDropDown(null);
                                }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>{percent}% off</li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <div className='mt-5'>
                <div className='w-full relative'>
                    <p>Max Usage</p>
                    <input 
                        type="text" 
                        name="max_uses"
                        value={discountData.max_uses}
                        onChange={handleInputChange}
                        className='border w-full py-[10px] px-2 border-[#B1B1B4] rounded-[8px]'
                    />
                </div>
            </div>
            <div className="mt-5 flex items-center gap-5">
                <div className='w-full'>
                    <p>Start Date</p>
                    <input 
                        type="date" 
                        name="start_date"
                        value={discountData.start_date}
                        onChange={handleDateChange}
                        className='border w-full py-2 px-2 border-[#B1B1B4] rounded-[8px]'
                    />
                </div>
                <div className='w-full'>
                    <p>Expiration Date</p>
                    <input 
                        type="date" 
                        name="expiration_date"
                        value={discountData.expiration_date}
                        onChange={handleDateChange}
                        className='border w-full py-2 px-2 border-[#B1B1B4] rounded-[8px]'
                    />
                </div>
            </div>
            <div className='mt-5'>
                <p>Code Name</p>
                <input 
                    value={discountData.code} 
                    name='code'
                    onChange={handleInputChange} 
                    type="text" 
                    className='py-3 mt-1 border border-[#B1B1B4] outline-none rounded-[8px] w-full text-[#656765] px-2' 
                    placeholder='e.g. SUMMER25' 
                />
            </div>
            {
                loading ?
                    <div className='bg-[#131314] flex items-center justify-center mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto'>
                        <BtnLoader />
                    </div>
                    :
                    <button 
                        onClick={saveDiscount} 
                        className={`mt-5 w-[150px] py-[13px] rounded-[10px] ml-auto block text-[#E5E5E6] font-[500] ${(!discountData.code || !discountData.percentage_off || !discountData.max_uses || selectedCoursesIds.length === 0) ? 'bg-[#B1B1B4]' : 'bg-[#131314] hover:bg-[#000000]'}`}
                        disabled={!discountData.code || !discountData.percentage_off || !discountData.max_uses || selectedCoursesIds.length === 0}
                    >
                        Save Discount
                    </button>
            }
        </div>
    </div>
  )
}

export default CreateDiscount