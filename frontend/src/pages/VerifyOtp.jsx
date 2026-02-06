import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const ForgotPassword = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", "",])
    const inputRefs = useRef([])
    const { email } = useParams()

    const handleChange = (index, value) => {
        if (value.length > 1) return
        const updatedOtp = [...otp];
        updatedOtp[index] = value
        setOtp(updatedOtp)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

    }

    const handleVerify = async () => {
        const finalOtp = otp.join("")
        if (finalOtp.length !== 6) {
            setError("Please enter 6 digit OTP")
            return 
        }

        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp/${email}`, { otp: finalOtp })
            setSuccessMessage(res.data.message)
            setTimeout(() => {
                navigate(`/change-password/${email}`);
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong!")
        }
        finally {
            setIsLoading(false)
        }
    }

    const clearOtp = () => {
        setOtp(["", "", "", "", "", "",]);
        setError("")
        inputRefs.current[0]?.focus()
    }

    return (
        <div className=' w-full h-fit md:h-screen bg-green-100 overflow-hidden'>
            <div className='flex flex-col to-muted/20'></div>
            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='flex flex-col items-center w-full my-10 max-w-md space-y-6'>
                    <div className='text-center space-y-2'>
                        <h1 className='text-3xl font-bold tracking-tight text-green-600'>Verify your email</h1>
                        <p className='text-gray-600'>
                            We've have sent you a 6-digit OTP verification code to {" "}
                            <span>{email}</span>
                        </p>
                    </div>

                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-green-600 text-2xl">Enter Verification Code</CardTitle>
                            <CardDescription>
                                {isVerified ? "OTP Verified Successfully! Redirecting..." :
                                    "Enter the 6-digit OTP sent to your email"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            {error &&
                                <Alert variant={"destructive"} className='my-3 w-fit'>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            }

                            {
                                successMessage && <p className='text-center text-sm mb-3 text-green-600'>{successMessage} </p>
                            }
                            {
                                isVerified ? (
                                    <div className='py-6 flex justify-center items-center space-y-4 text-center'>
                                        <div className='bg-primary/10 rounded-full p-3'>
                                            <CheckCircle className='h-6 w-6 text-primary' />
                                        </div>
                                        <div>
                                            <h3>Verification Successfull</h3>
                                            <p>Your email has been verified. You'll be redirecting to reset password.</p>
                                        </div>
                                        <div>
                                            <Loader2 className='w-4 h-3 animate-spin' />
                                            <span className='text-sm text-muted-foreground'>Redirecting...</span>
                                        </div>

                                    </div>
                                ) : (
                                    <>
                                        <div className='flex justify-between mb-6'>
                                            {
                                                otp.map((digit, index) => (
                                                    <Input
                                                        key={index}
                                                        value={digit}
                                                        type="text"
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        maxLength={1}
                                                        ref={(el) => (inputRefs.current[index] = el)}
                                                        className={"w-12 h-12 text-center font-bold text-xl"} />
                                                ))
                                            }
                                        </div>
                                        <div className='space-y-3'>
                                            <Button
                                                onClick={handleVerify}
                                                disabled={isLoading || otp.some((digit) => digit === "")}
                                                className={"bg-green-600 w-full"}>
                                                {
                                                    isLoading ?
                                                        <>
                                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Verifying
                                                        </>
                                                        :
                                                        "Verify OTP"
                                                }
                                            </Button>
                                            <Button className={"w-full bg-transparent"} disabled={isLoading || isVerified} variant={"outline"} onClick={clearOtp}>
                                                <RotateCcw className='h-4 w-4' />
                                                Clear
                                            </Button>
                                        </div>
                                    </>
                                )
                            }

                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <p className='text-sm text-muted-foreground '>Edit Email? {" "}
                                <Link to={"/forgot-password"} className='text-green-600 hover:underline font-medium'>Go back</Link>
                            </p>
                        </CardFooter>


                    </Card>

                    <div>
                        <p className='text-slate-600 text-xs'>For Testing purposes, use code: <span className="font-mono">123456</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
