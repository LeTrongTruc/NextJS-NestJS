import { FaCopyright } from "react-icons/fa";

export default function Footer() {
    return (<>
        <div className="w-full h-[300px] bg-black mt-10 flex justify-center items-center gap-1">
                <FaCopyright className="text-white"></FaCopyright>
                <div className="text-white">Copyright 2024</div>
        </div>
    
    </>)
}