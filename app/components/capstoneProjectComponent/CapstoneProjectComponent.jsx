import { get } from '../../utils/axiosHelpers';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { trimText } from '../../utils/trimText';
import CardLoader from '../cardLoader/CardLoader';
import { BiPlus } from 'react-icons/bi';

const CapstoneProjectComponent = () => {

    const { path, id } = useParams()
    const [allProjects, setAllProjects] = useState()
    const [loading, setLoading] = useState(false)
  
    async function getAllProjects(){
        console.log(id);
        
        try {
            setLoading(true)
            const response = await get(`/projects/get_projects/${id}`)
            console.log(response);
            
            setAllProjects(response.data)
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProjects()
    }, [])
  
  
  const router = useRouter()

  return (
    <div>
        <div className='grid gap-4 grid-cols-2'>
        {
            allProjects?.map((project, index) => (
                <div key={index} className='w-[100%] shadow p-3 rounded-[15px] cursor-pointer flex gap-3' onClick={() => router.push(`/pathway/${path}/${id}/capstone-project/${project.id}`)}>
                    {/* <img src="/assets/Coding-Fund.svg" alt="" className='w-[200px]' /> */}
                    <div>
                        <p className='text-[#4B4B4E] mb-1 mt-4 font-[500]'>{project?.title}</p>
                        <p className='text-[#636369] mb-1'>Level {project?.course?.level}</p>
                        <p className='text-[#323234] text-[14px]'>{trimText(project?.description, 80)}</p>
                    </div>
                </div>
            ))
        }
        </div>
        {
            allProjects?.length === 0 &&
            <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                <p>No projects found for this course or module.</p>
                <button onClick={() => router.push(`/pathway/${path}/${id}/add-capstone-project`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add Capstone Project</button>
            </div>
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

export default CapstoneProjectComponent