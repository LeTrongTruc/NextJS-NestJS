"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useForm, SubmitHandler } from "react-hook-form"
import { POST } from '../common';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useMyContext } from '../context';

interface props {
    isOpenModalLogin2: boolean;
    setisOpenModalLogin2: React.Dispatch<React.SetStateAction<boolean>>;
}
type Inputs = {
    email: string;
    pattern: any,
    message: string;
    newPassword: string;
    reNewPassword: string;
    otp: string;
}
const App: React.FC<props> = ({ isOpenModalLogin2, setisOpenModalLogin2 }) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>();
    const router = useRouter();
    const { setIsLogin, setInfoUser } = useMyContext()

    const [isForgot, setIsForgot] = useState(false);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!isForgot) {
            const request = await POST('/user/sendOTPforgotPassword', data);
            if (request.result) {
                setIsForgot(true)
                toast('Mã OTP đã được gửi về mail bạn đăng ký vui lòng kiểm tra email');
            }
        } else {
            const request = await POST('/user/forgotPassword', data);
            if (request.result) {
                reset();
                setIsForgot(false)
                setisOpenModalLogin2(false);
                return toast('Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại');
            }
        }

    }


    return (
        <>
            <Modal footer={null} open={isOpenModalLogin2} onOk={() => setisOpenModalLogin2(false)} onCancel={() => setisOpenModalLogin2(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-2xl font-semibold'>Forgot Password</div>
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
                        {isForgot && (
                            <>
                                <div className='text-xl mt-3 '>Password</div>
                                <input type="password" placeholder='Nhập vào password' className='p-3 w-full border outline-none'
                                    {...register('newPassword', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters long'
                                        },
                                    })}
                                    aria-invalid={errors.newPassword ? "true" : "false"}
                                />
                                {errors.newPassword && <p className='text-red-600'>{errors.newPassword.message}</p>}
                            </>
                        )}
                        {isForgot && (
                            <>
                                <div className='text-xl mt-3 '>Re Password</div>
                                <input type="password" placeholder='Nhập vào re password' className='p-3 w-full border outline-none'
                                    {...register('reNewPassword', {
                                        required: 'Re Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'Password must be at least 4 characters long'
                                        },
                                    })}
                                    aria-invalid={errors.reNewPassword ? "true" : "false"}
                                />
                                {errors.reNewPassword && <p className='text-red-600'>{errors.reNewPassword.message}</p>}
                            </>
                        )}
                        {isForgot && (
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
                        <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Update</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default App;