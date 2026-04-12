"use client"

import { get } from '../../utils/axiosHelpers'
import { trimText } from '../../utils/trimText'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import CardLoader from '../../components/cardLoader/CardLoader'

const Pathway = () => {

    const { path } = useParams()
    const router = useRouter()

    const [pathwayCourseArray, setPathwayCourseArray] = useState()
    const [pathwayInfo, setPathwayInfo] = useState()
    const [loading, setLoading] = useState(false)

    async function getPathwayCourses(){
        try {
            setLoading(true)
            const response = await get(`/courses/get_all?pathway_id=${path}`)
            console.log(response.data);
            
            setPathwayCourseArray(response.data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    async function getPathwayInfo(){
        try {
            const response = await get(`/course-pathways/${path}`)
            setPathwayInfo(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPathwayCourses()
        getPathwayInfo()
    }, [])

    // const [coinsData, setCoinsData] = useState([])
    // const [loading, setLoading] = useState(false)
    // const [page, setPage] = useState(1)

    // async function getCoinsData(){
    //     setLoading(true)
    //     const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}&sparkline=false`)
    //     console.log(res, res.data);
    //     setCoinsData(prev => [...prev, ...res.data])
    //     setLoading(false)
    // }

    // useEffect(() => {
    //     getCoinsData()
    // },[page])

    // function handleScroll(){
    //     setLoading(true)
    //     if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight){
    //         setPage(prev => prev + 1)
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll)

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll)
    //     }
    // },[])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {
            <div className='flex items-center justify-between'>
                <p className='text-[#131314] text-[24px] font-[700] capitalize'>{pathwayInfo?.title}</p>
                <p className='bg-[#131314] text-white py-2 px-3 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2' onClick={() => router.push(`/pathway/${path}/add-course`)}> <BiPlus /> Add Course</p>
            </div>
        }
        {
            pathwayCourseArray?.length === 0 && 
            <div className='flex justify-center items-center flex-col h-[45vh]'>
              <p className='text-[14px] text-[#131314] capitalize'>No Courses Available for {pathwayInfo?.title} pathway</p>
              <button className='bg-[#131314] text-white py-2 px-4 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2 mt-3' onClick={() => router.push(`/pathway/${path}/add-course`)}>Create A Course</button>
            </div>
        }
        <div className='my-10'>
            {/* <p className='text-[#131314] text-[18px] font-[600] mb-3'>Courses</p> */}
            <div className='grid grid-cols-3 gap-5'>
                {
                    pathwayCourseArray?.map((course, index) => (
                        <div key={index} onClick={() => router.push(`/pathway/${path}/${course.id}`)} className='w-[300px] shadow-lg py-5 px-3 rounded-[30px] cursor-pointer'>
                            <img src={course?.cover_image?.media} alt="" className='h-[150px] w-full object-cover rounded-[20px]' />
                            <p className='text-[#4B4B4E] mb-2 mt-4 font-[700]'>{course?.title}</p>
                            <p className='text-[#636369] mb-1 font-[500]'>Level {course?.level}</p>
                            <p className='text-[#323234] text-[14px]'> {trimText(course?.description, 110)} </p>
                        </div>
                    ))
                }
            </div>
            {
              loading && 
                <div className='flex w-full justify-center items-center flex-col'>
                    <CardLoader />
                </div>
            }
            {/* <div className='grid grid-cols-4 gap-4'>
                {
                    coinsData && coinsData.map((coin, index) => (
                        <div key={index} className='flex flex-col items-center gap-4 text-center mb-1 bg-gray-200 rounded-[5px] py-4'>
                            <img src={coin.image} alt={coin.name} className='w-[40px] h-[40px]' />
                            <div className='text-[#131314]'>
                                <p>{coin.name}</p>
                                <p className='font-[600] mt-1'>${coin.current_price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                loading &&
                <div className='flex justify-center items-center mx-auto w-[200px] h-[200px]'>
                    <BtnLoader />
                </div>
            } */}
        </div>
        
    </div>
  )
}

export default Pathway