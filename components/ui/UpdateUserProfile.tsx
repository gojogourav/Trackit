import React, { useEffect, useState } from 'react'
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

function UpdateUserProfile() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('')

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: ""
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/users/current-user', {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok) throw new Error("Failed to fetch current user")
        const data = await res.json()
        form.reset({
          username: data.username,
          email: data.email,
          name: data.name,
          password: ""
        })
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch user")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/update', {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Update failed')
      }
      // Optionally handle success (e.g., show a success message or redirect)
    } catch (err: any) {
      setError(err.message || 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  

  return (
    <div className='text-black'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>This is your username.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
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
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormDescription>This is your email.</FormDescription>
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
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>Enter your password to update your profile.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div role="alert" className='w-full bg-red-400 text-red-100 py-2 px-4 rounded-md'>
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400'
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateUserProfile
