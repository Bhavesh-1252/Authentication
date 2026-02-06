import React, { useState } from 'react'
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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'


const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (res.data.success) {
                navigate("/verify");
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message);

        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className=' w-full h-fit md:h-screen bg-green-100 overflow-hidden'>
            <div className='flex flex-col to-muted/20'></div>
            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='flex flex-col items-center w-full my-10 max-w-md space-y-6'>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight text-green-600'>Create your account</h1>
                        <p className='text-gray-600'>Start organizing your thoughts and ideas</p>
                    </div>

                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-green-600 text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Enter your email below to create to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        type="email"
                                        placeholder="John doe"
                                        required
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>

                                    <div className="relative flex items-center">
                                        <Input id="password"
                                            value={formData.password}
                                            name="password" type={showPassword ? "text" : "password"}
                                            required
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                        />
                                        <Button onClick={() => { (setShowPassword(!showPassword)) }} className='absolute right-0 hover:bg-transparent' variant='ghost' disabled={isLoading}>
                                            {showPassword ?
                                                <Eye /> :
                                                <EyeOff />
                                            }</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" onClick={handleSubmit} className="w-full cursor-pointer bg-green-600 hover:bg-green-700">
                                {isLoading ?
                                    (<>
                                        <Loader2 className='mr-2 animate-spin' />
                                        Loading...
                                    </>) : "Sign Up"
                                }
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default Signup
