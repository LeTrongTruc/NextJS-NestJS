import { POST } from "@/components/common";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Body from "@/components/profile";
import { cookies } from 'next/headers';

async function LoadingData(token: string): Promise<any> {
    const data = await POST('/user/detail', {}, token)
    return data
}

async function LoadDataCategory(): Promise<any> {
    const data = await POST("/category/getCategoryForHome", {});
    return data;
  }

export default async function Profile() {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    const dataCategory = await LoadDataCategory();
    const requestDataUser = await LoadingData(token ? token?.value : '');
    return (<>
        <div className="bg-white">
            <div className="w-screen h-screen overflow-x-hidden">
                <Header dataUser={requestDataUser} dataCategory={dataCategory}></Header>
                <Body data={requestDataUser}></Body>
                <Footer></Footer>
            </div>
        </div>
    </>)
}