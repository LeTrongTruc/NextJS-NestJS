import Imagee from "@/components/Image";
import { useRouter } from 'next/navigation';

export default function CardSearch({ dataSearch }: any) {
    console.log("🚀 ~ CardSearch ~ dataSearch:", dataSearch)
    const router = useRouter();
    return (<>
        {dataSearch.length !== 0 && <div className="w-full h-[200px] border rounded absolute z-[9999] bg-white shadow-xl top-14 overflow-y-scroll">
            {
                dataSearch?.map((item: any) => (
                    <div key={1} className="w-full border rounded-sm px-5 py-2 flex gap-2 justify-center cursor-pointer hover:bg-slate-200" onClick={() => router.push(`/DetailProduct?id=${item._id}`)}>
                        <div className="w-full p-2 flex gap-2">
                            <div className="w-12 h-12 relative">
                                <Imagee src={item.image} attribute={'rounded-xl'}></Imagee>
                            </div>
                            <div className="text-left text-wrap" >
                                <div className="text-base font-medium">
                                    {item.name}
                                </div>
                                <div className="text-sm ">
                                    {item.quantity}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>}

    </>)
}