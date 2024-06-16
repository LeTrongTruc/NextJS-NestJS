import { POST, getInfoFromTokenServerSide } from "@/components/common";
import Body from "@/components/home/body";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Image from "next/image";
import { cookies } from "next/headers";

async function LoadingData(token: string): Promise<any> {
  const data = await POST("/user/detail", {}, token);
  return data;
}

async function LoadData(token: string): Promise<any> {
  const data = await POST("/product/getListProduct", {}, token);
  return data;
}

async function LoadDataCategory(): Promise<any> {
  const data = await POST("/category/getCategoryForHome", {});
  return data;
}

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const requestDataUser = await LoadingData(token ? token?.value : "");
  const data = await LoadData(token ? token?.value : "");
  const dataCategory = await LoadDataCategory();

  return (
    <div className="bg-[#f8f8f8]">
      <div className="w-screen h-screen overflow-y-auto">
        <div className="w-full fixed z-50 bg-white">
          <Header dataUser={requestDataUser} dataCategory={dataCategory}></Header>
        </div>
        <div className="mt-[220px] bg-[#f8f8f8]">
          <Body data={data}></Body>
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
