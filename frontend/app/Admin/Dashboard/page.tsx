"use client";
import ManageUser from "@/components/admin/dashboard/ManageUser";
import ManageAdmin from "@/components/admin/dashboard/ManageAdmin";
import ManageCategory from "@/components/admin/dashboard/ManageCategory";
import ManageProduct from "@/components/admin/dashboard/ManageProduct";
import ImportXLSX from "@/components/admin/dashboard/ImportXLSX";
import SideBar from "@/components/admin/dashboard/sidebar";
import { useMyContext } from "@/components/context";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function DashboardAdmin() {
  const { tabManage } = useMyContext();
  console.log("🚀 ~ DashboardAdmin ~ tabManage:", tabManage);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="w-screen flex justify-between h-screen bg-[#f3f8fd]">
          <div className="w-[18%] ">
            <SideBar></SideBar>
          </div>
          <div className="w-[80%]">
            {tabManage == "listUser" && <ManageUser></ManageUser>}
            {tabManage == "listAdmin" && <ManageAdmin></ManageAdmin>}
            {tabManage == "listCategory" && <ManageCategory></ManageCategory>}
            {tabManage == "listProduct" && <ManageProduct></ManageProduct>}
            {tabManage == "importProduct" && <ImportXLSX></ImportXLSX>}
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}
