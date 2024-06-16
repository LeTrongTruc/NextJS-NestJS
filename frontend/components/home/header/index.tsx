'use client';
import Image from "@/components/Image";
import { FaUser } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { BsBagDash } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import DropdowMenu from './DropdowMenu';
import { HiOutlineSearch } from "react-icons/hi";
import ModalLogin from '@/components/modals/ModalLogin';
import { useMyContext } from "@/components/context";
import { useEffect, useRef, useState } from "react";
import CardAvatar from '@/components/cards/CardAvatar'
import CardSearch from "./CardSearch";
import { useRouter } from 'next/navigation';
import { POST } from "@/components/common";

const Header = ({ dataUser, dataCategory }: any) => {
    const { infoUser, setInfoUser, isLogin } = useMyContext();
    const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
    const [isOpenCardUser, setIsOpenCardUser] = useState(false);
    const [isOpenCardSearch, setIsOpenCardSearch] = useState(false);
    const [isLogin2, setisLogin2] = useState(infoUser || dataUser?.result);
    const [key, setKey] = useState('');
    const [dataSearch, setDataSearch] = useState([])
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useEffect(() => {
        setisLogin2(isLogin)
    }, [isLogin]);

    useEffect(() => {
        const callAPISearch = async () => {
            const query = await POST('/product/search', { skip: 0, limit: 10, key });
            setDataSearch(query.data)
        }
        callAPISearch()
    }, [key]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpenCardSearch(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <>
            <div className="flex justify-center">
                <div className="w-[1300px] flex justify-between px-10 py-5 items-center">
                    <div className="w-[250px] h-[100px] relative cursor-pointer" onClick={() => router.push('/')}>
                        <Image src={'/441570675_3396188657344858_3846924565448010892_n.jpg'}></Image>
                    </div>
                    <div className="w-[60%] mr-10 relative" ref={ref}>
                        <input onChange={(e) => setKey(e.target.value)} onClick={() => setIsOpenCardSearch(item => !item)} type="text" placeholder="Tìm kiếm sản phẩm" className="bg-zinc-200 px-10 py-3 rounded-3xl w-full outline-none" />
                        <div className="absolute right-5 top-2 cursor-pointer">
                            <HiOutlineSearch className="text-3xl text-gray-500" onClick={() => router.push(`/Search?query=${key}`)}></HiOutlineSearch>
                        </div>
                        {isOpenCardSearch && <CardSearch dataSearch={dataSearch}></CardSearch>}
                    </div>
                    <div className={`flex ${!isLogin2 ? 'gap-2' : 'gap-5 items-center'}`}>
                        {!isLogin2 && <div onClick={() => setIsOpenModalLogin(true)} className="flex gap-1 cursor-pointer justify-center items-center text-white border bg-black py-3 px-3 rounded">
                            <FaUser></FaUser>
                            <div>Login</div>
                        </div>}
                        <div className="flex gap-1 cursor-pointer justify-center items-center text-white border bg-black py-3 px-3 rounded">
                            <MdFavorite></MdFavorite>
                            <div>Favourite</div>
                        </div>
                        {
                            isLogin2 && <div className="relative" onClick={() => setIsOpenCardUser(item => !item)}>
                                <div className="w-12 h-12 relative cursor-pointer">
                                    <Image src={infoUser && infoUser.avatar ? infoUser.avatar : '/icon-256x256.png'} attribute={'rounded-full border'}></Image>
                                </div>
                                {isOpenCardUser && <div className="absolute right-3 z-50">
                                    <CardAvatar></CardAvatar>
                                </div>}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full border flex justify-center">
                <div className="w-[1300px] flex justify-start gap-5 px-10 items-center py-4">
                    <div className="flex justify-center items-center gap-1 text-lime-700 font-semibold ">
                        <AiOutlineHome className="text-lg"></AiOutlineHome>
                        <div className="text-lg">Trang chủ</div>
                    </div>
                    <div className="flex justify-center items-center gap-1 hover:text-lime-700 cursor-pointer font-semibold z-50">
                        <BsBagDash className="text-lg" ></BsBagDash>
                        <DropdowMenu dataCategory={dataCategory}></DropdowMenu>
                    </div>
                    <div className="flex justify-center items-center gap-1 hover:text-lime-700 cursor-pointer font-semibold ">
                        <CiLocationOn className="text-lg"></CiLocationOn>
                        <div className="text-lg">Liên hệ</div>
                    </div>
                </div>
            </div>
            <ModalLogin isOpenModalLogin={isOpenModalLogin} setIsOpenModalLogin={setIsOpenModalLogin}></ModalLogin>
        </>
    );
}

export default Header;

