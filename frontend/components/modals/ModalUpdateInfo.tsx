"use client"
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useForm, SubmitHandler } from "react-hook-form"
import { POST } from '../common';
import { useMyContext } from '../context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface props {
    isOpenModalLogin: boolean;
    setIsOpenModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
type Inputs = {
    username: string;
    pattern: any,
    message: string;
    birthday: string;
    phone: string;
    sex: string;
}
const App: React.FC<props> = ({ isOpenModalLogin, setIsOpenModalLogin }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const { setInfoUser, infoUser } = useMyContext();
    const router = useRouter()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response = await POST('/user/updateInfo', data);
        if (response.result) {
            setInfoUser(response.data);
            toast('Cập nhật thông tin thành công')
            setIsOpenModalLogin(false);
            router.refresh()
        }
    }

    useEffect(() => {
        const callAPI = async () => {
            const response = await POST('/user/detail');
            if (response.result) {
                setInfoUser(response.data);
                router.refresh();
            }
        }
        callAPI()
    }, [])
    return (
        <>
            <Modal footer={null} open={isOpenModalLogin} onOk={() => setIsOpenModalLogin(false)} onCancel={() => setIsOpenModalLogin(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex justify-center flex-col items-center'>
                    <div className='text-2xl font-semibold'>Cập nhật thông tin</div>
                    <div className='w-full'>
                        <div className='text-xl'>Name</div>
                        <input type="text" className='p-3 w-full border outline-none'
                            {...register('username', {
                                required: 'Name is required'
                            })}
                            aria-invalid={errors.username ? "true" : "false"}
                            defaultValue={infoUser.username}
                        />
                        {errors.username && <p className='text-red-600'>{errors.username.message}</p>}

                        <div className='text-xl mt-3 '>Birthday</div>
                        <input type="date" placeholder='Nhập vào password' className='p-3 w-full border outline-none'
                            {...register('birthday', {
                                required: 'Birthday is required',
                            })}
                            aria-invalid={errors.birthday ? "true" : "false"}
                            defaultValue={infoUser.birthday}

                        />
                        {errors.birthday && <p className='text-red-600'>{errors.birthday.message}</p>}

                        <div className='text-xl mt-3 '>Gender</div>
                        <select id="" className='p-3 w-full border outline-none' {...register('sex')} defaultValue={infoUser.sex}
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="khác">khác</option>
                        </select>

                        <div className='text-xl mt-3 '>Phone</div>
                        <input type="text" className='p-3 w-full border outline-none'
                            {...register('phone', {
                                required: 'Phone is required',
                                pattern: {
                                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                    message: 'Entered value does not match phone format'
                                }
                            })}
                            aria-invalid={errors.phone ? "true" : "false"}
                            defaultValue={infoUser.phone}
                        />
                        {errors.phone && <p className='text-red-600'>{errors.phone.message}</p>}

                        <button className=' mt-4 p-3 w-full bg-green-500  text-xl text-white' type='submit'>Update</button>
                    </div>
                </form>
            </Modal >
        </>
    );
};

export default App;