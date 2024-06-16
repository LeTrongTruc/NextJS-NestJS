"use client";
import Image from "@/components/Image";
import { useState } from "react";
import { MdFavorite } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import ModalLogin from "@/components/modals/ModalLogin";
import { useMyContext } from "@/components/context";
import { useRouter } from "next/navigation";
import { POST } from "@/components/common";
import { toast } from "react-toastify";

const ItemProduct = ({ data }: any) => {
  const { isLogin } = useMyContext();
  const router = useRouter();
  const [hovered, setHovered] = useState<boolean>(false);
  const [isLove, setIsLove] = useState<boolean>(data.loved || false);
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

  const handleLoveProduct = async () => {
    if (!isLogin) {
      return setIsOpenModalLogin(true);
    }
    setIsLove((item) => !item);
    const response = await POST('/loveProduct/loveProduct', { id: data._id });
    if (response.result) {
      if (response.data) {
        toast('Đã xoá sản phẩm khỏi danh sách yêu thích')
      } else toast('Đã thêm sản phẩm vào danh sách yêu thích')

    }
  };
  return (
    <>
      <div className="w-[24%] hover:bg-slate-100 flex justify-center flex-col items-center p-5 mt-10 cursor-pointer bg-white border rounded-2xl">
        <div
          className="h-[300px] relative w-full hover:scale-[1.05] transition duration-300"
          onClick={() => router.push(`/DetailProduct?id=${data._id}`)}
        >
          <Image src={data.image} attribute={"rounded-xl"}></Image>
        </div>
        <div className="flex w-full mt-5">
          <div
            className="w-full text-left text-wrap font-semibold text-xl"
            onClick={() => router.push(`/DetailProduct?id=${data._id}`)}
          >
            {data.name}
          </div>

          <div
            className="text-3xl cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => handleLoveProduct()}
          >
            {hovered || isLove ? (
              <MdFavorite className="text-red-500" />
            ) : (
              <IoMdHeartEmpty />
            )}
          </div>
        </div>
        <div
          className="w-full text-left"
          onClick={() => router.push(`/DetailProduct?id=${data._id}`)}
        >
          {data.unit}
        </div>
        <ModalLogin
          isOpenModalLogin={isOpenModalLogin}
          setIsOpenModalLogin={setIsOpenModalLogin}
        ></ModalLogin>
      </div>
    </>
  );
};
export default ItemProduct;
