import React, { useState, useEffect } from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import { getData } from '@/context/UserContext.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert'


const Login = () => {
  const { setUser } = getData()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);

    (async () => {

      try {
        console.log(`${import.meta.env.VITE_API_URL}/user/profile`);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        console.log(res.data)
        setUser(res.data.user)
        navigate("/")
      } catch (error) {
        console.log(error.response?.data?.message)
      }

    })()
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setIsLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`
        , formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.data.success) {
        navigate("/");
        setUser(res.data.user)
        localStorage.setItem("accessToken", res.data.accessToken)
        toast.success(res.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message);

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
            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Login to your account</h1>
            <p className='text-gray-600'>Start organizing your thoughts and ideas today</p>
          </div>

          {
            error && <Alert variant={"destructive"} className={"w-fit"}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          }

          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-green-600 text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
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

                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-green-800"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className='relative'>
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

              <div className='my-4'>
                <Button type="submit" onClick={handleSubmit} className="w-full cursor-pointer bg-green-600 hover:bg-green-700">
                  {isLoading ?
                    (<>
                      <Loader2 className='mr-2 animate-spin' />
                      Logging into your account...
                    </>) : "Login"
                  }
                </Button>
              </div>

            </CardContent>
            <CardFooter className="flex-col gap-2">
              <p>
                Create new account?{" "}
                <Link to={"/signup"} className='text-green-600 hover:underline font-medium text-sm'>Sign in</Link>
              </p>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Login
