"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CldUploadWidget } from 'next-cloudinary';

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../../../components/ui/3d-card"




const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string(),
  email: z.string().email(),
  profilePhoto: z.string(),
  password: z.string()
})



function UpdateUser() {
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      profilePhoto: "",
      password: ""
    },
  })

  
  function onSubmit(values: z.infer<typeof formSchema>) {


    console.log(values)

  }

  // const { name, username, email, profilePhoto,password } = body;

  return (
    <div>
      <div>
      

      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Profile Preview" 
          className="mt-4 w-32 h-32 rounded-full object-cover"
        />
      )}
    </div>


      <div className='flex items-center justify-center h-screen'>
        <div className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <div
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Update User Profile
          </div>
          <div
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Here you can update your user profile
          </div>

          <div className="flex justify-between items-center mt-0 w-full">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" className='border border-black w-full' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your username.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" className='border border-black' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your  name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" className='border border-black' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ProfilePic</FormLabel>
                      <FormControl>
                        <Input placeholder="profilePic" className='border border-black' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your profilePhoto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" className='border w-full border-black' {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your Password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>


          </div>
        </div>
      </div>






    </div>
  )
}

export default UpdateUser