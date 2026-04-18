"use client"

import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { BiEdit, BiEditAlt, BiSearch } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';
import { get, put } from '../utils/axiosHelpers';
import Alert from '../components/alert/Alert';
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal';
import BtnLoader from '../components/btnLoader/BtnLoader';
import ChangePasswordModal from '../components/changePasswordModal/ChangePasswordModal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CardLoader from '../components/cardLoader/CardLoader';

const Profile = () => {

  const tabs = ["Profile", "Change Password", "Requested Quote"]
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [msg, setMsg] = useState('');
  const [alertType, setAlertType] = useState('');
  const [confirmModal, setConfirmModal] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [newProfilePic, setNewProfilePic] = useState(null)
  const [profilePicFile, setProfilePicFile] = useState(null)
  // const [uploadedMedia, setUploadingMedia] = useState('')

  const [full_name, setFullName] = useState()
  const [first_name, setFirstName] = useState()
  const [last_name, setLastName] = useState()
  const [email, setEmail] = useState()
  const [country, setCountry] = useState()
  const [phone, setPhone] = useState()
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const router = useRouter()
  const [allQuotes, setAllQuotes] = useState([])
  const [loadingQuotes, setLoadingQuotes] = useState(false)

  const [uploading, setUploading] = useState(false);

  const token = Cookies.get('token')

  const getMyProfile = async () => {
    try {
      const response = await get(`/administration/get-users/${JSON.parse(localStorage.getItem('user')).id}`)
      setFirstName(response.data.first_name)
      setLastName(response.data.last_name)
      setEmail(response.data.email)
      setCountry(response.data.country)
      setPhone(response.data.phone)
      console.log(response);
      
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const changPassword = async () => {
    if(!currentPassword || !newPassword || !confirmPassword) {
      setMsg('All fields are required');
      setAlertType('error');
      return;
    }
    if(newPassword !== confirmPassword) {
      setMsg('New Password and Confirm Password do not match');
      setAlertType('error');
      return;
    }
    try {
      setLoading(true)
      const response = await put(`/dashboard/change-password`, { current_password: currentPassword, new_password: newPassword })
      console.log(response);
      if(response) setLoading(false)
      setMsg('Password changed successfully');
      setAlertType('success');
      setConfirmModal(false)
    } catch (error) {
      setMsg(error?.response?.data?.message);
      setAlertType('error');
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true)
      const response = await put(`/dashboard/update-profile`, { first_name, last_name, country, phone })
      console.log(response);
      if(response) setLoading(false)
      if(response.success) {
        setMsg('Profile updated successfully');
        setAlertType('success');
        setEditProfile(false)
        getMyProfile()
      }
    } catch (error) {
      setMsg(error?.response?.data?.message);
      setAlertType('error');
      console.log(error)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfilePic(reader.result); // Base64 string of the image
      };
      setProfilePicFile(file)
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = async () => {

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("media", profilePicFile); // Add the file to the form data
      formData.append("media_type", "photo"); // Add the file to the form data

      const response = await axios.post("https://wificombat-staging-backend-production.up.railway.app/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },

        // onUploadProgress: (progressEvent) => {
        //   const { loaded, total } = progressEvent;
        //   let percentCompleted = Math.floor( (loaded / total) * 100 );
        //   console.log(`${loaded}kb of ${total}kb | ${percentCompleted}%`);
          
        //   setProgress(percentCompleted);
        // },
      });
      // const data = await response.json();
      console.log("Server response:", response);
      if(response.status === 200){
        updateProfilePic(response)
      }
    } catch (error) {
      setMsg("Upload failed. Please try again.");
      setAlertType('error')
      console.error("Upload error:", error);
    }
  };

  const updateProfilePic = async (data) => {
    console.log(data.data.data.id);
    
    try {
      // setLoading(true)
      const response = await put(`/dashboard/update-profile`, { profile_pic: data.data.data.id })
      console.log(response);
      if(response) setUploading(false)
      if(response.success) {
        setMsg('Profile picture updated successfully');
        setAlertType('success');
        setNewProfilePic(null)
        getMyProfile()
      }
    } catch (error) {
      setMsg(error?.response?.data?.message);
      setAlertType('error');
      console.log(error)
    }
  }

  const getRequestedQuote = async () => {
    try {
      setLoadingQuotes(true)
      const response = await get(`/administration/dashboard/requested-quotes`)
      console.log({"response ======>": response});
      setAllQuotes(response.data)
      
      setLoadingQuotes(false)
    } catch (error) {
      console.log(error)
    }finally{
      setLoadingQuotes(false)
    }
  }

  useEffect(() => {
    getMyProfile()
    getRequestedQuote()
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
                            <button key={index} onClick={() => setSelectedTab(tab)} className={ selectedTab === tab ? `bg-[#0784C3] px-5 py-1 text-white rounded-full mx-1` : `hover:bg-[#0784C3] text-[#636369] px-5 py-1 hover:text-white rounded-full mx-1`}>
                                {tab}
                            </button>
                        ))
                    }
                </div>
            </div>
            {
                selectedTab === "Profile" &&
                <div className='flex items-start gap-8 mt-10'>
                  {
                    newProfilePic ?
                    <div>
                      <div className='relative'>
                        <img src={newProfilePic} alt="" className='w-[120px] h-[120px] rounded-full object-cover border'/>
                        <input type="file" accept="image/*" onChange={handleFileChange} className='absolute bottom-[5px] right-[0px] z-[1] w-[30px] opacity-0 cursor-pointer' />
                        <div className='absolute bottom-[5px] text-[18px] right-[0px] bg-gray-200 p-[7px] rounded-full'>
                          <BiEditAlt />
                        </div>
                      </div>
                      {
                        newProfilePic &&
                        <>
                        {
                          uploading ?
                          <div className='mt-6 flex justify-center items-center'>
                            <BtnLoader />
                          </div>
                          :
                          <button className='bg-black text-white py-[0.4rem] w-[120px] rounded-[7px] block mt-2 text-[14px]' onClick={handleProfilePicUpload}>Save Changes</button>
                        }
                          {/* <button className='bg-black text-white py-[0.4rem] w-[120px] rounded-[7px] block mt-2 text-[14px]' onClick={handleProfilePicUpload}>Save Changes</button> */}
                        </>
                      }
                    </div>
                    :
                    <div>
                      <div className='relative'>
                        <img src={user?.profile_pic?.media} alt="" className='w-[120px] h-[120px] rounded-full object-cover border'/>
                        <input type="file" accept="image/*" onChange={handleFileChange} className='absolute bottom-[5px] right-[0px] z-[1] w-[30px] opacity-0 cursor-pointer' />
                        <div className='absolute bottom-[5px] text-[18px] right-[0px] bg-gray-200 p-[7px] rounded-full'>
                          <BiEditAlt />
                        </div>
                      </div>
                    </div>
                  }
                    <div className='border border-[#E5E5E6] rounded-[16px] p-4 w-[700px]'>
                        <div className='flex items-center justify-between mb-9'>
                          <p className='text-[#131314] text-[20px] font-[500]'>Profile Details</p>
                          <BiEdit className='cursor-pointer text-[20px]' onClick={() => setEditProfile(!editProfile)}/>
                        </div>

                        {/* <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${progress}%` }}>
                            {progress}%
                          </div>
                        </div> */}

                        <div className='flex items-center justify-between gap-5'>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>First Name</p>
                                {
                                  editProfile?
                                  <input type="text" className='border py-1 px-2 rounded-[8px] outline-none w-full' onChange={e => setFirstName(e.target.value)} value={first_name}/>
                                  :
                                  <p>{first_name}</p>
                                }
                            </div>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Last Name</p>
                                {
                                  editProfile?
                                  <input type="text" className='border py-1 px-2 rounded-[8px] outline-none w-full' onChange={e => setLastName(e.target.value)} value={last_name}/>
                                  :
                                  <p>{last_name}</p>
                                }
                            </div>

                        </div>
                        <div className='flex items-center justify-between my-7 gap-5'>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Role</p>
                                <p>{user?.role}</p>
                            </div>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Email</p>
                                <p>{email}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-between my-7 gap-5'>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Country</p>
                                {
                                  editProfile?
                                  <input type="text" className='border py-1 px-2 rounded-[8px] outline-none w-full' onChange={e => setCountry(e.target.value)} value={country}/>
                                  :
                                  <p>{country}</p>
                                }
                            </div>
                            <div className='w-[350px]'>
                                <p className='text-[14px]'>Phone</p>
                                {
                                  editProfile?
                                  <input type="text" className='border py-1 px-2 rounded-[8px] outline-none w-full' onChange={e => setPhone(e.target.value)} value={phone}/>
                                  :
                                  <p>{phone}</p>
                                }
                            </div>
                        </div>
                      {
                        loading?
                        <div className='flex justify-between mt-6'>
                          <p></p>
                          <BtnLoader />
                        </div>
                        :
                        <button onClick={updateProfile} className='bg-black text-white py-[0.6rem] w-[150px] rounded-[7px] block mt-6 ml-auto'>Save Changes</button>
                      }
                    </div>
                </div>
            }

            {
                selectedTab === "Change Password" &&
                <div className='w-[650px] border rounded-[13px] p-4 mt-8'>
                  <p className='font-bold text-[22px] mb-8'>Change Pasword</p>
                  <div>
                    <p className='mb-1'>Current Password</p>
                    <input type="text" onChange={e => setCurrentPassword(e.target.value)} className='border py-[10px] px-2 outline-none w-full rounded-[10px]'/>
                  </div>
                  <div className='my-[2rem]'>
                    <p className='mb-1'>New Password</p>
                    <input type="text" onChange={e => setNewPassword(e.target.value)} className='border py-[10px] px-2 outline-none w-full rounded-[10px]'/>
                  </div>
                  <div>
                    <p className='mb-1'>Re-Enter New Password</p>
                    <input type="text" onChange={e => setConfirmPassword(e.target.value)} className='border py-[10px] px-2 outline-none w-full rounded-[10px]'/>
                  </div>
                  <button onClick={() => setChangePasswordModal(true)} className='bg-black text-white py-[0.6rem] w-[150px] rounded-[7px] block mt-6 ml-auto'>Save Changes</button>

                    {/* <div className='mt-10 grid grid-cols-3'>
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
                    } */}
                </div>
            }
            {
              selectedTab === "Requested Quote" &&
              <>
                <div className="flex items-center justify-between my-8">
                  <p className='text-[#131314] text-[20px] font-[600]'>Recent Quote Request</p>
                  {/* <p className='text-[#056494] underline text-[17px] cursor-pointer'>History</p> */}
                </div>
                <div>
                {
                  allQuotes.map(item => (
                      <div key={item.id} className='flex items-center justify-between p-4 rounded-[10px] border border-[#E5E5E6] mb-2'>
                        <div>
                          <p className='text-[#131314] text-[17px] mb-2 font-[600]'>{item?.name}</p>
                          <p>Submitted on {new Date (item?.created_at).toLocaleDateString()}</p>
                        </div>
                        <p onClick={() => router.push(`/view-request/${item.id}`)} className='text-[#0784C3] px-3 py-1 bg-[#E6F6FE] rounded-full cursor-pointer'>View</p>
                      </div>
                  ))
                }
                </div>
                {
                    allQuotes?.length === 0 &&
                    <div className='text-[#656765] text-center flex flex-col justify-center items-center w-full mt-20'>
                        <p>No quotes found</p>
                        {/* <button onClick={() => router.push(`/pathway/${path}/${id}/add-assignment`)} className='bg-[#131314] mt-2 text-white px-3 py-2 rounded-[4px] text-[14px] cursor-pointer flex items-center gap-2'> <BiPlus /> Add Assignment</button> */}
                    </div>
                }
                {
                  loadingQuotes &&
                  <div className='flex justify-center items-center'>
                    <CardLoader />
                  </div>
                }
              </>
            }
        </div>
        {
          changePasswordModal &&
          <ChangePasswordModal
            onClose={() => setChangePasswordModal(false)}
            onConfirm={changPassword}
            loading={loading}
          />
        }
    </div>
  )
}

export default Profile
