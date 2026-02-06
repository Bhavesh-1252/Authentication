import React from 'react'

const VerifyEmail = () => {
    return (
        <div className='w-full h-screen'>
            <div className="w-full h-full bg-green-100 flex justify-center items-center">
                <div className='bg-white shadow-lg flex flex-col justify-center items-center p-7 max-w-2/6 rounded-lg'>
                    <h2 className='text-2xl font-semibold text-green-700 mb-3'>✅ Verify Your Email</h2>
                    <p className='text-center text-slate-600'>We've sent you an email to verify your account. Check the email in your inbox and complete the verification.</p>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
