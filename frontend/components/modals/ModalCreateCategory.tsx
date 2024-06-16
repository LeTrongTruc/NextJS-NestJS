"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useForm, SubmitHandler } from "react-hook-form"
import { POST, POST_ADMIN } from '../common';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
interface props {
    isOpenModalLogin: boolean;
    setIsOpenModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
type Inputs = {
    name: string;
    pattern: any,
    message: string;
    parent: string;
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
    const queryClient = useQueryClient()

    const callApi = async () => {
        const data = await POST_ADMIN('/admin/getCategoryFollowConditions', { conditions: { parent: 0 } });
        if (data.result) {
            return data.data
        }
    }

    const query = useQuery({ queryKey: ['listParent'], queryFn: callApi })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response = await POST_ADMIN('/admin/createCategory', data)
        if (response.result) {
            toast('create category success');
            queryClient.invalidateQueries({ queryKey: ['listCategory'] })
            queryClient.invalidateQueries({ queryKey: ['listParent'] })
            setIsOpenModalLogin(false)
        }
        reset()
    }

    return (
        <>
            <Modal footer={null} open={isOpenModalLogin} onOk={() => setIsOpenModalLogin(false)} onCancel={() => setIsOpenModalLogin(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-xl font-medium'>Create Category</div>
                    <div className='w-full'>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="password"
                            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register('name', {
                                required: 'Name is required',
                            })}
                            aria-invalid={errors.name ? "true" : "false"}

                        />
                        {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-5"
                        >
                            Choose category parent
                        </label>
                        <select className='w-full h-10 border outline-none '{...register('parent')}>
                            <option value="0">is parent</option>
                            {query.data?.map((item: any) => (
                                <option value={item._id} key={1}>{item.name}</option>
                            ))}
                        </select>
                        <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Create</button>

                    </div>
                </form>
            </Modal>
        </>
    );
};

export default App;