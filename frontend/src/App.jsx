import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoutes.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyOtp from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import CreateTodo from './pages/CreateNotes'


const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Navbar /><Home /></ProtectedRoute>
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/verify",
    element: <VerifyEmail />
  },
  {
    path: "/verify/:token",
    element: <Verify />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOtp />
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword />
  },
  {
    path: "/notes",
    element: <>
      <ProtectedRoute>
        <Navbar /><CreateTodo />
      </ProtectedRoute>
    </>
  },
])

const App = () => {

  return (
    <div className='relative'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
