"use client"
import React, { useState, useEffect } from 'react'

interface FollowButtonProps {
  userId: string;
}

const FollowUnfollowButton = ({ userId }:FollowButtonProps) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`/api/users/follow/status/${userId}`, {
          method: "POST",
          credentials: 'include'
        });
        
        
        const data = await res.json()
        console.log("THIS IS DATA ",data.isFollowing);
        

        setFollowing(data.isFollowing);
        console.log("THIS IS ISFOLLOWING ",following);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [userId,following]);

  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        credentials: 'include'
      });
      
      const result = await res.json();
      setFollowing(result.isFollowing);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={handleFollowToggle}
        disabled={loading}
        className={`px-4 py-2 rounded transition-colors ${
          following
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}

export default FollowUnfollowButton;