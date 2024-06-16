'use client';
import { IoInformationCircleSharp } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineFavorite } from "react-icons/md";
import { useMyContext } from "@/components/context";

export default function SideBar() {
    const { setTabProfile } = useMyContext();
    return (
        <>
            <div className="w-[30%] h-[420px] border cursor-pointer">
                <div className="border-b-2 p-10 flex items-center gap-3" onClick={() => setTabProfile(0)}>
                    <IoInformationCircleSharp className="text-xl text-blue-500"></IoInformationCircleSharp>
                    <div>My Info</div>
                </div>
                <div className="border-b-2 p-10 flex items-center gap-3" onClick={() => setTabProfile(1)}>
                    <RiLockPasswordFill className="text-xl text-yellow-500"></RiLockPasswordFill>
                    <div>Change Password</div>
                </div>
                <div className="border-b-2 p-10 flex items-center gap-3" onClick={() => setTabProfile(2)}>
                    <MdOutlineFavorite className="text-xl text-red-500"></MdOutlineFavorite>
                    <div>Favorite</div>
                </div>
            </div>
        </>
    )
}