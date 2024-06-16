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
    name: string;
    pattern: any,
    message: string;
    parent: string;
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
    const queryClient = useQueryClient()

    const callApi = async () => {
        const data = await POST_ADMIN('/admin/getCategoryFollowConditions', { conditions: {} });
        if (data.result) {
            return data.data
        }
    }

    const query = useQuery({ queryKey: ['listCategory_v2'], queryFn: callApi })
    const [image, setImage] = useState();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response = await POST_ADMIN_FORM('/product/createProduct', {
            category_id: data.category_id,
            detail: data.detail,
            file: image,
            name: data.name,
            quantity: data.quantity,
            specification: data.specification,
            standard: data.standard,
            unit: data.unit,
        })
        if (response.result) {
            toast('create product success');
            queryClient.invalidateQueries({ queryKey: ['listProductForAdmin'] })
            queryClient.invalidateQueries({ queryKey: ['listParent'] })
            setIsOpenModalLogin(false)
        }
        reset()
    }

    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0];
        setImage(file)
    };

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['listCategory'] })
        queryClient.invalidateQueries({ queryKey: ['listParent'] })
    }, [isOpenModalLogin])
    return (
        <>
            <Modal footer={null} open={isOpenModalLogin} onOk={() => setIsOpenModalLogin(false)} onCancel={() => setIsOpenModalLogin(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-xl font-medium'>Create Product</div>
                    <div className='w-full'>
                        <label
                            className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="password"
                            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register('name', {
                                required: 'Name is required',
                            })}
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name && <p className='text-red-600'>{errors.name.message}</p>}
                        <label
                            className="block text-sm font-medium text-gray-900 dark:text-white mt-3 "
                        >
                            Choose category
                        </label>
                        <select className='w-full h-10 border outline-none '{...register('category_id')}>
                            {query.data?.map((item: any) => (
                                <option value={item._id} key={1}>{item.name}</option>
                            ))}
                        </select>

                        <label
                            className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                        >
                            Detail
                        </label>
                        <input
                            type="text"
                            id="password"
                            className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register('detail')}
                            aria-invalid={errors.detail ? "true" : "false"}
                        />
                        {errors.detail && <p className='text-red-600'>{errors.detail.message}</p>}

                        <div className='flex justify-between'>
                            <div className='w-[49%]'>
                                <label
                                    className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                                >
                                    Specification
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register('specification')}
                                />
                            </div>

                            <div className='w-[49%]'>
                                <label
                                    className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                                >
                                    Standard
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register('standard')}
                                />
                            </div>
                        </div>

                        <div className='flex justify-between'>
                            <div className='w-[49%]'>
                                <label
                                    className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                                >
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register('quantity')}
                                />
                            </div>

                            <div className='w-[49%]'>
                                <label
                                    className="block text-sm font-medium text-gray-900 dark:text-white mt-3"
                                >
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register('unit')}
                                />
                            </div>
                        </div>


                        <label className="block mb-2 mt-3 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3" id="file_input" type="file" onChange={handleChangeFile} />

                        <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Create</button>

                    </div>
                </form>
            </Modal>
        </>
    );
};

export default App;