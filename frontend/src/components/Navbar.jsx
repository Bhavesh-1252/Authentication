import { BookA, BookOpenIcon, LogOut, User2 } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getData } from '@/context/UserContext';
import { toast } from 'sonner';
import axios from 'axios';


const Navbar = () => {
    const { user, setUser } = getData();
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessToken")

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            if (res.data.success) {
                setUser(null);
                toast.success(res.data.message)
                localStorage.clear()
            }

            // navigate("/login")
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <nav className='fixed w-full z-50 top-0 p-2 border-b border-gray-200 bg-transparent'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <BookOpenIcon className='w-6 h-6 text-green-600' />
                    <Link to="/"> <h1 className='text-xl font-semibold'><span className='text-green-600'>Notes </span>App</h1></Link>
                </div>

                <div className='flex items-center'>
                    <ul className='flex gap-7 items-center font-semibold'>
                        <li>Features</li>
                        <li>About</li>
                        {
                            user ? <>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuItem className="cursor-pointer"><User2 /> Profile</DropdownMenuItem>
                                            <button onClick={() => navigate('/notes')} className='w-full'>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <BookA /> Notes
                                                </DropdownMenuItem>
                                            </button>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logoutHandler} className="cursor-pointer"><LogOut /> Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu></> : <Link to="/login"><li>Login</li></Link>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
