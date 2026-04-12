"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';
import { get, put } from '../../utils/axiosHelpers';
import Alert from '../../components/alert/Alert';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';

const UserInfo = () => {

    const { id } = useParams();
    const tabs = ["Profile", "Career Pathway", "Roles and Permissions"]
    const [selectedTab, setSelectedTab] = useState(tabs[0])
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState(null); // Track the selected role
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [confirmModal, setConfirmModal] = useState(false)

    const changeUserStatus = async () => {
        const payload = student.is_active ? false : true
        console.log(payload);
        try {
            const response = await put(`/administration/get-users/${id}`, { "is_active":payload })
            if(response) {
                setLoading(false)
                setConfirmModal(false)
            }
            setMsg("User status changed successfully")
            setAlertType("success")
            fetchStudentData()
        } catch (error) {
            console.log(error);
        }
    }

    const modalInfo = {
        title: user?.is_active ? 'Deactivate User' : 'Activate User',
        content: user?.is_active ? 'Are you sure you want to deactivate this user?' : 'Are you sure you want to activate this user?',
        confirmButtonText: user?.is_active ? 'Deactivate' : 'Activate',
        confirmFunction: changeUserStatus
    }

    const handleCheckboxChange = (role) => {
      setSelectedRole((prevRole) => (prevRole === role ? null : role)); // Toggle selection
    };

    const fetchUserData = async () => {
        try {
            const response = await get(`/administration/get-users/${id}`)
            if(response) setLoading(false)
            setUser(response.data)
        console.log(response);
        
            setSelectedRole(response.data.role)
        } catch (error) {
            console.log(error);
        }
    }

    const updateUserRole = async () => {
        try {
            const response = await put(`/administration/get-users/${id}`, { role: selectedRole })
            console.log(response);
            if(response) setLoading(false)
            setMsg('User role updated successfully');
            setAlertType('success');
            fetchUserData()
        } catch (error) {
            console.log(error)
        }
    }

    const roles = [
        {
            role: 'user',
            title: 'User',
        },
        {
            role: 'student',
            title: 'Student',
        },
        {
            role: 'teacher',
            title: 'Teacher',
        },
        {
            role: 'school_admin',
            title: 'School Admin',
        },
        {
            role: 'main_admin',
            title: 'Main Admin',
        }
    ]

    useEffect(() => {
        fetchUserData()
    }, [])

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        {confirmModal && <ConfirmationModal modalInfo={modalInfo} setConfirmModal={setConfirmModal}/>}
        <div className='w-[100%] py-5 rounded-[10px]'>
            <div className='flex items-center justify-between -mt-9 border-b pb-6'>
                <div>
                    {
                        tabs.map((tab, index) => (
                            <button key={index} onClick={() => setSelectedTab(tab)} className={ selectedTab === tab ? `bg-[#0784C3] px-5 py-1 text-white rounded-full mx-2` : `hover:bg-[#0784C3] text-[#636369] px-5 py-1 hover:text-white rounded-full mx-2`}>
                                {tab}
                            </button>
                        ))
                    }
                </div>
                {
                    user?.is_active ?
                    <button onClick={() => setConfirmModal(true)} className='bg-red-600 text-white py-2 px-8 rounded-[6px]'>Deactivate User</button>
                    :
                    <button onClick={() => setConfirmModal(true)} className='bg-green-600 text-white py-2 px-8 rounded-[6px]'>Activate User</button>
                }
            </div>
            {
                selectedTab === "Profile" &&
                <div className='flex items-start gap-8 mt-10'>
                    {
                        user?.profile_pic?.media ?
                        <img
                            src={user?.profile_pic?.media}
                            className='w-[120px] h-[120px] rounded-full object-cover border'
                            alt={user?.full_name}
                        />
                        :
                        <>
                            {
                                user?.role === 'student' ?
                                <img
                                    src='/assets/student-avatar.svg'
                                    className='w-[120px] h-[120px] rounded-full object-cover border'
                                    alt={user?.full_name}
                                    />
                                :
                                <img
                                    src='/assets/teacher-avatar.svg'
                                    className='w-[120px] h-[120px] rounded-full object-cover border'
                                    alt={user?.full_name}
                                    />
                            }
                        </>
                    }
                    {/* <img src={user?.profile_pic?.media ? user?.profile_pic?.media : '/assets/teacher-avatar.svg' } alt="" className='w-[120px] h-[120px] rounded-full object-cover'/> */}
                    <div className='border border-[#E5E5E6] rounded-[16px] p-4 w-[700px]'>
                        <p className='text-[#4B4B4E] text-[20px] font-[500] mb-9'>Profile Details</p>
                        <div className='flex items-center justify-between'>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>First Name</p>
                                <p className='text-[#131314]'>{user?.first_name}</p>
                            </div>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>First Name</p>
                                <p className='text-[#131314]'>{user?.last_name}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between my-7'>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Role</p>
                                <p className='capitalize text-[#131314]'>{user?.role}</p>
                            </div>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Email</p>
                                <p className='text-[#131314]'>{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                selectedTab === "Roles and Permissions" &&
                <div>

                    <div className='mt-10 grid grid-cols-3'>
                        {
                            roles.map((role, index) => (
                                <div key={index} className='flex items-center justify-between gap-4 mb-5 w-[80%] border-b pb-2'>
                                    <div className='flex items-center gap-2'>
                                        <div className='p-3 bg-[#F2F2F3] rounded-[8px]'>
                                            <img src="/assets/userIcon.svg" alt=""/>
                                        </div>
                                        <label htmlFor={role.role} className='text-[#475467] text-[16px]'>{role.title}</label>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        name="role" 
                                        checked={selectedRole === role.role}
                                        value={selectedRole}
                                        onChange={() => handleCheckboxChange(role.role)} className='cursor-pointer'
                                    />
                                </div>
                            ))
                        }
                    </div>
                    {
                        selectedRole &&
                        <button onClick={updateUserRole} className='bg-[#0784C3] text-white py-2 px-[5rem] rounded-[5px]'>Save</button>
                    }
                </div>
            }
        </div>
    </div>
  )
}

export default UserInfo