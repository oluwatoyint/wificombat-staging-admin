import React from 'react'

const CardLoader = () => {
  return (
        <div role="status" className="w-full grid grid-cols-3 gap-8 py-4 animate-pulse dark:divide-gray-300 md:py-6">
            <div className="flex flex-col items-start justify-between w-full">
                <div className="h-[200px] bg-gray-300 rounded-[10px] dark:bg-gray-300 w-full mb-2.5"></div>
                <div className="h-[20px] bg-gray-300 rounded-[7px] dark:bg-gray-300 w-[180px]"></div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-[120px] mt-3"></div>
            </div>
            <div className="flex flex-col items-start justify-between w-full">
                <div className="h-[200px] bg-gray-300 rounded-[10px] dark:bg-gray-300 w-full mb-2.5"></div>
                <div className="h-[20px] bg-gray-300 rounded-[7px] dark:bg-gray-300 w-[180px]"></div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-[120px] mt-3"></div>
            </div>
            <div className="flex flex-col items-start justify-between w-full">
                <div className="h-[200px] bg-gray-300 rounded-[10px] dark:bg-gray-300 w-full mb-2.5"></div>
                <div className="h-[20px] bg-gray-300 rounded-[7px] dark:bg-gray-300 w-[180px]"></div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-[120px] mt-3"></div>
            </div>
            <div className="flex flex-col items-start justify-between w-full">
                <div className="h-[200px] bg-gray-300 rounded-[10px] dark:bg-gray-300 w-full mb-2.5"></div>
                <div className="h-[20px] bg-gray-300 rounded-[7px] dark:bg-gray-300 w-[180px]"></div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-[120px] mt-3"></div>
            </div>
            <div className="flex flex-col items-start justify-between w-full">
                <div className="h-[200px] bg-gray-300 rounded-[10px] dark:bg-gray-300 w-full mb-2.5"></div>
                <div className="h-[20px] bg-gray-300 rounded-[7px] dark:bg-gray-300 w-[180px]"></div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-[120px] mt-3"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
  )
}

export default CardLoader