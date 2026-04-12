import React from 'react'
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5'
import BtnLoader from '../btnLoader/BtnLoader';

const ConfirmationModal = ({modalInfo, setConfirmModal, load}) => {
  return createPortal(
    <>
        <div className="h-full w-full fixed top-0 left-0 z-[99]" style={{ background:"rgba(14, 14, 14, 0.58)" }} onClick={() => setConfirmModal(false)}></div>
        <div className="bg-white w-[450px] fixed top-[50%] left-[50%] pt-[20px] px-[2rem] z-[100] pb-[20px]" style={{ transform: "translate(-50%, -50%)" }}>
            <div className="flex items-center justify-between border-b pb-[5px]">
                <p className="text-[22px]">{modalInfo.title}</p>
                <IoCloseOutline fontSize={"20px"} cursor={"pointer"} onClick={() => setConfirmModal(false)}/>
            </div>
            <div className='text-center flex items-center justify-center flex-col'>
                <img src="./images/logout-question.svg" alt="" className='mt-9'/>
                <div className='my-5'>
                    <p className='text-[#19201D] mb-4'>{modalInfo.title}</p>
                    <p className='text-[#828282] text-[14px]'>
                        {modalInfo.content}
                    </p>
                </div>
                {
                    load ?
                    <BtnLoader />
                    :
                    <div className='flex items-center gap-5 mt-3 pb-5'>
                        <button className='border-[#19201D] border px-5 py-2 rounded-[4px] text-[14px]' onClick={() => setConfirmModal(false)}>Cancel</button>
                        <button className='bg-[#131314] text-white px-5 py-2 rounded-[4px] text-[14px]' onClick={() => modalInfo.confirmFunction()} >Yes, Continue</button>
                    </div>
                }
            </div>
        </div>
    </>,
    document.body
  )
}

export default ConfirmationModal