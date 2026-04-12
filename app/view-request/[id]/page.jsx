"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { get, put } from '../../utils/axiosHelpers'
import Alert from '../../components/alert/Alert'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from 'react-icons/md'

const ViewRequestInfo = () => {

    const { id } = useParams()
    const [requestInfo, setRequestInfo] = useState()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');

    const getQuoteInfo = async () => {
        try {
            setLoading(true)
            const response = await get(`administration/dashboard/requested-quotes/${id}`)
            console.log({"response ======>": response});
            setRequestInfo(response.data)
            
            setLoading(false)
        } catch (error) {
            setAlertType('error')
            setMsg(error.response.data.message)
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const approveQuote = async (quoteId) => {
        try {
            setLoading(true)
            const response = await put(`administration/dashboard/requested-quotes/${quoteId}`, {
                "status":"approved"
            })
            console.log({"response ======>": response});
            setAlertType('success')
            setMsg(response.message)
            getQuoteInfo()
            
            setLoading(false)
        } catch (error) {
            setAlertType('error')
            setMsg(error.response.message)
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    const rejectQuote = async (quoteId) => {
        try {
            setLoading(true)
            const response = await put(`administration/dashboard/requested-quotes/${quoteId}`, {
                "status":"rejected"
            })
            console.log({"response ======>": response});
            setAlertType('success')
            setMsg(response.message)
            getQuoteInfo()
            
            setLoading(false)
        } catch (error) {
            setAlertType('error')
            setMsg(error.response.message)
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getQuoteInfo()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <p className='teext-[#131314] text-[24px] font-[700]'>Quote Request</p>
        <div className='my-10'>
            <p className='text-[#131314] text-[18px] font-[600] mb-3'>School Information</p>
            <div className='bg-[#FCFBFB] mb-2 p-3 rounded-[10px] flex items-center justify-between'>
                <div className='text-[#131314]'>
                    <p>Contact Name</p>
                    <p className='font-[600] mt-3'>{requestInfo && requestInfo[0]?.user?.first_name} {requestInfo && requestInfo[0]?.user?.last_name}</p>
                </div>
                <div className='text-[#131314]'>
                    <p>School Name</p>
                    <p className='font-[600] mt-3'>{requestInfo && requestInfo[0]?.user?.school?.name}</p>
                </div>
                <div className='text-[#131314]'>
                    <p>School Email</p>
                    <p className='font-[600] mt-3'>{requestInfo && requestInfo[0]?.user?.email}</p>
                </div>
                <div className='text-[#131314]'>
                    <p>Role</p>
                    <p className='font-[600] mt-3'>{requestInfo && requestInfo[0]?.user?.role}</p>
                </div>
            </div>
        </div>
        <div>
            <p className='text-[#131314] text-[18px] font-[600] mb-3'>Selected Pathways</p>
            {
                requestInfo?.map((info, index) => (
                    <div key={index} className='bg-[#FCFBFB] mb-2 p-3 rounded-[10px] '>
                        <div className='flex items-center justify-between'>
                            <div className='text-[#131314]'>
                                <p>Career Pathway</p>
                                <p className='font-[600] mt-3 w-[250px]'>{info?.course_pathway?.title}</p>
                            </div>
                            <div className='text-[#131314]'>
                                <p>Class/Year</p>
                                <p className='font-[600] mt-3'>{info?.class_name}</p>
                            </div>
                            <div className='text-[#131314]'>
                                <p>Num. of Stds.</p>
                                <p className='font-[600] mt-3'>{info?.quantity}</p>
                            </div>
                            <div className='text-[#131314]'>
                                <p>Term</p>
                                <p className='font-[600] mt-3 capitalize'>{info?.term}</p>
                            </div>
                            <div className='text-[#131314]'>
                                <p>Term Start Date</p>
                                <p className='font-[600] mt-3'>{new Date( info?.term_start).toLocaleDateString()}</p>
                            </div>
                            <div className='text-[#131314]'>
                                <p>Term End Date</p>
                                <p className='font-[600] mt-3'>{new Date( info?.term_end).toLocaleDateString()}</p>
                            </div>
                        </div>
                            {
                                info?.status === 'pending' && (
                                    <div className='text-[#131314] flex items-center justify-end gap-2 font-[500]'>
                                        <p onClick={() => approveQuote(info.id)} className='cursor-pointer bg-[#131314] text-white font-[500] px-4 py-2 block text-center rounded-[5px]'>Approve</p>
                                        <p onClick={() => rejectQuote(info.id)} className='cursor-pointer text-[#F00101] border border-[#F00101] font-[500] p-2 text-center rounded-[5px]'>Decline</p>
                                    </div>
                                )
                            }
                            {
                                info?.status === 'approved' && (
                                    <div className='text-[#1BCC00] flex items-center gap-2 font-[500] justify-end'>
                                        <IoIosCheckmarkCircleOutline />
                                        <p className='cursor-pointer'>Approved</p>
                                    </div>
                                )
                            }
                            {
                                info?.status === 'rejected' && (
                                    <div className='text-[#F00101] flex items-center gap-2 font-[500] justify-end'>
                                        <MdOutlineCancel />
                                        <p className='cursor-pointer'>Declined</p>
                                    </div>
                                )
                            }
                        </div>
                ))
            }
        </div>
    </div>
  )
}

export default ViewRequestInfo