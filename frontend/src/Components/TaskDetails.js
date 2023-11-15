import React, { useEffect, useState } from 'react'
import Sidepanel from './Sidepanel'
import Cookies from 'js-cookie'
import userService from '../Services/UserServices'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, Check, CheckCheck, Clock, X } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import '../Assets/Styles/global.css'

const TaskDetails = () => {
    const auth = (!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null
    const [task, setTask] = useState()
    const {id} = useParams()
    const [remTime, setRemTime] = useState({Days: 0, Hours: 0, Minutes: 0, Seconds: 0})
    const [perc, setPerc] = useState(100)
    const [isUpdated, setIsUpdated] = useState(true)
    const [isDelete, setIsDelete] = useState(false)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const navigate = useNavigate()

    useEffect(() => {
        userService.getTask(auth.id.toString() + '_' + id.toString())
        .then(response => {
            if (response.status === 200) {
                return response.data
            }
        })
        .then(data => {
            setTask({...data, deadline: new Date(data.deadline), created: new Date(data.created)})
        })
        .catch(e => {

        })
    }, [auth.id, id])

    useEffect(() => {
        if (task) {
            const interval = setInterval(() => {
                const diffTime = Math.max(task.deadline - Date.now(), 0)
                const fullTime = task.deadline - task.created
                setPerc(Math.floor(diffTime*100/fullTime))
                setRemTime({Days: Math.floor(diffTime/(24*60*60*1000)), Hours: Math.floor((diffTime % (24*60*60*1000))/(60*60*1000)), Minutes: Math.floor((diffTime % (60*60*1000))/(60*1000)), Seconds: Math.floor((diffTime/1000))%60})
            }, 100)

            return () => clearInterval(interval)
        }
    }, [task])

    const handleTaskStatus = (idx) => {
        const temp = [...task.subtasks]
        temp[idx][Object.keys(task.subtasks[idx])[0]] = (Object.values(task.subtasks[idx])[0] === 0)?1:0
        const progress = Math.ceil(temp.filter(obj => Object.values(obj)[0] === 1).length*100/temp.length)
        setTask({...task, subtasks: temp, progress: progress})
        setIsUpdated(false)
    }

    const updateTask = () => {
        if (isUpdated === false) {
            userService.updateTask(auth.id.toString() + '_' + task.id.toString(), task.subtasks, task.progress)
            .then(response => {
                if (response.status === 204) {
                    setIsUpdated(true)
                }
            })
        }
    }

    const cancelDelete = () => {
        setIsDelete(false)
    }

    const deleteTask = () => {
        userService.deleteTask(auth.id.toString() + '_' + task.id.toString())
        .then(response => {
            if (response.status === 204) {
                navigate({pathname: "/dashboard"})
            }
        })
    }

    return (
        <div className='w-auto h-screen bg-slate-800 flex'>
            <Sidepanel auth={auth}/>
            <div className='h-full flex items-center justify-center' style={{width: "calc(100% - 208px)"}}>
                {task && <div className='h-4/6 w-9/12 rounded-2xl bg-slate-900 flex flex-col shadow-lg shadow-slate-900 p-10 gap-8'>
                    <div className='w-full flex justify-start items-center' style={{height: "30px"}}>
                        <label className='text-slate-300 font-semibold text-2xl'>{task.title}</label>
                    </div>
                    <div className='w-full flex gap-10'>
                        <div className='w-5/12 flex flex-col gap-8'>
                            <div className='w-8/12 h-32 rounded-3xl px-4 py-2 bg-slate-700 flex flex-col items-start justify-center gap-4'>
                                <div className='flex items-start gap-4 justify-center'>
                                    <CalendarDays size={32} />
                                    <label className='h-8 text-lg font-semibold'>{task.deadline.getDate() + ' ' + months[task.deadline.getMonth()] + ', ' + task.deadline.getFullYear()}</label>
                                </div>
                                <div className='flex items-start gap-4 justify-center'>
                                    <Clock size={32} />
                                    <label className='h-8 text-lg font-semibold'>{task.deadline.getHours().toString().padStart(2, '0') + ' : ' + task.deadline.getMinutes().toString().padStart(2, '0') + ' : ' + task.deadline.getSeconds().toString().padStart(2, '0')}</label>
                                </div>
                            </div>
                            <div className='w-full h-44 rounded-3xl px-4 pt-4 bg-slate-700 flex items-start justify-start gap-4'>
                                <div className='w-2/5 h-full flex flex-col'>
                                    <h1 className='text-lg font-semibold'>Time Left</h1>
                                    <div className='w-full flex flex-col mt-4'>
                                        <label className='font-semibold'>{remTime.Days.toString().padStart(2, '0')} Days</label>
                                        <label className='font-semibold'>{remTime.Hours.toString().padStart(2, '0')} Hours</label>
                                        <label className='font-semibold'>{remTime.Minutes.toString().padStart(2, '0')} Minutes</label>
                                        <label className='font-semibold'>{remTime.Seconds.toString().padStart(2, '0')} Seconds</label>
                                    </div>
                                </div>
                                <div className='h-full w-3/5 flex flex-col items-center justify-center'>
                                    <div className='w-full flex flex-col items-center justify-center gap-2'>
                                        <CircularProgressbar className='h-3/6' value={perc} strokeWidth={15} styles={buildStyles({pathColor: `rgb(0, 168, 232, ${perc/100})`, textColor: "white", textSize: "16px", trailColor: "#475569", strokeLinecap: "round", pathTransitionDuration: 1})}></CircularProgressbar>
                                        <label className='font-semibold pl-3'>{perc} %</label>
                                    </div>
                
                                </div>
                            </div>
                        </div>
                        <div className='w-7/12 flex bg-slate-700 rounded-3xl pl-4 py-4 gap-4'>
                            <div className='w-5/12 h-full flex flex-col gap-4'>
                                <div className='w-full h-60 flex flex-col overflow-scroll gap-2'>
                                    {Object.entries(task.subtasks).map(([idx, item]) => (<li key={idx} className={`w-11/12 break-words font-semibold hover:cursor-pointer noselect ${(Object.values(item)[0] === 1)?"line-through":""}`} onClick={() => handleTaskStatus(idx)}>{Object.keys(item)[0]}</li>))}
                                </div>
                                <div className='w-full h-1/6 flex gap-4 items-center justify-center'>
                                    <button className='rounded-full border-1 bg-blue-400 py-2 px-4 font-semibold' onClick={updateTask}>{(isUpdated === true)?<CheckCheck color='white' />:"Update"}</button>
                                    {isDelete && <div className='rounded-full border-1 bg-slate-500 py-2 px-4 font-semibold hover:cursor-pointer'><div className='flex items-center gap-5'><Check strokeWidth={3} color='white' onClick={deleteTask}/> <X strokeWidth={3} color='white' onClick={cancelDelete}/></div></div>}
                                    {!isDelete && <div className='rounded-full border-1 bg-slate-500 py-2 px-4 font-semibold hover:cursor-pointer' onClick={() => {setIsDelete(true)}}>Delete</div>}
                                </div>
                            </div>
                            <div className='w-7/12 h-full flex flex-col items-center justify-center pr-5 gap-4'>
                                <CircularProgressbar className='h-4/6' value={task.progress} strokeWidth={17} styles={buildStyles({pathColor: `rgb(74, 222, 128, ${task.progress/100})`, textColor: "white", textSize: "16px", trailColor: "#475569", strokeLinecap: "round", pathTransitionDuration: 1})}></CircularProgressbar>
                                <label className='font-semibold text-2xl ml-6'>{task.progress} %</label>
                            </div>
                        </div>
                    </div>
                </div>}
                {! task && <div className='h-4/6 w-9/12 rounded-2xl bg-slate-900 flex shadow-lg shadow-slate-900 p-10 justify-center items-center'>
                    Loading...
                </div>}
            </div>
        </div>
    )
}

export default TaskDetails