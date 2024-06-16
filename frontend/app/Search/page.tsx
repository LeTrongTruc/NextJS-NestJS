import { POST, getInfoFromTokenServerSide } from "@/components/common";
import Body from "@/components/search/body";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function LoadingData(token: string): Promise<any> {
    const data = await POST("/user/detail", {}, token);
    return data;
}

async function LoadData(token: string, category: string, query: string): Promise<any> {
    const data = await POST("/product/getListProduct", { category, query }, token);
    return data;
}

async function LoadDataCategory(): Promise<any> {
    const data = await POST("/category/getCategoryForHome", {});
    return data;
}

export default async function Search({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {

    let category = searchParams.category;
    const query = searchParams.query;
    console.log("🚀 ~ query:", query)
    if (!category && !query) {
        redirect('/404')
    }

    const cookieStore = cookies();
    const token = cookieStore.get("token");

    const requestDataUser = await LoadingData(token ? token?.value : "");
    const data = await LoadData(token ? token?.value : "", category, query);
    const dataCategory = await LoadDataCategory();

    if (!category) {
        category = `${query}`
    }
    return (
        <div className="bg-[#f8f8f8]">
            <div className="w-screen h-screen overflow-y-auto">
                <div className="w-full fixed z-50 bg-white">
                    <Header dataUser={requestDataUser} dataCategory={dataCategory}></Header>
                </div>
                <div className="mt-[200px] bg-[#f8f8f8]">
                    <div className="min-h-80">
                        <Body data={data} category={category}></Body>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </div>
    );
}
