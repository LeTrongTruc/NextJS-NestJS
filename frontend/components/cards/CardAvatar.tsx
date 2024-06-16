import React from 'react';
import { Card, Space } from 'antd';
import Image from "@/components/Image";
import { FaUserCheck } from "react-icons/fa6";
import { MdOutlineFavorite } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useMyContext } from '../context';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

const App: React.FC = () => {
    const { isLogin, infoUser, setIsLogin, setTabProfile } = useMyContext();
    const router = useRouter();

    const handleLogout = () => {
        setIsLogin(false);
        Cookies.remove('token');
        router.push('/')
    }

    const handleClick = (id: number) => {
        setTabProfile(id);
        router.push('/Profile')
    }
    return (
        <Space direction="vertical" size={16}>
            <Card size="small" style={{ width: 250, padding: '0px' }}>
                <div className='w-full'>
                    <div className='flex items-center gap-3 border-b-2 pb-3'>
                        <div className='w-10 h-10 relative'>
                            <Image src={infoUser && infoUser.avatar ? infoUser.avatar : '/icon-256x256.png'} attribute={'rounded-full border'}></Image>
                        </div>
                        <div>
                            <div className='font-semibold text-base'>{infoUser.username ? infoUser.username : 'Chưa cập nhật'}</div>
                            <div className='font-normal text-sm'>Customer</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 mt-3 ml-1 cursor-pointer'>
                        <FaUserCheck className='text-xl text-gray-600'></FaUserCheck>
                        <div className='text-lg text-gray-600' onClick={() => handleClick(0)}>My Profile</div>
                    </div>
                    <div className='flex items-center gap-3 mt-3 ml-1 cursor-pointer'>
                        <MdOutlineFavorite className='text-xl text-red-500'></MdOutlineFavorite>
                        <div className='text-lg text-gray-600' onClick={() => handleClick(2)}>Favourite</div>
                    </div>
                    <div className='w-full border-b-2 mt-3'></div>
                    <div className='flex items-center gap-3 mt-3 ml-1 cursor-pointer' onClick={() => handleLogout()}>
                        <IoIosLogOut className='text-xl text-gray-600'></IoIosLogOut>
                        <div className='text-lg text-gray-600'>Logout</div>
                    </div>
                </div>
            </Card>
        </Space>
    )
}


    ;

export default App;