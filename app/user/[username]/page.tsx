"use client"
import Profile from '@/components/ui/Profile'
import { useParams } from 'next/navigation'
import React from 'react'

function ProfilePage() {
  const username= useParams().username?.toString();
  console.log(username);
  
  return (
    <div className='flex items-center justify-center h-screen'>
        <Profile username={username!} />
    </div>
  )
}

export default ProfilePage