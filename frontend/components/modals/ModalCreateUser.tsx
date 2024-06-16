"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useForm, SubmitHandler } from "react-hook-form"
import { POST, POST_ADMIN, POST_ADMIN_FORM } from '../common';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
interface props {
    isOpenModalLogin: boolean;
    setIsOpenModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
type Inputs = {
    username: string;
    pattern: any,
    message: string;
    email: string;
    repassword: string;
    code: string;
    detail: string;
    specification: string;
    standard: string;
    unit: string;
    images: string;
    note: string;
    category_id: string;
    quantity: Number;
}
const App: React.FC<props> = ({ isOpenModalLogin, setIsOpenModalLogin }) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const [password, setPassword] = useState<any>();
    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response = await POST_ADMIN('/admin/createUser', { ...data, password })
        if (response.result) {
            toast('Create user success');
            setIsOpenModalLogin(false)
        }
        reset();
        queryClient.invalidateQueries({ queryKey: ['listUser'] })
    }

    const generateOTP = () => {
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += Math.floor(Math.random() * 10);
        }
        setPassword('')
        setPassword(Number(result));
    }

    useEffect(() => {
        generateOTP()
    }, [isOpenModalLogin])
    return (
        <>
            <Modal footer={null} open={isOpenModalLogin} onOk={() => setIsOpenModalLogin(false)} onCancel={() => setIsOpenModalLogin(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-xl font-medium'>Create user</div>
                    <div className='w-full'>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mt-3">
                                Name
                            </label>
                            <input
                                type="text"
                                id="password"
                                className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register('username', {
                                    required: 'Name is required',
                                })}
                                aria-invalid={errors.username ? "true" : "false"}
                            />
                            {errors.username && <p className='text-red-600'>{errors.username.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mt-3">
                                Email
                            </label>
                            <input
                                type="email"
                                id="password"
                                className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mt-3">
                                Password
                            </label>
                            <input
                                type="text"
                                defaultValue={password}
                                disabled
                                id="password"
                                className="bg-gray-300  border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Create</button>
                </form >
            </Modal >
        </>
    );
};

export default App;