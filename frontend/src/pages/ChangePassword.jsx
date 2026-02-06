import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const ChangePassword = () => {
    const { email } = useParams()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        setError("")
        setSuccess("")

        if (!newPassword || !confirmPassword) {
            setError("All fields are required!")
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match!")
            return;
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/change-password/${email}`, { newPassword, confirmPassword })
            setSuccess(res.data.message);
            setTimeout(() => {
                navigate("/login")
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <div className=' w-full h-fit md:h-screen bg-green-100 overflow-hidden'>
            <div className='flex flex-col to-muted/20'></div>
            <div className='flex-1 flex h-full items-center justify-center p-4'>
                <div className='bg-white shadow-md rounded-lg p-5 w-full max-w-md'>
                    <div className='text-center space-y-2'>
                        <h2 className='text-3xl font-bold tracking-tight text-green-600'>Change Password</h2>
                        <p className='text-gray-600 mb-10'>
                            Set your new password for {" "}
                            <span>{email}</span>
                        </p>

                        {
                            error && <p className='text-red-500 text-sm text-center mb-3'>{error}</p>
                        }
                        {
                            success && <p className='text-green-500 text-sm text-center mb-3'>{success}</p>
                        }

                        <div className='space-y-5'>
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Button
                                className="bg-green-600 hover:bg-green-700 w-full"
                                disabled={isLoading}
                                onClick={handleChangePassword}>
                                
                                {
                                    isLoading ? (
                                        <>
                                            <Loader2 className='w-4 h-4 animate-spin' /> Changing password...
                                        </>
                                    ) :
                                        "Change password"
                                }
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default ChangePassword
