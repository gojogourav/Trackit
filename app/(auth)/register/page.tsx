"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import Link from "next/link";

import { Input } from "@/components/ui/input"
import React, { useState } from 'react'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';


const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be atleast 2 characters" }).max(16, { message: "Username must be atmost 16 characters" }),
  password: z.string().min(2, { message: "Password must be atleast 2 characters" }).max(16, { message: "Password must be atmost 16 characters" }),
  email: z.string().email()

})
function Login() {
  const [error, setError] = useState('')
  const [submitting,setIsSubmitting] = useState(false)

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error ||"Registration failed")
      }
      console.log(response);
      

      router.push("/login")
    }
    catch (error: any) {
      setError(error.message||"Registration failed")
    }finally{
      setIsSubmitting(false)
    }
  }


  return (

    <div className='bg-white md:bg-black flex flex-col items-center h-screen  justify-center '>

      <div>
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              TRACKIT
              and change the way you study
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              if toppers can than you can too
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src="https://img.freepik.com/premium-photo/girl-is-writing-paper-with-pencil-it_300932-10349.jpg"
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <h1 className='justify-center flex mt-4 font-bold text-neutral-700 text-xl'>Register </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="flex justify-center content-center w-full mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=''>Username</FormLabel>
                        <FormControl>
                          <Input className='w-80   border text-black' placeholder="username" {...field} />
                        </FormControl>

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
                          <Input className='border text-black' type='email' placeholder="email" {...field} />
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
                          <Input className='  border text-black' type='password' placeholder="password" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={submitting} className='hover:bg-neutral-800 w-full rounded-xl '>{submitting?"Registeringg...":"Register"} <i hidden={!submitting} className="animate-spin fas fa-circle-notch"></i></Button>
                </form>
              </Form>
            </div>
            <Link
              href="/login"
              className="text-sm w-full justify-center flex mt-5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-300"
            >
              Already have an account? Login here
            </Link>

          </CardBody>
        </CardContainer>

      </div>
    </div>
  )
}

export default Login