'use client'
import { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import Imagee from '@/components/Image';
import ModalUpdateInfo from '@/components/modals/ModalUpdateInfo'
import { useMyContext } from "@/components/context";
import { POST, POST_JSON } from "@/components/common";
import { toast } from "react-toastify";
export default function ContentMyInfo({ data }: any) {
    const [avatar, setAvatar] = useState(data.data?.avatar);
    const [info, setInfo] = useState(data.data);
    const { infoUser, setInfoUser } = useMyContext();

    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
        const response = await POST_JSON('/user/uploadAvatar', { file });
        if (response.result) {
            toast("Upload avatar success!")
            setInfo((item: any) => ({ ...item, avatar: response.data }));
            setInfoUser((item: any) => ({ ...item, avatar: response.data }))
        }
    };
    const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

    return (<>
        <div className="w-[70%] flex flex-col justify-center items-center">
            <div className="text-2xl font-semibold">Thông tin cá nhân</div>
            <div className="w-full flex py-10 px-32 gap-32">
                <div>
                    <div className="w-32 h-32 rounded-full relative">
                        <Imagee src={avatar ? avatar : '/icon-256x256.png'} attribute="rounded-full"></Imagee>
                    </div>
                    <div className='flex cursor-pointer justify-center mt-5 border rounded-xl bg-slate-300 p-2 items-center gap-1 relative'>
                        <BsCloudUpload></BsCloudUpload>
                        <div>Upload</div>
                        <input type='file' className='opacity-0 w-full h-full z-50 absolute left-0 cursor-pointer' onChange={handleChangeFile}>
                        </input>
                    </div>
                </div>
                <div>
                    <div>
                        <span className=" font-semibold">Name:</span>&nbsp;&nbsp;{infoUser.username ? infoUser.username : "Chưa cập nhật"}
                    </div>
                    <div className="mt-5">
                        <span className="font-semibold ">Bithday:</span>&nbsp;&nbsp;{infoUser.birthday ? infoUser.birthday : "Chưa cập nhật"}
                    </div>
                    <div className="mt-5">
                        <span className="font-semibold ">Gender:</span>&nbsp;&nbsp;{infoUser.sex ? infoUser.sex : "Chưa cập nhật"}
                    </div>
                    <div className="mt-5">
                        <span className="font-semibold ">Phone:</span>&nbsp;&nbsp;{infoUser.phone ? infoUser.phone : "Chưa cập nhật"}
                    </div>
                    <div className="mt-5">
                        <span className="font-semibold ">Email:</span>&nbsp;&nbsp;{infoUser.email}
                    </div>
                    <div className="mt-10 border py-3 px-3 w-[150px] text-xl cursor-pointer font-medium text-white bg-green-500 rounded-xl flex justify-center" onClick={() => setIsOpenModalLogin(true)}>
                        Cập nhật
                    </div>
                    <ModalUpdateInfo isOpenModalLogin={isOpenModalLogin} setIsOpenModalLogin={setIsOpenModalLogin}></ModalUpdateInfo>
                </div>
            </div>

        </div>
    </>)
}