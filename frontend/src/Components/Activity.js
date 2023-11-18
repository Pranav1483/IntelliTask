import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Sidepanel from './Sidepanel'
import userService from '../Services/UserServices'
import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'
import { StepBack, StepForward } from 'lucide-react'

const Activity = () => {
    const auth = (!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null
    const [arr, setArr] = useState([])
    const [pieData, setPieData] = useState([{"value": 0}, {"value": 0}, {"value": 0}])
    const [graphRange, setGraphRange] = useState('weekly')
    const [graphView, setGraphView] = useState({total: true, complete: true, pending: true, incomplete: true})
    const [lineData, setLineData] = useState([])
    const [offset, setOffset] = useState(0)
    const COLORS = ["#085394", "#666666", "#741b47"]

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
            setPieData([
                {"name": "Completed", "value": temp.filter(item => item.completion === 'Complete').length, "fill": "#ab273c"},
                {"name": "Pending", "value": temp.filter(item => item.completion === 'Incomplete' && item.date > Date.now()).length},
                {"name": "Incomplete", "value": temp.filter(item => item.completion === 'Incomplete' && item.date <= Date.now()).length}
            ])
            setArr(temp)
        })
        .catch(e => {
            
        })
    }, [auth.id])

    useEffect(() => {
        let start = new Date()
        start.setHours(0, 0, 0, 0)
        let end = new Date()
        end.setHours(23, 59, 59, 9)
        if (graphRange === 'weekly') {
            start.setDate(new Date().getDate() + offset*7 - 3)
            end.setDate(new Date().getDate() + offset*7 + 3)
        }
        else {
            start.setMonth(new Date().getMonth() + offset*1)
            start.setDate(start.getDate() - 15)
            end.setMonth(new Date().getMonth() + offset*1)
            end.setDate(end.getDate() + 15)
        }
        const filtered = arr.filter(item => ((item.date > start) && (item.date < end)))
        const resArray = []
        let curr = start
        while (curr <= end) {
            const formattedDate = curr.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})
            resArray.push({"date": formattedDate, "Total": 0, "Complete": 0, "Pending": 0, "Incomplete": 0})
            curr.setDate(curr.getDate() + 1)
        }
        const today = new Date()
        filtered.forEach(task => {
            const formattedDate = task.date.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})
            let entry = resArray.find(entry => entry["date"] === formattedDate)
            if (!entry) {
                entry = {"date": formattedDate, "Total": 0, "Complete": 0, "Pending": 0, "Incomplete": 0}
                resArray.push(entry)
            }
            entry["Total"]++
            if (task.completion === 'Complete') {
                entry["Complete"]++
            }
            else {
                if (task.date < today) {
                    entry["Incomplete"]++
                }
                else {
                    entry["Pending"]++
                }
            }
        })
        setLineData(resArray)
    }, [offset, arr, graphRange])

    return (
        <div className='w-auto h-screen bg-slate-800 flex blue'>
            <Sidepanel auth={auth} page='activity'/>
            <div className='h-full flex flex-col items-center justify-center' style={{width: "calc(100% - 208px)"}}>
                <div className='h-2/6 w-full flex justify-center items-center gap-10 mt-4'>
                    <div className='flex flex-col justify-center items-start rounded-3xl bg-slate-700 px-12 py-8'>
                        <label className='font-bold text-3xl text-slate-500 mb-4'>Total Tasks : {arr.length}</label>
                        <label className='font-semibold text-lg'>Completed : {pieData[0]["value"]}</label>
                        <label className='font-semibold text-lg'>Pending : {pieData[1]["value"]}</label>
                        <label className='font-semibold text-lg'>Incomplete : {pieData[2]["value"]}</label>
                    </div>
                    <div className='h-full w-3/6 flex items-center justify-center rounded-3xl bg-slate-700'>
                        <PieChart width={500} height={300}>
                            <Legend layout='vertical' verticalAlign='middle' align='right' wrapperStyle={{fontWeight: "700"}}/>
                            <Pie isAnimationActive={true} className='font-bold text-lg' data={pieData} dataKey="value" nameKey="name" fill='#fff' stroke='none'>
                                {pieData.map((entry, index) => <Cell key={index} className='hover:opacity-80' fill={COLORS[index]}></Cell>)}
                            </Pie>
                        </PieChart>
                    </div>
                </div>
                <div className='h-4/6 w-full flex justify-center items-center'>
                    <div className='flex flex-col justify-center items-center rounded-3xl bg-slate-700 h-5/6 w-10/12 px-4 gap-4'>
                        <div className='flex justify-center py-5 w-full gap-4'>
                            <div className='w-1/2 flex justify-start gap-4'>
                                <button className={`px-4 py-2 rounded-3xl ${(graphView.total)?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 font-semibold`} onClick={() => setGraphView({...graphView, total: !graphView.total})}>Total</button>
                                <button className={`px-4 py-2 rounded-3xl ${(graphView.complete)?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 font-semibold`} onClick={() => setGraphView({...graphView, complete: !graphView.complete})}>Complete</button>
                                <button className={`px-4 py-2 rounded-3xl ${(graphView.pending)?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 font-semibold`} onClick={() => setGraphView({...graphView, pending: !graphView.pending})}>Pending</button>
                                <button className={`px-4 py-2 rounded-3xl ${(graphView.incomplete)?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 font-semibold`} onClick={() => setGraphView({...graphView, incomplete: !graphView.incomplete})}>Incomplete</button>
                            </div>
                            <div className='w-1/2 flex justify-end gap-4'>
                                <button className={`px-4 py-2 rounded-3xl ${(graphRange === "monthly")?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 hover:bg-slate-900 hover:shadow-md font-semibold`} onClick={() => {setGraphRange('monthly'); setOffset(0)}}>Monthly</button>
                                <button className={`px-4 py-2 rounded-3xl ${(graphRange === "weekly")?"bg-slate-900 shadow-md":"bg-slate-800"} h-10 text-slate-500 hover:bg-slate-900 hover:shadow-md font-semibold`} onClick={() => {setGraphRange('weekly'); setOffset(0)}}>Weekly</button>
                            </div>
                        </div>
                        <div className='flex items-center justify-center gap-1 pr-10'>
                            <div className='h-full flex items-center justify-center'>
                                <button className='flex items-center justify-center p-1 rounded-full hover:bg-slate-600'  onClick={() => setOffset(e => e - 1)}><StepBack size={35} color='rgb(100, 116, 139)'/></button>
                            </div>
                            <div className=''>
                                <LineChart width={800} height={280} data={lineData}>
                                    <XAxis dataKey="date"/>
                                    <YAxis axisLine={false} allowDecimals={false}/>
                                    <Tooltip/>
                                    <Legend />
                                    {graphView.total && <Line type="monotone" dataKey="Total" stroke='grey'/>}
                                    {graphView.complete && <Line type="monotone" dataKey="Complete" stroke='green'/>}
                                    {graphView.pending && <Line type="monotone" dataKey="Pending" stroke='blue'/>}
                                    {graphView.incomplete && <Line type="monotone" dataKey="Incomplete" stroke='red'/>}
                                </LineChart>
                            </div>
                            <div className='h-full flex items-center justify-center ml-10'>
                                <button className='flex items-center justify-center p-1 rounded-full hover:bg-slate-600' onClick={() => setOffset(e => e + 1)}><StepForward size={35} color='rgb(100, 116, 139)'/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Activity