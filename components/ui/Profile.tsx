import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import FollowUnfollowButton from './followUnfollow';
import { User } from 'lucide-react'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion';

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'



interface ProfileProps {
    username: string
}

interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePhoto?: string;
    bio?: string;
    isFollowing: boolean;
}


interface TimeLog {
    id: string
    sessionTime: number
    createdAt: string
    activity: {
        id: string
        activityTitle: string
    }
}

const ChartTooltip = ({ active, payload }: any) => {
    if (payload.length == 0) return
    if (!active || !payload) return null

    return (
        <div className="bg-background p-3 rounded-lg border shadow-sm">
            <p className="font-medium">{payload[0].payload.date || payload[0].payload.activity}</p>
            <p className="text-sm text-muted-foreground">
                {payload[0].value.toFixed(1)} hours
            </p>
        </div>
    )
}


const groupByPeriod = (data: TimeLog[], period: 'week' | 'month' | 'year') => {
    if (data.length == 0) return
    const grouped: { [key: string]: number } = {}

    data.forEach(log => {
        const date = new Date(log.createdAt)
        let key

        if (period === 'week') {
            key = format(date, 'yyyy-MM-dd')
        } else if (period === 'month') {
            key = format(date, 'yyyy-MM')
        } else {
            key = format(date, 'yyyy')
        }

        grouped[key] = (grouped[key] || 0) + log.sessionTime
    })

    return Object.entries(grouped).map(([date, total]) => ({
        date,
        total: total / 3600
    }))
}
const groupByActivity = (data: TimeLog[]) => {

    const grouped: { [key: string]: number } = {}

    data.forEach(log => {
        const activity = log.activity.activityTitle
        grouped[activity] = (grouped[activity] || 0) + log.sessionTime
    })
    return Object.entries(grouped).map(([activity, total]) => ({
        activity,
        total: total / 3600
    }))
}


const Profile = ({ username }: ProfileProps) => {
    const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week')
    const [timeLogs, setTimeLogs] = useState<TimeLog[]>([])
    const [isFollowing, setIsFollowing] = useState(false)
    // const [username,setUsername] = useState(username)

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let timelogs = [];
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Usernameee 234",username);
                
                const res = await fetch(`/api/users/${username}`, {
                    method: "GET",
                    credentials: 'include'
                });


                if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
                const data = await res.json();
                setUser(data);
            } catch (error) {
                // console.error("Fetch error:", error);
                // setError(error instanceof Error ? error.message : "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/${username}/get-user-timelog`, {
                    method: "GET"
                })

                const data = await response.json()

                console.log(data);


                timelogs = data.timelog
                setTimeLogs(timelogs)
                console.log(timelogs.length);

            } catch (error) {
                // console.error("Error fetching timelogs", error)
                // setTimeLogs([])
            }
        }

        const fetchIsFollowing = async () => {
            try {
                console.log("USERNAMEE #$$",username);
                
                const res = await fetch(`/api/users/follow/status/${username}`,{method:"POST"})

                const data = await res.json();
                setIsFollowing(data.isFollowing)

            } catch (error) {
                // setIsFollowing(false)
                // console.error(error);
            }
        }

        fetchUser();
        fetchData();
        fetchIsFollowing();
    }, [username]);

    if (loading) return <div className="text-center p-4">Loading profile...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!user) return <div className="p-4">User not found</div>;



    const activityData = groupByActivity(timeLogs)
    const periodData = groupByPeriod(timeLogs, timePeriod)




    return (
        <div className=" flex-col items-center justify-center w-full">
            <div className="inter-var w">
                <div className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl p-6 border">
                    <div className="flex flex-col gap-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                            <div className="shrink-0">
                                {user.profilePhoto ? (
                                    <Image
                                        src={user.profilePhoto}
                                        alt={user.name}
                                        width={96}
                                        height={96}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-20 h-20 text-black" />
                                )}
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                                    {user.name}
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    @{user.username}
                                </p>
                            </div>

                        </div>

                        {/* Bio Section */}
                        {user.bio && (
                            <div className="text-neutral-600 dark:text-neutral-300">
                                <p>{user.bio}</p>
                            </div>
                        )}

                        {/* Action Section */}
                        <div className="flex justify-between items-center mt-4">
                            <FollowUnfollowButton
                                userId={user.id}

                            />
                            <Link
                                href="/"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>



                    {!isFollowing ? (
                        <div className='text-neutral-600 text-sm mt-10 bg-blue-200 p-2 rounded-2xl w-96'>
                            Follow this user to see their stats
                        </div>

                    )
                        : 
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="w-full   "
                            >
                                <div className=" justify-between w-full text-black ">
                                    <div className="flex justify-between items-center mt-10">
                                        <h2 className="text-2xl font-bold  text-foreground text-neutral-600">Time Analytics</h2>
                                        <Select value={timePeriod} onValueChange={(v: any) => setTimePeriod(v)}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="week">Weekly</SelectItem>
                                                <SelectItem value="month">Monthly</SelectItem>
                                                <SelectItem value="year">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-24 mt-10">
                                    <div className="flex-1 h-[300px] w-[300px]">
                                        <div className="text-neutral-600">Time Logged ({timePeriod})</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={periodData!}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(date) =>
                                                        format(new Date(date), timePeriod === 'week' ? 'MMM dd' : 'MMM yyyy')
                                                    }
                                                    className="text-muted-foreground"
                                                />
                                                <YAxis className="text-muted-foreground" />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="total"
                                                    stroke="hsl(var(--primary))"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-[300px] h-[300px]">
                                        <div className='text-neutral-600'>Activity Breakdown</div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={activityData!}
                                                    dataKey="total"
                                                    nameKey="activity"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={120}
                                                    innerRadius={80}
                                                    paddingAngle={2}
                                                >
                                                    {activityData?.map((_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            className="stroke-background stroke-2"
                                                            fill={`hsl(var(--${['primary', 'secondary', 'destructive', 'warning', 'accent'][index % 5]
                                                                }))`}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<ChartTooltip />} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                            </motion.div>


                        
                    }
                </div>
            </div>
        </div>
    );
}

export default Profile;