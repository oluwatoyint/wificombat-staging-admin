import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { get } from '../../utils/axiosHelpers';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { GoChevronRight } from "react-icons/go";
import { trimText } from '../../utils/trimText'
import CardLoader from '../cardLoader/CardLoader';

const FlashcardComponent = () => {

    const { id, path } = useParams()
    const [allFlashcards, setAllFlashcards] = useState()
    const [dropDown, setDropDown] = useState('')
    const [allModules, setModules] = useState()
    const [modul, setModule] = useState();
    const [loading, setLoading] = useState(false)

    async function getAllFlashCards(){
        try {
            setLoading(true)
            const response = await get(`/flashcards?course_id=${id}`)
            console.log(response);
            
            setAllFlashcards(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function getModules(){
        try {
            const response = await get(`/modules/get_all?course_id=${id}`)
            console.log(response);
            
            setModules(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getFlashCards(mdlId) {
        try {
            setLoading(true)
            const response = await get(`/flashcards/?module_id=${mdlId}`)
            console.log("Response Data", response.data);
            
            setAllFlashcards(response.data)
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllFlashCards()
        getModules()
    }, [])
    
    
    const router = useRouter()

  return (
    <div>
        <div className='flex justify-between mb-5'>
            <p></p>
            <div>
                <div className='flex items-center gap-3 w-[250px]'>
                {
                    allModules?.length > 0 &&
                    <div className='w-full relative' onClick={() => setDropDown(dropDown === "selectModule" ? "" : "selectModule")}>
                        <p>Select Module</p>
                        <div className='border flex items-center justify-between py-[6px] mt-1 border-[#B1B1B4] rounded-[8px] w-full text-[#656765] px-2 cursor-pointer'>
                            <p className='text-[#656765]'>{modul?.title ? modul.title : "All"}</p>
                            <BiChevronDown className='text-[22px]' />
                        </div>
                            <>
                                {
                                    dropDown === 'selectModule' &&
                                    <ul className='absolute z-10 top-[70px] bg-[#fff] rounded-[8px] w-full border border-[#B1B1B4] py-2'>
                                            <li className='py-1 px-2 cursor-pointer hover:bg-slate-200' onClick={() => {
                                                setDropDown(null)
                                                setModule(null)
                                                getAllFlashCards()
                                            }}>All</li>
                                        {allModules?.map((mdl, index) => (
                                            <li key={index} onClick={() => {
                                                setModule(mdl)
                                                getFlashCards(mdl.id)
                                                setDropDown(null)
                                            }} className='py-1 px-2 cursor-pointer hover:bg-slate-200'>
                                                {mdl.title}
                                            </li>
                                        ))}
                                        <>
                                            {
                                                allModules?.length === 0 &&
                                                <p className='text-[#656765] text-center my-10'>No modules found</p>
                                            }
                                        </>
                                    </ul>
                                }
                            </>
                    </div>
                }
                </div>
            </div>
        </div>
        {
            allFlashcards?.length === 0 &&
            <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                <p>No flashcards found for this course or module.</p>
                <button onClick={() => router.push(`/pathway/${path}/${id}/add-flashcard`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add First Flashcard</button>
            </div>
        }
        {
            allFlashcards?.map((flashcard, index) => (
                <div key={index} className='border p-4 mb-3 flex items-center justify-between rounded-[10px]'>
                    <div>
                        <p className='mb-2 font-[500]'>{flashcard?.question}</p>
                        <p dangerouslySetInnerHTML={{ __html: trimText(flashcard.answer, 120) }} />
                    </div>
                    <GoChevronRight onClick={() => router.push(`/pathway/${path}/${id}/flashcard/${flashcard.id}`)} className='text-[20px] cursor-pointer'/>
                </div>
            ))
        }
        {
          loading &&
          <div className='flex justify-center items-center'>
            <CardLoader />
          </div>
        }
    </div>
  )
}

export default FlashcardComponent