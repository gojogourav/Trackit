"use client"
import Profile from '@/components/ui/Profile'
import { User, Clock, Trophy } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from '@/components/ui/background'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";

interface Data {
    userId: string,
    _sum: { time: number },
    user: {
        username: string,
        name: string,
        profilePhoto: string
    }
}


function Leaderboard() {
    const router = useRouter();
    const [data, setData] = useState<Data[]>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchLeaderBoard = async () => {
        try {
            const res = await fetch("/api/timelog/leaderboard");
            const data = await res.json();
            setData(data[0]);
            
            console.log(data);
            
        } catch (error: any) {
            console.error(error);
            setError(error.toString())
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchLeaderBoard(); }, [])

    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl px-4  sm:px-6 lg:px-8 py-12"
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3"
                        >
                            <Trophy className="w-12 h-12 text-amber-400" strokeWidth={1.5} />
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent">
                                Study Champions
                            </h1>
                        </motion.div>
                        <p className="text-gray-300/90 text-lg">Top contributors in focused hours</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="h-8 w-8 border-4 border-white/30 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-900/20 rounded-xl border border-red-400/50 text-red-200 text-center">
                            {error}
                        </div>
                    ) : (
                        <AnimatePresence>
                            <div className="space-y-4">
                                {data.map((userWorks, index) => (

                                        <div key={userWorks.userId}   onClick={() => router.push(`/user/${userWorks.user.username}`)}
                                        className="cursor-pointer bg-black flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl">


                                            <div className=" flex items-center gap-4 flex-1">
                                                <div 
                                                    className=" "
                                                >
                                                    <div className="  cursor-pointer"  onClick={() => router.push(`/user/${userWorks.user.username}`)}/>
                                                    {userWorks.user.profilePhoto ? (
                                                        
                                                        <Image
                                                            src={userWorks.user.profilePhoto}
                                                            alt="THIS IS PROFILE PHOTO"
                                                            width={80}
                                                            height={80}
                                                            className="rounded-xl border-2  border-white/10 group-hover:border-white/20 transition-all"
                                                        />
                                                    ) : (
                                                        <div className="p-4 rounded-xl bg-gray-800 border-2 border-white/10">
                                                            <User className="w-12 h-12 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1" onClick={() => router.push(`/user/${userWorks.user.username}`)}>
                                                    <h2 onClick={() => router.push(`/user/${userWorks.user.username}`)} className="text-xl font-semibold text-white">
                                                        {userWorks.user.name}
                                                        <span onClick={() => router.push(`/user/${userWorks.user.username}`)} className="ml-2 text-sm text-gray-400">
                                                            @{userWorks.user.username}
                                                        </span>
                                                    </h2>
                                                    <div onClick={() => router.push(`/user/${userWorks.user.username}`)} className="flex items-center gap-2 text-gray-300">
                                                        <Clock className="w-4 h-4" />
                                                        <span onClick={() => router.push(`/user/${userWorks.user.username}`)} className="text-sm">
                                                            {(userWorks._sum.time / 3600).toFixed(1)} focused hours
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 ml-4" >
                                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </div>
                                    
                                ))}
                            </div>
                        </AnimatePresence>
                    )}
                </motion.div>
            </motion.div>
        </AuroraBackground>
    )
}

export default Leaderboard