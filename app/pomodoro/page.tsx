"use client"
import React, { useEffect, useState } from 'react'

function Page() {
    const [timer, setTimer] = useState(25 * 60);
    const [isBreak, setIsBreak] = useState(false);
    const [isLongBreak, setIsLongBreak] = useState(false);
    const [paused, setPaused] = useState(true);
    const [workDuration] = useState(25 * 60);
    const [breakDuration] = useState(5 * 60);
    const [longBreakDuration] = useState(10 * 60);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    }

    useEffect(() => {
        if (paused) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    // Handle timer completion
                    if (isLongBreak) {
                        setIsLongBreak(false);
                        setIsBreak(false);
                        setTimer(workDuration);
                    } else if (isBreak) {
                        setIsBreak(false);
                        setIsLongBreak(false);
                        setTimer(workDuration);
                    } else {
                        setIsBreak(true);
                        setTimer(breakDuration);
                    }
                    setPaused(true);
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [paused, isBreak, isLongBreak]);

    const resetTimer = () => {
        setPaused(true);
        setIsBreak(false);
        setIsLongBreak(false);
        setTimer(workDuration);
    };

    const handleWork = () => {
        setIsBreak(false);
        setIsLongBreak(false);
        setTimer(workDuration);
        setPaused(true);
    };

    const handleBreak = () => {
        setIsBreak(true);
        setIsLongBreak(false);
        setTimer(breakDuration);
        setPaused(true);
    };

    const handleLongBreak = () => {
        setIsLongBreak(true);
        setIsBreak(false);
        setTimer(longBreakDuration);
        setPaused(true);
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='border border-black px-20 py-20 rounded-xl'>
                
                <div className='space-x-5 flex justify-center mb-10'>
                    <button 
                        className='p-5 text-sm rounded-xl bg-green-500 text-white' 
                        onClick={handleWork}
                    >
                        Work
                    </button>
                    <button 
                        className='p-5 text-sm rounded-xl bg-blue-500 text-white' 
                        onClick={handleBreak}
                    >
                        Break
                    </button>
                    <button 
                        className='p-5 text-sm rounded-xl bg-blue-700 text-white' 
                        onClick={handleLongBreak}
                    >
                        Long Break
                    </button>
                </div>
                <div className='text-center mb-10 text-xl font-medium'>
                    {isLongBreak ? "Long Break Time!" : isBreak ? "Short Break Time!" : "Work Time!"}
                </div>
                <h1 className='font-bold text-9xl text-center'>{formatTime(timer)}</h1>

                <div className='justify-between flex mt-5'>
                    <button 
                        className='p-5 rounded-xl w-36 bg-yellow-400 text-white' 
                        onClick={() => setPaused(!paused)}
                    >
                        {paused ? "Start" : "Pause"}
                    </button>
                    <button 
                        className='p-5 rounded-xl w-36 bg-red-500 text-white' 
                        onClick={resetTimer}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page;