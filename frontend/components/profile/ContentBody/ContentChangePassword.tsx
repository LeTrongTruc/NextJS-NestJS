'use client'
import { POST } from "@/components/common";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify";

type Inputs = {
    password: string;
    newPassword: string;
    reNewPassword: string;
}

export default function ContentMyInfo() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const reponse = await POST('/user/changePassword', data);
        if (reponse.result) {
            return toast('Đổi mật khẩu thành công!'); 
        }
    }
    return (<>
        <div className="w-[70%] flex px-32 gap-32">
            <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                <div className='text-2xl font-semibold'>Cập nhật mật khẩu</div>
                <div className='w-full'>
                    <div className='text-lg'>Password</div>
                    <input type="password" className='p-2 w-full border outline-none'
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 4,
                                message: 'Password must be at least 4 characters long'
                            }
                        })}
                        aria-invalid={errors.password ? "true" : "false"}
                    />
                    {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
                    <div className='text-lg mt-5'>New Password</div>
                    <input type="password" className='p-2 w-full border outline-none'
                        {...register('newPassword', {
                            required: 'New Password is required',
                            minLength: {
                                value: 4,
                                message: 'Password must be at least 4 characters long'
                            },
                        })}
                        aria-invalid={errors.newPassword ? "true" : "false"}
                    />
                    {errors.newPassword && <p className='text-red-600'>{errors.newPassword.message}</p>}
                    <div className='text-lg mt-5'>Re New Password</div>
                    <input type="password" className='p-2 w-full border outline-none'
                        {...register('reNewPassword', {
                            required: 'Re New Password is required',
                            minLength: {
                                value: 4,
                                message: 'Password must be at least 4 characters long'
                            },
                        })}
                        aria-invalid={errors.reNewPassword ? "true" : "false"}
                    />
                    {errors.reNewPassword && <p className='text-red-600'>{errors.reNewPassword.message}</p>}
                    <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Cập nhật</button>
                </div>
            </form>
        </div>
    </>)
}