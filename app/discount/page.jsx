"use client"

import React, { useEffect, useState } from 'react'
import { BiCopy, BiSearch } from 'react-icons/bi'
import { BsFilter } from 'react-icons/bs'
import useFetch from '../hooks/useFetch'
import Cookies from 'js-cookie'
import { GoPlus } from 'react-icons/go'
import { useRouter } from 'next/navigation'
import Alert from '../components/alert/Alert'
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal'
import { get } from '../utils/axiosHelpers'

const Discount = () => {

  const router = useRouter()
  const [msg, setMsg] = useState()
  const [alertType, setAlertType] = useState()
  const token = Cookies.get('token')
  const [confirmModal, setConfirmModal] = useState()
  const [load, setLoad] = useState(false)
  const [discoutCodes, setDiscountCodes] = useState()
//   const { data, error, loading, refetch } = useFetch(
//     "https://backend.wificombatelearn.com/administration/discount-codes/",
//     { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
//   )

//   console.log(data);

  useEffect(() => {
    fetchDiscountCodes()
  },[])

  async function fetchDiscountCodes() {
    try {
        setLoad(true)
        const response = await get(`/administration/discount-codes/`)
        setDiscountCodes(response.data)
        console.log(response.data);
    } catch (error) {
        if(error.code === "ERR_NETWORK"){
            setAlertType('error')
            setMsg('Network Error')
        }
        console.log(error)
    }finally{
        setLoad(false)
    }
  }

  async function deleteDiscount(id){
    setLoad(true)
    const response = await fetch(`https://backend.wificombatelearn.com/administration/discount-codes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    if(response) setLoad(false)
    if(response.ok){
        setMsg("Discount Code Deleted Successfully.")
        setAlertType('success')
        setConfirmModal(false)
        fetchDiscountCodes()
    }
    // setData(jsonData)
    console.log(response);
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        setMsg("Copied to clipboard successfully.")
        setAlertType('success')
      })
      .catch((error) => {
        console.error('Error copying text:', error);
      });
  }
  // administration/dashboard/stats

  return (
        <div className="w-[82.5%] px-8 py-8 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
            {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
            {confirmModal && (
                <ConfirmationModal
                    modalInfo={{
                        title: 'Delete Discount?',
                        content: `Are you sure you want to delete this discount?`,
                        confirmButtonText: 'Submit',
                        confirmFunction: () => deleteDiscount(confirmModal),
                    }}
                    setConfirmModal={setConfirmModal}
                    load={load}
                />
            )}
            <div className='w-[100%]'>
                {
                    discoutCodes?.discoutCodes?.length === 0 &&
                    <div className='flex justify-center items-center h-[80vh] flex-col'>
                        <h1 className='text-[18px]'>No Discount Codes Found</h1>
                        <button 
                            onClick={() => router.push('/create-discount')}
                            className="flex items-center px-4 py-2 bg-black text-white rounded-lg"
                        >
                            <GoPlus />
                            Add Discount Code
                        </button>
                    </div>

                }

                <div className='flex justify-between'>
                    <h1></h1>
                    <button 
                        onClick={() => router.push('/create-discount')}
                        className="flex items-center px-4 py-2 bg-black text-white text-[14px] rounded-lg"
                    >
                        <GoPlus />
                        Add Discount Code..
                    </button>
                </div>

                {
                    discoutCodes?.length > 0 &&
                    discoutCodes?.map(item => (
                        <div key={item.id} className='flex justify-between mb-5 border border-[#E5E5E6] p-4 rounded-[8px] mt-5'>
                            <div>
                                <p>{item?.percentage_off}%</p>
                                {/* <p className="text-[#636369] py-2">Fundamentals oof coding</p> */}
                                <div className='flex items-center justify-between gap-5 mt-3 border border-gray-500 py-[5px] px-2 rounded-[50px]'>
                                    <p>{item?.code}</p>
                                    <BiCopy className='text-[#0784C3] text-[20px] cursor-pointer' onClick={() => copyToClipboard(item.code)}/>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <button onClick={() => router.push(`/discount/${item.id}`)} className='bg-[#131314] py-2 px-4 rounded-[4px] text-white'>Edit</button>
                                <button onClick={() => setConfirmModal(item.id)} className='border border-red-500 text-red-500 py-2 px-4 rounded-[4px]'>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
  )
}

export default Discount