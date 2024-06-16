import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MyContextProvider } from "@/components/context/index";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });
import { Roboto } from 'next/font/google'

export const metadata = {
  title: "TFTF",
  description: "Generated by create next app",
};

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <MyContextProvider>
          {children}
          <ToastContainer></ToastContainer>
        </MyContextProvider>
      </body>
    </html>
  );
}
