"use client"
import { AuroraBackground } from '@/components/ui/background';
import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Check, ChevronsUpDown, Plus, Clock, List } from "lucide-react"
import { CldImage } from 'next-cloudinary';

interface Activity {
  id: string
  activityTitle: string
  description?: string
  createdAt: string
  value: string
  label: string
}

function Page() {
  const [open, setOpen] = useState(false)
  const [timer, setTimer] = useState(25 * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [isLongBreak, setIsLongBreak] = useState(false)
  const [paused, setPaused] = useState(true)
  const [workDuration, setWorkDuration] = useState(25 * 60)
  const [breakDuration, setBreakDuration] = useState(5 * 60)
  const [longBreakDuration, setLongBreakDuration] = useState(10 * 60)
  const [showSettings, setShowSettings] = useState(false)
  const [activityId, setActivityId] = useState("")
  const [notes, setNotes] = useState("")
  const [sessionPhoto, setSessionPhoto] = useState("")
  const [error, setError] = useState("")
  const [activities, setActivities] = useState<Activity[]>([])



  const [file,setFile] = useState<File|null>(null);
  const [fileUrl,setFileUrl] = useState('');
  const [loading,setIsLoading] = useState(false);
  const [imageUrl,setImageUrl] = useState('')
  
  // New state for managing popups
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [isSelectActivityOpen, setIsSelectActivityOpen] = useState(false)
  const [isTimelogDialogOpen, setIsTimelogDialogOpen] = useState(false)
  const [newActivityTitle, setNewActivityTitle] = useState("")
  const [newActivityDescription, setNewActivityDescription] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities/get-joined-activity",{method:"GET"})
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Received non-JSON response')
      }

      const body = await res.json()
      
      setActivities(body.activities)
    } catch (error: any) {
      console.error("Fetch error:", error)
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${secs}`
  }

  useEffect(() => {
    if (paused) {
      if (isLongBreak) {
        setTimer(longBreakDuration)
      } else if (isBreak) {
        setTimer(breakDuration)
      } else {
        setTimer(workDuration)
      }
    }
  }, [paused, isBreak, isLongBreak, workDuration, breakDuration, longBreakDuration])

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          if (isLongBreak) {
            setIsLongBreak(false)
            setIsBreak(false)
            setTimer(workDuration)
          } else if (isBreak) {
            setIsBreak(false)
            setIsLongBreak(false)
            setTimer(workDuration)
          } else {
            setIsBreak(true)
            setTimer(breakDuration)
            setIsTimelogDialogOpen(true) // Open timelog dialog when work session ends
          }
          setPaused(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [paused, isBreak, isLongBreak, breakDuration, workDuration, longBreakDuration])




  const uploadTimelog = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      // Validate inputs
      if (!activityId) {
        setError("Please select an activity")
        return
      }
  
      if (!file) {
        setError("Please select a valid file")
        return
      }
      
      if (!notes.trim()) {
        setError("Please add some notes about your session")
        return
      }
  
      setError('')
      setIsLoading(true)
      
      // Step 1: Upload the image to Cloudinary
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', 'session')
  
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
  
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Image upload failed')
      }
  
      const uploadData = await uploadResponse.json()
      const SessionPhoto = uploadData.url
      
      // Step 2: Create the timelog entry with the image URL
      const timelogResponse = await fetch('/api/timelog/add-timelog', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sessionTime: workDuration, 
          activityId, 
          notes, 
          SessionPhoto
        })
      })
      console.log("THIS IS SESSIONPHOTO URL",sessionPhoto);
      
  
      if (!timelogResponse.ok) {
        const errorData = await timelogResponse.json()
        throw new Error(errorData.error || 'Failed to submit timelog')
      }
  
      console.log("Time logged successfully")
      
      // Reset form and close dialog
      setNotes("")
      setFile(null)
      setFileUrl("")
      setIsTimelogDialogOpen(false)
    } catch (error: any) {
      console.error("Submission error:", error)
      setError(error.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetTimer = () => {
    setPaused(true)
    setIsBreak(false)
    setIsLongBreak(false)
    setTimer(workDuration)
  }

  const addNewActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!newActivityTitle.trim()) {
        setError("Activity title is required")
        return
      }

      const res = await fetch('/api/activities/create-activity', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          activityTitle: newActivityTitle,
          description: newActivityDescription 
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create activity')
      }

      console.log("Activity created successfully")
      // Reset form and refresh activities
      setNewActivityTitle("")
      setNewActivityDescription("")
      setIsAddActivityOpen(false)
      fetchActivities()
    } catch (error: any) {
      console.error("Submission error:", error)
      setError(error.message)
    }
  }

  const selectActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setActivityId(activity.id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if(!selectedFile) console.log("THERE IS NO FUCKING SELECTEDFILE");
    
    console.log("THIS IS THE SELECTED FILE",selectedFile);
    if(!selectedFile) return;
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Invalid file type. Please upload JPEG, PNG, or WEBP.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }

      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile)
      setFileUrl(fileUrl)
      setError('');
    }
  };



  return (
    <div className='flex items-center justify-center h-screen'>
      <div className=' w-full '>
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="relative flex flex-col gap-4 items-center justify-center"
          >
            {/* Activity Management Buttons */}
            <div className="flex space-x-4 mb-4">
              <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-white bg-transparent border-white">
                    <Plus size={16} />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Activity</DialogTitle>
                    <DialogDescription>
                      Create a new activity to track with your Pomodoro timer.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addNewActivity} className="space-y-4 pt-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                      <label htmlFor="activityTitle" className="block mb-1 font-medium">
                        Activity Title
                      </label>
                      <input
                        id="activityTitle"
                        type="text"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        placeholder="Enter activity title"
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block mb-1 font-medium">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        value={newActivityDescription}
                        onChange={(e) => setNewActivityDescription(e.target.value)}
                        placeholder="Enter description"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddActivityOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Activity</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isSelectActivityOpen} onOpenChange={setIsSelectActivityOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-white  border-white bg-transparent">
                    <List size={16} />
                    Select Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Activity</DialogTitle>
                    <DialogDescription>
                      Choose an activity for your current Pomodoro session.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {activities.length === 0 ? (
                      <p className="text-center text-gray-500">
                        No activities found. Add a new activity first.
                      </p>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {activities.map((activity) => (
                          <div 
                            key={activity.id} 
                            className={`p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-100 ${
                              activityId === activity.id ? 'border-teal-500 bg-teal-50' : ''
                            }`}
                            onClick={() => selectActivity(activity)}
                          >
                            <div className="font-medium">{activity.activityTitle}</div>
                            {activity.activityTitle && (
                              <div className="text-base text-gray-500">{activity.activityTitle}</div>
                            )}
                            {activity.description && (
                              <div className="text-sm text-gray-500">{activity.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsSelectActivityOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setIsSelectActivityOpen(false)}
                        disabled={!activityId}
                      >
                        Confirm Selection
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Current Activity Display */}
            {selectedActivity && (
              <div className=" text-teal-300 border border-teal-300 p-2 px-4 rounded-full  mb-4">
                <span className="font-medium bg-transparent">Current Activity:</span> {selectedActivity.activityTitle}
              </div>
            )}

            <div className='border border-neutral-300 px-20 py-20 rounded-xl'>
              <div className='space-x-5 flex justify-center mb-10'>
                <button
                  className='p-5 text-sm rounded-xl bg-green-500 text-white'
                  onClick={() => {
                    setIsBreak(false)
                    setIsLongBreak(false)
                    setTimer(workDuration)
                    setPaused(true)
                  }}
                >
                  Work
                </button>
                <button
                  className='p-5 text-sm rounded-xl bg-blue-500 text-white'
                  onClick={() => {
                    setIsBreak(true)
                    setIsLongBreak(false)
                    setTimer(breakDuration)
                    setPaused(true)
                  }}
                >
                  Break
                </button>
                <button
                  className='p-5 text-sm rounded-xl bg-blue-700 text-white'
                  onClick={() => {
                    setIsLongBreak(true)
                    setIsBreak(false)
                    setTimer(longBreakDuration)
                    setPaused(true)
                  }}
                >
                  Long Break
                </button>
              </div>

              <div className='text-center mb-10 text-xl font-medium text-white'>
                {isLongBreak ? "Long Break Time!" :
                 isBreak ? "Short Break Time!" : "Work Time!"}
              </div>

              <h1 className='font-bold text-9xl text-center text-white'>
                {formatTime(timer)}
              </h1>

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

              <div
                className='text-white mt-5 text-center cursor-pointer'
                onClick={() => setShowSettings(!showSettings)}
              >
                {!showSettings ? "▼ Show Settings" : "▲ Hide Settings"}
              </div>

              {showSettings && (
                <div className="mt-4 space-y-4">
                  <div className='text-white space-y-2'>
                    <div>
                      Work Duration (minutes):
                      <input
                        type="number"
                        className='w-28 ml-2 text-center bg-transparent text-white border'
                        value={workDuration / 60}
                        onChange={(e) => setWorkDuration(Number(e.target.value) * 60)}
                        min={1}
                      />
                    </div>
                    <div>
                      Break Duration (minutes):
                      <input
                        type="number"
                        className='w-28 ml-2 text-center bg-transparent text-white border'
                        value={breakDuration / 60}
                        onChange={(e) => setBreakDuration(Number(e.target.value) * 60)}
                        min={1}
                      />
                    </div>
                    <div>
                      Long Break Duration (minutes):
                      <input
                        type="number"
                        className='w-28 ml-2 text-center bg-transparent text-white border'
                        value={longBreakDuration / 60}
                        onChange={(e) => setLongBreakDuration(Number(e.target.value) * 60)}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div onClick={()=>setIsTimelogDialogOpen(!isTimelogDialogOpen)} className='text-white text-center mt-5 border p-2 cursor-pointer '>This is timelog upload</div>
            </div>


            <Dialog open={isTimelogDialogOpen} onOpenChange={setIsTimelogDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Session Complete</DialogTitle>
                  <DialogDescription>
                    Log your completed work session.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={uploadTimelog} className="space-y-4 pt-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div>
                    <label className="block mb-1 font-medium">
                      Activity
                    </label>
                    <div className="p-3 border rounded-md">
                      {selectedActivity ? (
                        <div>
                          <div className="font-medium">{selectedActivity.activityTitle}</div>
                          {selectedActivity.description && (
                            <div className="text-sm text-gray-500">{selectedActivity.description}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-500">
                          No activity selected. Please select an activity before logging time.
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block mb-1 font-medium">
                      Session Notes
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What did you accomplish in this session?"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Image
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-md"
                            accept="image/jpeg, image/png, image/webp"
                            required
                        />
                    </div>
                    {file ? <div className="relative" >
                        <CldImage
                            height={500}
                            width={500}
                            crop='fill'
                            gravity='face'
                            src={fileUrl}
                            alt="Social media preview"
                            className="rounded-lg border"
                        />
                    </div> :
                        <div className="p-3 text-sm rounded-md   bg-red-100 text-red-800">
                            Select a image

                        </div>
                    }


                    {/* <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Uploading...' : 'Upload new profile pic'}
                    </button> */}

                
                  </div>
                  <div className="font-medium">
                    Session Duration: {formatTime(workDuration)}
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsTimelogDialogOpen(false)}
                    >
                      Skip
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!activityId}
                    >
                      Log Session
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </AuroraBackground>
      </div>
    </div>
  )
}

export default Page