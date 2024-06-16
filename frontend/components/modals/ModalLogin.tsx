"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useForm, SubmitHandler } from "react-hook-form"
import { POST } from '../common';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useMyContext } from '../context';
import ModalForgotPassword from './ModalForgotPassword';
interface props {
    isOpenModalLogin: boolean;
    setIsOpenModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
type Inputs = {
    email: string;
    pattern: any,
    message: string;
    password: string;
    repassword: string;
    otp: string;
}
const App: React.FC<props> = ({ isOpenModalLogin, setIsOpenModalLogin }) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>();
    const router = useRouter();
    const { setIsLogin, setInfoUser } = useMyContext()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!isFormRegister && !isFormLogin) {
            const request = await POST('/user/sendOTP', data);
            if (request.result) {
                setIsFormRegister(true)
                toast('Mã OTP đã được gửi về mail bạn đăng ký vui lòng kiểm tra email');
            }
        } else if (isFormRegister) {
            const request = await POST('/user/createUser', data);
            if (request.result) {
                setIsFormRegister(false);
                setIsFormLogin(true);
                setIsLogin(true);
                setInfoUser(request.user);
                setIsOpenModalLogin(false);
                Cookies.set('token', request.token);
                reset();
                return toast('Đăng ký tài khoản thành công');
            }
        } else {
            const request = await POST('/user/login', data);
            if (request.result) {
                setIsOpenModalLogin(false);
                setIsFormRegister(false);
                setIsLogin(true);
                setInfoUser(request.data);
                Cookies.set('token', request.token);
                reset();
                toast('Đăng nhập thành công!');
            }
        }

    }
    const [isFormLogin, setIsFormLogin] = useState(true);
    const [isFormRegister, setIsFormRegister] = useState(false);
    const [isOpenModalLogin2, setisOpenModalLogin2] = useState(false);

    return (
        <>
            <Modal footer={null} open={isOpenModalLogin} onOk={() => setIsOpenModalLogin(false)} onCancel={() => setIsOpenModalLogin(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-2xl font-semibold'>{isFormLogin ? 'Login' : 'Register'}</div>
                    <div className='w-full'>
                        <div className='text-xl'>Email</div>
                        <input type="text" placeholder='Nhập vào email' className='p-3 w-full border outline-none'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: 'Entered value does not match email format'
                                }
                            })}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
                        {(isFormLogin || isFormRegister) && (
                            <>
                                <div className='text-xl mt-3 '>Password</div>
                                <input type="password" placeholder='Nhập vào password' className='p-3 w-full border outline-none'
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters long'
                                        },
                                    })}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
                            </>
                        )}
                        {isFormRegister && (
                            <>
                                <div className='text-xl mt-3 '>Re Password</div>
                                <input type="password" placeholder='Nhập vào re password' className='p-3 w-full border outline-none'
                                    {...register('repassword', {
                                        required: 'Re Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters long'
                                        },
                                    })}
                                    aria-invalid={errors.repassword ? "true" : "false"}
                                />
                                {errors.repassword && <p className='text-red-600'>{errors.repassword.message}</p>}
                            </>
                        )}
                        {isFormRegister && (
                            <>
                                <div className='text-xl mt-3 '>OTP</div>
                                <input type="number" placeholder='Nhập vào otp' className='p-3 w-full border outline-none'
                                    {...register('otp', {
                                        required: 'OTP is required',
                                        minLength: {
                                            value: 6,
                                            message: 'OTP must be at least 6 characters'
                                        },
                                        maxLength: {
                                            value: 6,
                                            message: 'OTP must be at least 6 characters'
                                        },
                                    })}
                                    aria-invalid={errors.otp ? "true" : "false"}
                                />
                                {errors.otp && <p className='text-red-600'>{errors.otp.message}</p>}
                            </>
                        )}
                        <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>{isFormLogin ? 'Login' : 'Register'}</button>
                        <div className='text-center mt-4'>{isFormLogin ? 'Do you already have an account?' : 'Do not have an account?'}<div className='inline-block cursor-pointer text-blue-500' onClick={() => setIsFormLogin(item => !item)}>&nbsp;{isFormLogin ? 'Register' : 'Login'}</div></div>
                        <div className='text-base text-blue-500 text-center cursor-pointer' onClick={() => { setisOpenModalLogin2(true); setIsOpenModalLogin(false) }} >Forgot password</div>
                    </div>
                </form>
            </Modal>
            <ModalForgotPassword isOpenModalLogin2={isOpenModalLogin2} setisOpenModalLogin2={setisOpenModalLogin2}></ModalForgotPassword>
        </>
    );
};

export default App;