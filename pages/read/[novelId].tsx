import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useNovel from '@/hooks/useNovel'
import { BsArrowLeftSquareFill, BsPersonSquare } from 'react-icons/bs'
import { Footer } from '@/components'

const Read = () => {
   const router = useRouter();
   const { novelId } = router.query;
   const { data } = useNovel(novelId as string);

   return (
      <div className="w-screen bg-[#121212]">
         {/* Top Navigation */}
         <div className="fixed w-full px-24 z-10 flex flex-col justify-between gap-8 bg-black bg-opacity-70">
            <nav className="flex flex-row justify-between">
               <div className="flex flex-row justify-center px-12 py-5 gap-2 cursor-pointer" onClick={() => router.push('/')}>
                  <BsArrowLeftSquareFill size={28} onClick={() => router.push('/')} className="text-white cursor-pointer" />
                  <span className="text-white text-xl font-semibold">Novel Preview:{" "}</span>          
               </div>
               <div className="flex px-7 py-5 gap-2 cursor-pointer" onClick={() => router.push('/auth')}>
                  <span className="text-white text-xl font-semibold">Read the rest</span>
                  <BsPersonSquare size={28} className="text-white" />
               </div>
            </nav>
         </div>
         {/* Preview */}
         <div className="pt-24 px-36 text-justify">
            <p className="text-green-400 text-1xl md:text-3xl font-bold">{data?.title}</p><br /> 
            <div className="text-white text-base font-serif">
               {data?.preview}...
            </div>
            <div className="h-[50px] text-center pt-12 pb-16">
               <p className="text-white text-xl uppercase">To Read the rest of this novel, {" "}
               <Link href={{ pathname: '/auth', query: { variant: 'register' } }}><span className="text-red-500">Create</span></Link> or {" "}
               <Link href={{ pathname: '/auth', query: { variant: 'login' } }}><span className="text-red-500">login</span></Link> to your account. <br/> It takes 10 seconds and it is 100% free!</p>
            </div>
         </div>
         {/* Footer */}
         <div className="flex items-center justify-center">
            <div className="container h-full mx-auto xl:px-30 max-w-6xl pt-6">
               <Footer bgLight={false} />
            </div>
         </div>
      </div>
   )
}

export default Read