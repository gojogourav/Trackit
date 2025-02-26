import { useState, useEffect } from 'react'
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";
import FollowUnfollowButton from './followUnfollow';
import { User } from 'lucide-react'

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

const Profile = ({ username }: ProfileProps) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${username}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) return <div className="text-center p-4">Loading profile...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!user) return <div className="p-4">User not found</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <CardContainer className="inter-var w-full max-w-md">
                <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl p-6 border">
                    
                    
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
                </CardBody>
            </CardContainer>
        </div>
    );
}

export default Profile;