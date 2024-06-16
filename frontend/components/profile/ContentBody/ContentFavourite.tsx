import Imagee from "@/components/Image";
import React, { useEffect, useState } from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { MdOutlineFavorite } from "react-icons/md";
import { POST } from "@/components/common";
import { toast } from "react-toastify";

export default function ContentFavourite() {
    const [current, setCurrent] = useState(1);
    const [count, setCount] = useState();
    const [data, setData] = useState<any>([]);
    const router = useRouter();

    const onChange: PaginationProps['onChange'] = (page) => {
        setCurrent(page);
    };

    const getListLoveProduct = async () => {
        const res = await POST('/loveProduct/getListLoveProduct', { skip: (current - 1) * 3, limit: 3 });
        if (res) {
            setData(res.data);
            setCount(res.count);
        }
    }

    useEffect(() => {
        getListLoveProduct()
    }, [current])


    const handleLoveProduct = async (id: string) => {
        const response = await POST('/loveProduct/loveProduct', { id });
        if (response.result) {
            if (response.data) {
                toast('Đã xoá sản phẩm khỏi danh sách yêu thích')
            }
        }
        getListLoveProduct()

    };

    return (<>
        <div className="w-[70%] flex  gap-5 flex-col justify-center items-center">
            <div className="text-2xl font-semibold">Sản phẩm đã yêu thích</div>
            <div className="border w-[95%]">
                {
                    data?.map((item: any) => (
                        <>
                            <div key={1} className="w-full border rounded-sm px-5 py-2 flex gap-2 justify-center">
                                <div className="w-full px-5 py-2 flex gap-2">
                                    <div className="w-20 h-20 relative">
                                        <Imagee src={item.product.image} attribute={'rounded-xl'}></Imagee>
                                    </div>
                                    <div className="text-left text-wrap" onClick={() => router.push(`/DetailProduct?id=${41221312}`)}>
                                        <div className="text-lg font-semibold">
                                            {item.product.name}
                                        </div>
                                        <div className="text-sm ">
                                            {item.product.unit}
                                        </div>
                                    </div>
                                </div>
                                <MdOutlineFavorite className="text-3xl mt-3 text-red-500 cursor-pointer" onClick={() => handleLoveProduct(item.product._id)}></MdOutlineFavorite>
                            </div>
                        </>
                    ))
                }
            </div>
            <Pagination current={current} onChange={onChange} total={count} pageSize={3}/>;

        </div>
    </>)
}