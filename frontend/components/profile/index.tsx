'use client';
import SideBar from "./SideBar";
import ContentMyInfo from "./ContentBody/ContentMyInfo";
import ContentChangePassword from "./ContentBody/ContentChangePassword";
import { useState } from "react";
import { useMyContext } from "@/components/context";
import ContentFavourite from "./ContentBody/ContentFavourite";
import { toast } from "react-toastify";
import { redirect } from 'next/navigation';

export default function Profile({ data }: any) {
    const { tabProfile } = useMyContext();
    if (!data || !data.result) {
        toast('Có lỗi xảy ra');
        redirect('/')
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="w-[1300px] flex px-10">
                    <SideBar></SideBar>
                    {tabProfile == 0 && <ContentMyInfo data={data}></ContentMyInfo>}
                    {tabProfile == 1 && <ContentChangePassword></ContentChangePassword>}
                    {tabProfile == 2 && <ContentFavourite></ContentFavourite>}
                </div>
            </div>
        </>
    )
}