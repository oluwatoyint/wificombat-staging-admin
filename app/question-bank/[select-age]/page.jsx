"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { BiChevronRight, BiUser } from 'react-icons/bi'

const SelectAge = () => {

    const router = useRouter()

  return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            <div className='w-[100%] flex items-center justify-between flex-col gap-5'>
                <div onClick={() => router.push('/question-bank/select-age/5-7')}  className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <BiUser className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Age 5 - 7</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div>
                <div onClick={() => router.push('/question-bank/select-age/8-10')} className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <BiUser className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Age 8 - 10</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div>
                <div onClick={() => router.push('/question-bank/select-age/11-14')} className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <BiUser className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Age 11 - 14</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div>
                <div onClick={() => router.push('/question-bank/select-age/15-18')} className='border py-3 px-2 rounded-[10px] w-full flex items-center justify-between cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <BiUser className='text-[20px]'/>
                        <h1 className='text-[18px] font-[600]'>Age 15 - 18</h1>
                    </div>
                    <BiChevronRight className='text-[20px]'/>
                </div>
            </div>
        </div>
  )
}

export default SelectAge