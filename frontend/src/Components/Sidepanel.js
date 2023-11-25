import { googleLogout } from '@react-oauth/google'
import axios from 'axios'
import Cookies from 'js-cookie'
import { BookOpenText, LineChart, ListChecks, LogOut } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BACKEND_BASE_URL } from '../Services/UserServices'

const Sidepanel = (prop) => {
    const [auth, setAuth] = useState(prop['auth'])
    const page = prop['page']
    const navigate = useNavigate()

    const Logout = (e) => {
        e.preventDefault()
        googleLogout()
        Cookies.remove('taskAuth')
        setAuth(null)
    }

    useEffect(() => {
        if (auth) {
            const interval = setInterval(() => {
                axios.get(BACKEND_BASE_URL).catch(e => {})
            }, 5*60*1000)
            return () => clearInterval(interval)
        }
    }, [auth])

    useEffect(() => {
        if (!auth) {
            navigate({pathname: '/'})
        }
    }, [auth, navigate])
    return (
        <div className='h-full w-52 flex flex-col bg-slate-700'>
                <div className='h-1/6 w-full flex justify-center items-center'>
                    <div className='h-14 w-44 rounded-xl bg-slate-900 px-3 py-1 flex flex-row items-center justify-start gap-2 shadow-sm shadow-black'>
                        <div className='h-10 w-10 rounded-full border-2 bg-slate-500 flex items-center justify-center font-bold'>{(!!auth)?auth.firstName.charAt(0).toUpperCase():""}</div>
                        <label className='text-slate-300 font-semibold'>{(!!auth)?auth.firstName:""}</label>
                    </div>
                </div>
                <div className='h-4/6 w-full flex flex-col justify-center items-center gap-10'>
                    <div className={`h-14 w-44 rounded-xl px-3 py-1 flex flex-row items-center justify-start gap-2 hover:bg-slate-900 hover:shadow-sm hover:shadow-black hover:cursor-pointer ${(page === 'dashboard')?"bg-slate-900 shadow-sm shadow-black":""}`} onClick={() => {navigate({pathname: "/dashboard"})}}>
                        <div className='h-10 w-10 flex justify-center items-center hover:cursor-pointer'>
                            <ListChecks color='white'/>
                        </div>
                        <label className='text-slate-300 font-semibold hover:cursor-pointer'>Dashboard</label>
                    </div>
                    <div className={`h-14 w-44 rounded-xl px-3 py-1 flex flex-row items-center justify-start gap-2 hover:bg-slate-900 hover:shadow-sm hover:shadow-black hover:cursor-pointer ${(page === 'activity')?"bg-slate-900 shadow-sm shadow-black":""}`} onClick={() => {navigate({pathname: "/activity"})}}>
                        <div className='h-10 w-10 flex justify-center items-center hover:cursor-pointer'>
                            <LineChart color='white'/>
                        </div>
                        <label className='text-slate-300 font-semibold hover:cursor-pointer'>Activity</label>
                    </div>
                    <div className={`h-14 w-44 rounded-xl px-3 py-1 flex flex-row items-center justify-start gap-2 hover:bg-slate-900 hover:shadow-sm hover:shadow-black hover:cursor-pointer ${(page === 'reports')?"bg-slate-900 shadow-sm shadow-black":""}`}  onClick={() => {navigate({pathname: "/reports"})}}>
                        <div className='h-10 w-10 flex justify-center items-center hover:cursor-pointer'>
                            <BookOpenText color='white'/>
                        </div>
                        <label className='text-slate-300 font-semibold hover:cursor-pointer'>Reports</label>
                    </div>
                </div>
                <div className='h-1/6 w-full flex justify-center items-center'>
                    <div className='h-14 w-44 rounded-xl px-3 py-1 flex flex-row items-center justify-start gap-2 hover:bg-slate-900 hover:shadow-sm hover:shadow-black hover:cursor-pointer' onClick={Logout}>
                        <div className='h-10 w-10 flex justify-center items-center'>
                        <LogOut color='white'/>
                        </div>
                        <label className='text-slate-300 font-semibold hover:cursor-pointer' onClick={Logout}>Logout</label>
                    </div>
                </div>
        </div>
    )
}

export default Sidepanel