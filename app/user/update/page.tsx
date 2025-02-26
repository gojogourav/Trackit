"use client";
import { useRef, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary'
import UpdateUserProfile from '@/components/ui/UpdateUserProfile';
import UploadPfp from '@/components/ui/UploadPfp';






  // name, username, email,password





export default function ImageUploader() {





  return (
    <div className='h-screen flex  grid-cols-3 content-center'>

    <div className=" items-center w-8/12 justify-around space-x-16  mx-auto my-auto p-8  flex bg-white rounded-lg shadow-md">

    
      <UploadPfp/>
      <UpdateUserProfile/>

    </div>
    </div>
  );
}