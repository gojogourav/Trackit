"use client"
import FollowUnfollowButton from '@/components/ui/followUnfollow';
import isFollowingUser from '@/helpers/isFollowing';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'

import { useRef } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";
import { AuroraBackground } from '@/components/ui/background';

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}



interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto?: string;
  isFollowing: boolean;
}





function Page() {
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users/getall", {
          method: "GET",
          credentials: 'include' // Include cookies for authentication
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }


    fetchUsers();
  }, []);

  const handleFollowToggle = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        credentials: 'include' // Include cookies for authentication
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      // Get the updated follow status from the response
      const result = await res.json();

      // Update the UI state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, isFollowing: result.isFollowing }
            : user
        )
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return (
    <div className=' mt-5 '   >
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center "
      >
        <h1 className="text-3xl md:text-7xl font-bold text-white text-center">Find People All Over The World</h1>
       <div className='mt-10 text-white text-3xl'>Loading...</div>
      </motion.div>
    </AuroraBackground>

</div>
  )
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=' mt-5 '   >
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center "
        >
          <h1 className="text-3xl md:text-7xl font-bold text-white text-center">Find People All Over The World</h1>
          <ul className='mt-10'>
            {users.map((user) => (
              <li
                key={user.id} className="p-4 mt-5 border border-neutral-500  rounded-xl mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) :
                    <User className='w-12 h-12 rounded-full object-cover text-gray-500 bg-white' />
                  }
                  <div className='p-5 h-auto'>
                    <p onClick={() => router.push(`/user/${user.username}`)} className="font-semibold cursor-pointer text-white">{user.name}</p>
                    <p onClick={() => router.push(`/user/${user.username}`)} className="text-sm text-neutral-400 cursor-pointer">@{user.username}</p>
                    <p onClick={() => router.push(`/user/${user.username}`)} className="text-sm text-neutral-400 cursor-pointer">{user.email}</p>
                  </div>
                </div>
                <div>
                  <FollowUnfollowButton userId={user.id} />
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </AuroraBackground>



    </div>
  );
}


export default Page;