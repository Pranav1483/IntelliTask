import Cookies from 'js-cookie'
import React, { useState } from 'react'
import Sidepanel from './Sidepanel'
import { CalendarDays, Check, Clock, Star, X } from 'lucide-react'
import '../Assets/Styles/global.css'
import userService from '../Services/UserServices'
import { useNavigate } from 'react-router-dom'
import { ProgressBar } from 'react-loader-spinner'

const AddTask = () => {
    const auth = (!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [deadline, setDeadline] = useState(null)
    const [priority, setPriority] = useState(false)
    const [subtasks, setSubtasks] = useState([])
    const [currSubtask, setCurrSubtask] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const [repeat, setRepeat] = useState("NONE")

    const addSubTask = () => {
        if (currSubtask !== '') {
            setSubtasks([...subtasks, {[currSubtask]: 0}])
            setCurrSubtask('')
        }
    }
    const onPressEnter = (e) => {
        if (e.code === "Enter") {
            addSubTask()
        }
    }

    const subTaskDelete = (idx) => {
        const temp = [...subtasks]
        temp.splice(idx, 1)
        setSubtasks(temp)
    }

    const TaskButton = (e) => {
        e.preventDefault()
        if ((title !== '') && (!!deadline) && (subtasks.length !== 0)) {
            setIsSaving(true)
            userService.newTask(auth.id, title, deadline, subtasks, priority, repeat)
            .then(response => {
                if (response.status === 200){
                    navigate({pathname: "/dashboard"})
                }
                else {
                    setIsSaving(false)
                }
            })
            .catch(e => {
                setIsSaving(false)
            })
        }
    }
    
    return (
        <div className='w-auto h-screen bg-slate-800 flex'>
            <Sidepanel auth={auth} page='dashboard'/>
            <div className='h-full flex items-center justify-center' style={{width: "calc(100% - 208px)"}}>
                <div className='h-4/6 w-9/12 rounded-2xl bg-slate-900 flex flex-col shadow-lg shadow-slate-900 p-10 gap-8'>
                    <div className='w-full flex justify-start items-center' style={{height: "30px"}}>
                        <input className='text-slate-300 font-semibold text-3xl bg-transparent py-2 px-5 focus:outline-none focus:border-b' placeholder='Title...' value={title} onChange={e => {setTitle(e.target.value)}}/>
                    </div>
                    <div className='w-full flex gap-10'>
                        <div className='w-5/12 flex flex-col gap-8'>
                            <div className='w-9/12 h-40 rounded-3xl px-6 py-6 bg-slate-700 flex flex-col items-start justify-center gap-4'>
                                <div className='flex items-start gap-4 justify-center'>
                                    <CalendarDays size={32} />
                                    <label className='h-8 text-lg font-semibold'>{!deadline?".....":deadline.getDate() + ' ' + months[deadline.getMonth()] + ', ' + deadline.getFullYear()}</label>
                                </div>
                                <div className='flex items-start gap-4 justify-center'>
                                    <Clock size={32} />
                                    <label className='h-8 text-lg font-semibold'>{!deadline?".....":deadline.getHours().toString().padStart(2, '0') + ' : ' + deadline.getMinutes().toString().padStart(2, '0') + ' : ' + deadline.getSeconds().toString().padStart(2, '0')}</label>
                                </div>
                                <div className='w-full flex items-center justify-center'><input type='datetime-local' onChange={e => setDeadline(new Date(e.target.value))} className='focus:outline-none bg-transparent text-2xl'></input></div>
                            </div>
                            <div className='w-9/12 rounded-3xl p-6 bg-slate-700 flex justify-center items-center gap-4'>
                                <button className={`py-2 w-16 flex items-center justify-center rounded-full ${(repeat === "DAILY")?"bg-slate-800":"bg-slate-500"} ${(repeat === "DAILY")?"text-white":"text-black"}`} onClick={() => {(repeat !== "DAILY")?setRepeat("DAILY"):setRepeat("NONE")}}>Daily</button>
                                <button className={`py-2 w-16 flex items-center justify-center rounded-full ${(repeat === "WEEKLY")?"bg-slate-800":"bg-slate-500"} ${(repeat === "WEEKLY")?"text-white":"text-black"}`} onClick={() => {(repeat !== "WEEKLY")?setRepeat("WEEKLY"):setRepeat("NONE")}}>Weekly</button>
                                <button className={`py-2 w-16 flex items-center justify-center rounded-full ${(repeat === "MONTHLY")?"bg-slate-800":"bg-slate-500"} ${(repeat === "MONTHLY")?"text-white":"text-black"}`} onClick={() => {(repeat !== "MONTHLY")?setRepeat("MONTHLY"):setRepeat("NONE")}}>Monthly</button>
                            </div>
                            <div className='flex items-center justify-center w-8/12'>
                                <Star strokeWidth={3.5} size={30} color={priority === true?"rgb(0, 168, 232)":"white"} onClick={() => {setPriority(!priority)}}/>
                            </div>
                        </div>
                        <div className='w-7/12 flex bg-slate-700 rounded-3xl pl-4 py-4 gap-4'>
                            <div className='w-full h-full flex flex-col gap-4 py-4 px-10'>
                                <div className='w-full h-48 flex flex-col overflow-scroll gap-2'>
                                    {Object.entries(subtasks).map(([idx, item]) => (<div key={idx} className='flex'><li className={`w-11/12 break-words font-semibold noselect text-base`}>{Object.keys(item)[0]}</li><X className='hover:text-white hover:cursor-pointer' onClick={() => subTaskDelete(idx)}/></div>))}
                                    <div className='flex w-full'><input className='w-11/12 text-slate-300 font-semibold bg-transparent py-2 px-5 focus:outline-none focus:border-b' placeholder='SubTask...' value={currSubtask} onChange={e => setCurrSubtask(e.target.value)} onKeyDown={onPressEnter}/><Check className='hover:text-white hover:cursor-pointer' onClick={addSubTask}/></div>
                                </div>
                                <div className='w-full flex items-center justify-center'>
                                    {!isSaving && <button className='bg-slate-500 py-2 px-4 rounded-full font-semibold' onClick={TaskButton}>Add Task</button>}
                                    {isSaving && <div><ProgressBar height="60px" width="100px" ariaLabel='progress-bar-loading' wrapperClass='progress-bar-wrapper' borderColor='rgb(15,23,42)' barColor = '#51E5FF'></ProgressBar></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTask