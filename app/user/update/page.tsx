"use client";

import UpdateUserProfile from '@/components/ui/UpdateUserProfile';
import UploadPfp from '@/components/ui/UploadPfp';






  // name, username, email,password





export default function ImageUploader() {





  return (
    <div className=' absolute  inset-0 overflow-hidden h-screen w-full flex  grid-cols-3 content-center object-contain'>

    <div className="insert items-center  justify-around space-x-16  mx-auto my-auto p-8  flex bg-white rounded-lg shadow-md">

    
      <UploadPfp/>
      <UpdateUserProfile/>

    </div>
    </div>
  );
}