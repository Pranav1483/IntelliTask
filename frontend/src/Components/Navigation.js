import React, { useState } from 'react'
import logo from '../Assets/Images/IntelliTaskCropped.png'
import userService from '../Services/UserServices'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
    const [auth, setAuth] = useState((!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null)
    const navigate = useNavigate()
    const Login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                    },
                })
                const name = res.data.name.split(" ")
                const userData = {email: res.data.email,
                                    firstName: name[0],
                                    lastName: (name.length > 1)?name[name.length-1]:"",
                                    }
                userService.getUser(userData)
                    .then(response => {
                        if (response.status === 200) {
                            return response.data
                        }
                    })
                    .then(data => {
                        Cookies.set('taskAuth', JSON.stringify({firstName: data.firstName, lastName: data.lastName, email: data.email, id:data.id}), {expires: new Date(2038, 0, 1, 0, 0, 0)})
                        setAuth({firstName: data.firstName, lastName: data.lastName, email: data.email, id: data.id})
                        navigate("/dashboard")
                    })
                    .catch(err => {
                    })
            }
            catch (err) {
                
            }
        }
    })
    return (
        <div className='h-14 w-full flex bg-black'>
            <div className='h-full w-1/2 flex items-center justify-start pl-10'>
                <div className='h-full' style={{backgroundImage: `url(${logo})`, width: "200px", backgroundRepeat: "no-repeat"}}></div>
            </div>
            <div className='h-full w-1/2 flex items-center justify-end pr-10 gap-10'>
                <a href='/dashboard' className='text-white font-semibold hover:underline'>Dashboard</a>
                <a href='/' className='text-white font-semibold'>Reports</a>
                {!auth && <button className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={Login}>
                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                    <span>Login with Google</span>
                </button>}
                {!!auth && <button className='h-10 w-10 rounded-full border-2 bg-slate-500 flex items-center justify-center font-bold'>{(!!auth)?auth.firstName.charAt(0).toUpperCase():""}</button>}
            </div>
        </div>
    )
}

export default Navigation