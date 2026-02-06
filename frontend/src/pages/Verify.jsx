import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Verify = () => {
    const { token } = useParams()
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (res.data) {
                    setStatus("✅ Email Verified Successfully")
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000)
                }
                else {
                    setStatus("❌ Invalid or expired token!")
                }
            } catch (error) {
                toast.error(error.response?.data?.message);
                setStatus("❌ Verification failed! Please try again")
            }
        }

        verifyEmail()
    }, [token, navigate])


    return (
        <div className='w-full h-screen'>
            <div className="w-full h-full bg-green-100 flex justify-center items-center">
                <div className='bg-white shadow-lg flex flex-col justify-center items-center p-7 max-w-2/6 rounded-lg'>
                    <h2 className='text-2xl font-semibold text-green-700'>{status}</h2>
                </div>
            </div>
        </div>
    )
}

export default Verify
