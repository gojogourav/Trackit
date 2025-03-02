'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
function TopBar() {

    const pathname = usePathname()

  return (
    <div>

        <div className='top-0 p-3 mb-0  text-white font-bold bg-black items-center content-center justify-around w-full flex text-center
            font-sans text-lg 
        '>
            
            <Link href='/'  className={`text-xl cursor-pointer hover:text-yellow-300 ${pathname==='/'?`text-yellow-300`:''}`} >
                Time Tracker
            </Link>
            <div className='lg:flex text-lg md:flex justify-between space-x-8 hidden  '>
                
                <Link href='/pomodoro' className={`cursor-pointer hover:text-yellow-300 ${pathname==='/pomodoro'?`text-yellow-300`:''}`}>
    
                Quick Pomodoro
                </Link>
                
                <Link href='/session' className={`cursor-pointer hover:text-yellow-300 ${pathname==='/session'?`text-yellow-300`:''}`}>
    
                Session
                </Link>
                <Link href='/activity' className={`cursor-pointer hover:text-yellow-300 ${pathname==='/activity'?`text-yellow-300`:''}`}>
    
                Activity
                </Link>
                <Link href='/leaderboard' className={`cursor-pointer hover:text-yellow-300 ${pathname==='/leaderboard'?`text-yellow-300`:''}`}>
    
                LeaderBoard
                </Link>
                <Link href='/user/getall' className={`cursor-pointer hover:text-yellow-300 ${pathname==='/profile'?`text-yellow-300`:''}`}>
    
                Profile
                </Link>
            </div>
    
        </div>
    </div>
  )
}

export default TopBar