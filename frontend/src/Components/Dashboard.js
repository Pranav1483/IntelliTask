import React, { useEffect, useState } from 'react'
import Sidepanel from './Sidepanel'
import { MoveVertical, Search, Star } from 'lucide-react'
import '../Assets/Styles/global.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import Cookies from 'js-cookie'
import userService from '../Services/UserServices'
import { useNavigate } from 'react-router-dom'
import { Rings } from 'react-loader-spinner'

const Dashboard = () => {
    const auth = (!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null
    const [filter, setFilter] = useState('all')
    const [query, setQuery] = useState('')
    const [visibleArr, setVisibleArr] = useState([])
    const [arr, setArr] = useState([])
    const [dateOrder, setDateOrder] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    useEffect(() => {
        userService.getTasks(auth.id)
        .then(response => {
            if (response.status === 200) {
                return response.data
            }
        })
        .then(data => {
            const temp = data.map(item => ({
                ...item,
                date: new Date(item.date),
            }))
            setArr(temp)
            setIsLoading(false)
        })
        .catch(e => {
            
        })
    }, [auth.id])

    useEffect(() => {
        var temp = []
        if (filter === 'all') {
            temp = [...arr]
        }
        else if (filter === 'priority') {
            temp = arr.filter(item => item.priority === true)
        }
        else if (filter === 'completed') {
            temp = arr.filter(item => item.completion === 'Complete')
        }
        else if (filter === 'pending') {
            temp = arr.filter(item => item.completion === 'Incomplete' && item.date > Date.now())
        }
        else if (filter === 'incomplete') {
            temp = arr.filter(item => item.completion === 'Incomplete' && item.date <= Date.now())
        }
        if (query !== '') {
            temp = temp.filter(item => item.task.toLowerCase().includes(query.toLowerCase()))
        }
        if (dateOrder === 1) {
            temp.sort((a, b) => b.date - a.date)
        }
        else if (dateOrder === -1) {
            temp.sort((a, b) => a.date - b.date)
        }
        setVisibleArr(temp)
    }, [arr, filter, query, dateOrder])

    const setOrder = () => {
        setDateOrder((dateOrder === 1)?-1:1)
    }

    return (
        <div className='w-auto h-screen bg-slate-800 flex'>
            <Sidepanel auth={auth} page='dashboard'/>
            <div className='h-full' style={{width: "calc(100% - 208px)"}}>
                <div className='h-14 w-full flex items-center'>
                    <div className='h-full w-3/5 flex items-center justify-start pl-10 gap-20'>
                        <div className={`h-5/6 w-fit ${(filter === 'all')?'border-b-blue-600 border-b-4':'hover:border-b-blue-600 hover:border-b-4'} rounded-b-sm flex justify-end pb-1 hover:cursor-pointer`} onClick={() => {setFilter('all')}}>
                            <label className='text-slate-300 font-semibold flex items-end hover:cursor-pointer'>All Tasks</label>
                        </div>
                        <div className={`h-5/6 w-fit ${(filter === 'priority')?'border-b-blue-600 border-b-4':'hover:border-b-blue-600 hover:border-b-4'} rounded-b-sm flex justify-end pb-1 hover:cursor-pointer`} onClick={() => {setFilter('priority')}}>
                            <label className='text-slate-300 font-semibold flex items-end hover:cursor-pointer'>Priority</label>
                        </div>
                        <div className={`h-5/6 w-fit ${(filter === 'completed')?'border-b-blue-600 border-b-4':'hover:border-b-blue-600 hover:border-b-4'} rounded-b-sm flex justify-end pb-1 hover:cursor-pointer`} onClick={() => {setFilter('completed')}}>
                            <label className='text-slate-300 font-semibold flex items-end hover:cursor-pointer'>Completed</label>
                        </div>
                        <div className={`h-5/6 w-fit ${(filter === 'pending')?'border-b-blue-600 border-b-4':'hover:border-b-blue-600 hover:border-b-4'} rounded-b-sm flex justify-end pb-1 hover:cursor-pointer`} onClick={() => {setFilter('pending')}}>
                            <label className='text-slate-300 font-semibold flex items-end hover:cursor-pointer'>Pending</label>
                        </div>
                        <div className={`h-5/6 w-fit ${(filter === 'incomplete')?'border-b-blue-600 border-b-4':'hover:border-b-blue-600 hover:border-b-4'} rounded-b-sm flex justify-end pb-1 hover:cursor-pointer`} onClick={() => {setFilter('incomplete')}}>
                            <label className='text-slate-300 font-semibold flex items-end hover:cursor-pointer'>Incomplete</label>
                        </div>
                    </div>
                    <div className='h-full w-1/5 flex items-center justify-end mr-4'>
                        <div className='h-5/6 w-fit bg-blue-700 hover:bg-blue-500 px-5 py-2 rounded-full flex justify-center items-center hover:cursor-pointer' onClick={() => {navigate("task")}}>
                            <label className='text-slate-300 font-bold hover:cursor-pointer' onClick={() => {navigate("task")}}>+ Task</label>
                        </div>
                    </div>
                    <div className='h-full w-1/5 flex items-center justify-center'>
                        <div className='h-5/6 w-11/12 bg-slate-700 rounded-full flex gap-2 justify-left items-center'>
                            <div className='h-4/6 aspect-square rounded-full flex items-center ml-2'>
                                <Search color='white' strokeWidth={4}/>
                            </div>
                            <input className='w-8/12 text-white font-semibold bg-slate-700 border-none focus:outline-none' value={query} onChange={e => setQuery(e.target.value)}></input>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-start items-center flex-col' style={{height: "calc(100% - 56px)"}}>
                    <div className='w-11/12 mt-20 rounded-t-3xl bg-slate-900 h-10 flex items-center'>
                        <label className='text-slate-300 font-semibold text-left ml-6 w-4/12'>Task</label>
                        <label className='text-slate-300 font-semibold text-center w-2/12 flex flex-row items-center justify-center'>Due Date {<MoveVertical size={15} className='hover:cursor-pointer' onClick={setOrder}/>}</label>
                        <label className='text-slate-300 font-semibold text-center w-1/12'>Due Time</label>
                        <label className='text-slate-300 font-semibold text-center w-3/12'>Status</label>
                        <label className='text-slate-300 font-semibold text-center w-2/12'>Completion</label>
                    </div>
                    {!isLoading && <div className='h-3/4 w-11/12 flex flex-col overflow-auto'>
                        {visibleArr.map((item, idx) => (
                            <div key={idx} className='w-full mt-5 rounded-2xl h-14 bg-slate-900 flex items-center' style={{minHeight: "56px"}}>
                                <div className='taskcell text-slate-300 font-semibold text-left ml-6 w-4/12 overflow-auto h-full items-center flex' style={{whiteSpace: "nowrap"}}>{item.task}</div>
                                <div className='text-slate-300 font-semibold text-center w-2/12 h-full flex items-center justify-center'>{months[item.date.getMonth()] + ' ' + item.date.getDate() + ', ' + item.date.getFullYear()}</div>
                                <div className='text-slate-300 font-semibold text-center w-1/12 h-full flex items-center justify-center'>{item.date.getHours().toString().padStart(2, '0') + ':' + item.date.getMinutes().toString().padStart(2, '0')}</div>
                                <div className='text-slate-300 font-semibold text-center w-3/12 h-full flex items-center justify-center gap-2'>
                                    {(item.priority === true) && <div className='h-full w-1/12 flex items-center justify-center'><Star size={16} strokeWidth={4}/></div>}
                                    {(item.priority === false) && <div className='h-full w-1/12 flex items-center justify-center'><Star size={16} strokeWidth={4} color='rgb(15,23,42)'/></div>}
                                    <div className='w-2/12 h-full flex items-center justify-center'><CircularProgressbar className='h-5/6' value={item.progress + 1} strokeWidth={15} styles={buildStyles({pathColor: "#00a8e8", textColor: "white", textSize: "16px", trailColor: "#475569", strokeLinecap: "round"})}/></div>
                                    <div className='h-full w-1/12 flex items-center justify-center'><label className='font-semibold text-slate-300 text-xs'>{item.progress}%</label></div>
                                </div>
                                <div className='flex items-center justify-center w-2/12 h-full'>
                                    <div className='h-4/6 w-7/12 rounded-2xl flex items-center justify-center text-white hover:cursor-pointer' style={{backgroundColor: (item.completion === "Complete")?"green":(item.date < Date.now())?"#ab273c":"#777e7a"}} onClick={() => {navigate("task/" + item.id.toString())}}>{(item.completion === "Complete")?"Complete":(item.date < Date.now())?"Incomplete":"In Progress"}</div>
                                </div>
                            </div>
                        ))}
                    </div>}
                    {isLoading && <Rings ariaLabel="rings-loading" visible={true} wrapperClass="" wrapperStyle={{}} radius="6" height="80" width="80"color="#51E5FF"></Rings>}
                </div>
            </div>
        </div>
    )
}

export default Dashboard