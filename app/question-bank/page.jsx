"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiChevronRight, BiQuestionMark } from 'react-icons/bi'
import { IoNewspaperOutline } from 'react-icons/io5'

const QuestionBank = () => {

    const router = useRouter()

  return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            <div className='w-[100%] flex items-center justify-between flex-col gap-5'>
                <div onClick={() => router.push('/question-bank/select-age')} className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <BiQuestionMark className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Upload Question</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div>
                {/* <div onClick={() => router.push('/question-bank/select-age')} className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <IoNewspaperOutline className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Recommendations</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div> */}
            </div>
        </div>
  )
}

export default QuestionBank