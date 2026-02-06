import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { getData } from '@/context/UserContext.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(true)
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, { email: email })
            if (res.data.success) {
                navigate(`/verify-otp/${email}`)
                toast.success(res.data.message)
                setEmail("")
            }
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className=' w-full h-fit md:h-screen bg-green-100 overflow-hidden'>
            <div className='flex flex-col to-muted/20'></div>
            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='flex flex-col items-center w-full my-10 max-w-md space-y-6'>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight text-green-600'>Reset your password</h1>
                        <p className='text-gray-600'>Enter your email to reset the password</p>
                    </div>

                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-green-600 text-2xl">Password Reset</CardTitle>
                            <CardDescription>
                                {isSubmitted ? "Check your email for password reset" :
                                    "Enter your email to receive the password reset link"}
                            </CardDescription>
                        </CardHeader>

                        {
                            error && <Alert variant={"destructive"}>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        }

                        <CardContent>
                            {
                                isSubmitted ? (<>
                                    <div className="flex flex-col gap-6">
                                        <div >
                                            <h3>Check your inbox</h3>
                                            <p>We've sent you a password reset link to <span>{email}</span></p>
                                            <p>If you don't see the email, check your spam folder or
                                                <button onClick={(setIsSubmitted(false))}>Try again</button>
                                            </p>
                                        </div>
                                    </div>
                                </>) : (<>
                                    <form onSubmit={handleForgotPassword} className='space-y-2'>
                                        <div className="flex flex-col gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    required
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value) }}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full bg-green-600 cursor-pointer hover:bg-green-700 my-2">
                                            {
                                                isLoading ? (<>
                                                    <Loader className='mr-2 w-4 h-4 animate-spin' />
                                                    Sending reset link...
                                                </>) : ("Send reset link")
                                            }
                                        </Button>
                                    </form></>)
                            }
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <p>
                                Remember your password?{" "}
                                <Link to={"/login"} className='text-green-600 hover:underline font-medium text-sm'>Sign in</Link>
                            </p>
                        </CardFooter>
                    </Card>


                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
