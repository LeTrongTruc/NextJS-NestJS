"use client";
import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";;
import { POST, getInfoFromToken } from "@/components/common";
import Cookies from "js-cookie";

interface MyContextType {
    isLogin: boolean,
    tabProfile: number,
    setTabProfile: React.Dispatch<React.SetStateAction<number>>,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
    setInfoUser: React.Dispatch<React.SetStateAction<any>>,
    setTabManage: React.Dispatch<React.SetStateAction<string>>,
    infoUser: any,
    tabManage: string
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [infoUser, setInfoUser] = useState<any>({});
    const [tabProfile, setTabProfile] = useState(0);
    const [tabManage, setTabManage] = useState('listUser');
    useEffect(() => {
        const callApi = async () => {
            const token = Cookies.get('token');
            if (token) {
                const request = await POST('/user/detail');
                if (request.result) {
                    setIsLogin(true);
                    setInfoUser(request.data)
                }
            }

        }
        callApi()
    }, []);

    return (
        <MyContext.Provider value={{ isLogin, tabProfile, setTabProfile, setIsLogin, setInfoUser, infoUser, setTabManage, tabManage }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = (): MyContextType => {
    const context = useContext(MyContext);
    if (!context)
        throw new Error("useMyContext must be used within a MyContextProvider");
    return context;
};