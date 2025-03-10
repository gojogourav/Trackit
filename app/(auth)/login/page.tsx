"use client"
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from "next/image";
import Link from "next/link";


import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';



const formSchema = z.object({
  identifier: z.string().min(2, { message: "Username must be atleast 2 characters" }),
  password: z.string().min(2, { message: "Password must be atleast 2 characters" }).max(16, { message: "Password must be atmost 16 characters" })
})


function Login() {

  const [error, setError] = useState('&apos')


  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { identifier: "", password: "" }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("THESE ARE IDENTIFIERS", values.identifier);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values)
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.error)
      }
      router.push("/")
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`)
    }

  }




  return (


    <div className='bg-black flex flex-col items-center   justify-center '>

      <div>
        <div className="inter-var">
          <div className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <div
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              TRACKIT
              and change the way you study
            </div>
            <div
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              if toppers can than you can too
            </div>
            <div className="w-full mt-4">
              <Image
                src="https://img.freepik.com/premium-photo/girl-is-writing-paper-with-pencil-it_300932-10349.jpg"
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </div>
            <h1 className='justify-center flex mt-4 font-bold text-neutral-700 text-xl'>Login </h1>
            {error &&
              <h1 className='justify-center flex  font-bold text-neutral-700 text-xl'>{error} </h1>
            }
            <div className="flex justify-center content-center w-full ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=''>Username</FormLabel>
                        <FormControl>
                          <Input className='w-80 border-black   border text-black' placeholder="username" {...field} />
                        </FormControl>

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
                          <Input className='  border border-black text-black' type='password' placeholder="password" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className='hover:bg-neutral-800 w-full rounded-xl'>Submit</Button>
                </form>
              </Form>
            </div>
            <Link
              href="/register"
              className="text-sm w-full justify-center flex mt-5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-300"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Login;
