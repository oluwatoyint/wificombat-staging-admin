"use client";
import Image from "next/image";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import { post } from '../../utils/axiosHelpers';
import Alert from "../../components/alert/Alert";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import BtnLoader from "../../components/btnLoader/BtnLoader";

const Login = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [alertType, setAlertType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(!email || !password) {
                setMsg('Please enter your email and password.');
                setAlertType('error');
                return;
            }
            // Making the POST request using the helper function
            setIsLoading(true)
            const response = await post('/login', {email, password});
            console.log(response);
            if(response.success) {
                Cookies.set('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setMsg(`Login successful! Welcome`);
                setAlertType('success');
                window.location.assign('/dashboard');
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
            // Handle errors from the POST request
            setMsg(error?.response?.data?.message);
            setAlertType('error');
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <div className="flex min-h-full w-full h-screen bg-white">
        {/* <Toaster /> */}
        {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
        <div className="relative hidden w-0 flex-1 lg:max-w-[655px] lg:block rounded-tr-[100px]">

            <Image
                fill
                className="absolute inset-0 h-screen w-full object-cover rounded-tr-[100px]"
                src="/assets/register.jpg"
                alt=""
            />

            <div className="absolute inset-0 bg-[#26002C80] opacity-90 rounded-tr-[100px]">
                <Image
                className="absolute top-10 left-10"
                src="/assets/E-learn_logo_sidebar.png"
                width={100}
                height={100}
                alt=""
                />
            </div>
        </div>

        <div className="relative w-full flex flex-col lg:flex-none overflow-y-auto lg:basis-[50%] mx-auto py-10 px-4 md:px-10 lg:pl-20">
        <IoChevronBackOutline
            onClick={() => router.back()}
            className="relative lg:absolute left-0 lg:top-7 max-lg:mb-3 border border-[#5F5F5F1A] p-5 w-14 h-14 cursor-pointer font-bold rounded-lg shadow-sm"
            />
        
        <div className="flex items-center gap-14 ">
            <div className="">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login
                </h2>
            </div>
        </div>

        <div className="mx-auto w-full">
            <div className="mt-16">
                <div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                    <>
                        <div className="w-full">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email Address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                placeholder="grace@gmail.com"
                                onChange={e => setEmail(e.target.value)}
                                // disabled={isLoading}
                                // {...register("email", { required: true })}
                                className={`block outline-none w-full rounded-md border border-gray-600 py-4 px-4 shadow-sm ring-1 
                                    ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset 
                                    focus:ring-purple-600 sm:text-sm sm:leading-6`}
                            />
                            
                        </div>
                        </div>

                        <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Password
                        </label>
                        <div className="mt-2 relative">
                            <div
                                className="absolute top-[27%] right-2 text-[#656765] cursor-pointer text-foundation-gray-normal"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <AiOutlineEye size={20}/> : <AiOutlineEyeInvisible size={20}/>}
                            </div>

                            <input
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="********"
                                onChange={e => setPassword(e.target.value)}
                                className={`block outline-none w-full rounded-md border border-gray-600 py-4 px-4 shadow-sm ring-1 
                                    ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset 
                                    focus:ring-purple-600 sm:text-sm sm:leading-6 `}
                            />
                            
                        </div>
                    </div>

                    <div className="mt-4 mb-10 lg:mb-16 flex items-center justify-end font-medium">
                    
                    </div>

                    <div className="mt-14">
                    {
                        isLoading ?
                        <BtnLoader />
                        :
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md disabled:bg-[#B1B1B4] active:bg-[#131314] bg-[#131314] 
                            p-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline 
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                            Login
                        </button>
                    }
                    </div>
                </>
                </form>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Login