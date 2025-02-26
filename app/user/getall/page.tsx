"use client"
import FollowUnfollowButton from '@/components/ui/followUnfollow';
import isFollowingUser from '@/helpers/isFollowing';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'


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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-5 hover:cursor-pointer'  >
      <h1 className="text-2xl font-bold text-center my-10 mb-4">Find your Friends</h1>
      <ul>
        {users.map((user) => (
          <li 
          onClick={()=>router.push(`/user/${user.username}`)}
          key={user.id} className="p-4 border rounded mb-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user.profilePhoto && (
                <img 
                  src={user.profilePhoto} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
              <div>
                <FollowUnfollowButton userId={user.id}/>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;