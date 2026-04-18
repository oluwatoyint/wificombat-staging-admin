import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5'
import BtnLoader from '../btnLoader/BtnLoader';

const ChangePasswordModal = ({onClose, onConfirm, loading}) => {

    // const [load, setLoad] = useState(false)


    return createPortal(
        <>
            <div className="h-full w-full fixed top-0 left-0 z-[99]" style={{ background:"rgba(14, 14, 14, 0.58)" }} onClick={onClose}></div>
            <div className="bg-white w-[450px] fixed top-[50%] left-[50%] pt-[20px] px-[2rem] z-[100] pb-[20px]" style={{ transform: "translate(-50%, -50%)" }}>
                <div className='text-center flex items-center justify-center flex-col'>
                    <img src="/assets/checkMark.svg" alt="" className='mt-9'/>
                    <div className='my-5'>
                        <p className='text-[#19201D] mb-4'>Save Changes</p>
                        <p className='text-[#828282] text-[14px]'>
                            Are you sure you want to save changes to this account.
                        </p>
                    </div>
                    {
                        loading ?
                        <BtnLoader />
                        :
                        <div className='flex items-center gap-5 mt-3 pb-5'>
                            <button className='border-[#19201D] border px-5 py-2 rounded-[4px] text-[14px]' onClick={onClose}>Cancel</button>
                            <button className='bg-[#131314] text-white px-5 py-2 rounded-[4px] text-[14px]' onClick={onConfirm}>Save</button>
                        </div>
                    }
                </div>
            </div>
        </>,
        document.body
      )
}

export default ChangePasswordModal
