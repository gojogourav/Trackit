"use client"

import React, { useEffect, useState } from 'react'
import Profile from '@/components/ui/Profile'

function UserPage() {
    const [username,setUsername] = useState<string>('')
    useEffect(()=>{
        const currentUser = async()=>{
            try{
                const res = await fetch('/api/users/current-user',{method:"GET"})
                const user = await res.json()
                console.log("THIS IS USERNAME IN THE BASE USER URL ",user.username);
                setUsername(user.username)
            }catch(error){
                console.error(error);
            }
        }
        currentUser();
    },[])
  return (
    <div className='text-white h-screen items-center flex justify-center '>
            {/* {username} */}
        <Profile username={username} />
    </div>
  )
}

export default UserPage