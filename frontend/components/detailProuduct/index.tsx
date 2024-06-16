'use client'
import Image from "@/components/Image";
import { FaHome } from "react-icons/fa";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { FaSquare } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { useState } from "react";
import { useMyContext } from "../context";
import ModalLogin from "@/components/modals/ModalLogin";
import { POST } from "../common";
import { toast } from "react-toastify";

export default function Body({ dataProduct }: any) {
    const [loveProduct, setLoveProduct] = useState(dataProduct.loved);
    const { isLogin } = useMyContext();
    const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

    const handleLoveProduct = async () => {
        if (!isLogin) {
            return setIsOpenModalLogin(true);
        }
        setLoveProduct((item: any) => !item);
        const response = await POST('/loveProduct/loveProduct', { id: dataProduct.data._id });
        if (response.result) {
            if (response.data) {
                toast('Đã xoá sản phẩm khỏi danh sách yêu thích')
            } else toast('Đã thêm sản phẩm vào danh sách yêu thích')

        }
    };
    return (
        <>
            <div className="mt-5 flex justify-center w-full box-border">
                <div className="w-[1300px] px-10 overflow-hidden">
                    <div className="flex items-center gap-10">
                        <IoReturnDownBackSharp className="text-3xl"></IoReturnDownBackSharp>
                        <div className="flex gap-1 items-center">
                            <FaHome className="text-sm"></FaHome>
                            <div className="text-sm">Trang chủ</div>
                            <div className="text-sm">{dataProduct?.category?.parentData && `/ ${dataProduct.category.parentData} `}/ {dataProduct?.category?.name}</div>
                        </div>
                    </div>
                    <div className="w-full flex gap-5 mt-5">
                        <div className="w-1/2 relative h-[500px]">
                            <Image src={dataProduct?.data?.image} attribute={''}></Image>
                        </div>
                        <div className="w-1/2">
                            <div className="text-4xl font-semibold">{dataProduct?.data?.name}</div>

                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Mô tả: <span className="text-wrap font-normal text-base">{dataProduct?.data?.detail}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Quy cách: <span className="text-wrap font-normal text-base">{dataProduct?.data?.specification}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Tiêu chuẩn: <span className="text-wrap font-normal text-base">{dataProduct?.data?.standard}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Đơn vị: <span className="text-wrap font-normal text-base">{dataProduct?.data?.unit}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Số lượng: <span className="text-wrap font-normal text-base">{dataProduct?.data?.quantity}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-base text-[#6c9750] mt-4 flex items-start gap-4">
                                <div className="text-wrap font-semibold text-base mt-1 text-[#6c9750]">
                                    <FaSquare className="inline-block text-xs mb-1"></FaSquare>
                                    <span className="ml-4">
                                        Mã: <span className="text-wrap font-normal text-base">{dataProduct?.data?._id.toString()}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="border flex mt-4 justify-center gap-2 items-center bg-[#6c9750] py-4 text-xl font-semibold text-white cursor-pointer">
                                <FaHeart></FaHeart>
                                <div onClick={() => handleLoveProduct()}>{loveProduct ? 'Bỏ yêu thích' : 'Yêu thích sản phẩm'}</div>
                            </div>
                            <div className="flex items-center gap-3 mt-5">
                                <FiPhoneCall className="text-[#6c9750] text-3xl"></FiPhoneCall>
                                <div>
                                    <div>Gọi đặt hàng</div>
                                    <div className="text-[#6c9750]">098999999 <span className="text-black">(08h00 - 22h00)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalLogin
                isOpenModalLogin={isOpenModalLogin}
                setIsOpenModalLogin={setIsOpenModalLogin}
            ></ModalLogin>
        </>


    )
}