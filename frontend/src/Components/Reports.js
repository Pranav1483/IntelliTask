import React, { useEffect, useRef, useState } from 'react'
import Sidepanel from './Sidepanel'
import Cookies from 'js-cookie'
import userService from '../Services/UserServices'

const Reports = () => {
    const auth = (!!Cookies.get('taskAuth'))?JSON.parse(Cookies.get('taskAuth')):null
    const [answer, setAnswer] = useState('')
    const [query, setQuery] = useState('')
    const [conversations, setConversations] = useState([])
    const [showQuery, setShowQuery] = useState(false)
    const [userTasks, setUserTasks] = useState(null)
    const scrollable = useRef()

    useEffect(() => {
        scrollable.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }, [showQuery, answer])

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
                date: `Date: ${new Date(item.date).getDate()}/${new Date(item.date).getMonth()+1}/${new Date(item.date).getFullYear()} Time: ${new Date(item.date).getHours}:${new Date(item.date).getMinutes}`,
            }))
            setUserTasks(JSON.stringify(temp))
        })
        .catch(e => {
            
        })
    }, [auth.id])

    const onPressEnter = (e) => {
        if (e.code === "Enter") {
            handleClick(e)
        }
    }

    // const handleClick = async (e) => {
    //     e.preventDefault()
    //     setShowQuery(true)
    //     var response = await fetch("https://pranav1483-intellitask.hf.space/stream")
    //     var reader = response.body.getReader()
    //     var decoder = new TextDecoder('utf-8')
    //     reader.read().then(function ProcessResult(result) {
    //         let token = JSON.parse(decoder.decode(result.value)).value
    //         if (token === "<STOP>") {
    //                 setAnswer((prevAnswer) => {
    //                     setConversations((prevConv) => [...prevConv, [query, prevAnswer]])
    //                     return '';
    //                 })
    //                 setQuery('')
    //                 setShowQuery(false)
    //                 return
    //         }
    //         setAnswer((prevAnswer) => prevAnswer + ' ' + token)
    //         return reader.read().then(ProcessResult)
    //     })
    // }

    const handleClick = async e => {
        e.preventDefault()
        setShowQuery(true)
        const response = await fetch(
                `https://api.fireworks.ai/inference/v1/chat/completions`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'Authorization': `Bearer zjOtfYadWF1PgJctY0TAMGnGfKjFej60yGKnixLV2AnlN39e`,
                },
                body: JSON.stringify({
                model: "accounts/fireworks/models/llama-v2-70b-chat",
                messages: [
                    {
                    "role": "user",
                    "content" : `<CONTEXT>Given is a list of user tasks with the following parameters - task: task name, date: deadline datetime object, completion: completion status, priority: Important or not, progress: completion %\n${userTasks}\nAnswer the query from this data. Answer shortly and upto the point only. Current Date: ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getYear()} Current Time: ${new Date().getHours()}:${new Date().getMinutes()}. Answer the queries considering current date and the date of each task</CONTEXT>Query: ${query}`
                    }
                ],
                stream: true,
                n: 1,
                max_tokens: 1000,
                temperature: 0.1,
                top_p: 0.9
                }),
            });
        var reader = response.body.getReader()
        var decoder = new TextDecoder('utf-8')
        reader.read().then(function ProcessResult(result) {
        let token = JSON.parse(decoder.decode(result.value).split('\n')[0].trim().substring(6))
        if (token.choices[0].finish_reason === 'stop') {
            setAnswer((prevAnswer) => {
                setConversations((prevConv) => [...prevConv, [query, prevAnswer + token.choices[0].delta.content]])
                return '';}
                )
            setQuery('')
            setShowQuery(false)
            return
        }
        if (token.choices[0].delta.content)
        setAnswer((prevAnswer) => prevAnswer + token.choices[0].delta.content)
        return reader.read().then(ProcessResult)
        })
    }

    return (
        <div className='w-auto h-screen bg-slate-800 flex blue'>
            <Sidepanel auth={auth} page='reports'/>
            <div className='h-full flex flex-col items-center justify-end' style={{width: "calc(100% - 208px)"}}>
                <div className='h-4/6 w-5/6 flex flex-col overflow-auto gap-2 justify-start pb-2'>
                    {conversations.map((item, index) => (
                        <div key={index} className='flex flex-col gap-4'>
                            <div className='w-full flex items-center justify-start gap-3'>
                                <div className='h-10 w-10 rounded-full border-2 bg-slate-500 flex items-center justify-center font-bold'>{(!!auth)?auth.firstName.charAt(0).toUpperCase():""}</div>
                                <p className='bg-blue-300 px-4 py-2 rounded-2xl max-w-[49%]'>{item[0]}</p>
                            </div>
                            <div className='w-full flex items-center justify-end px-4'>
                                <p className='bg-slate-300 px-4 py-2 rounded-2xl max-w-[49%]'>{item[1]}</p>
                            </div>
                        </div>
                    ))}
                    {showQuery && <div className='flex flex-col gap-4'>
                                    <div className='w-full flex items-center justify-start gap-3'>
                                        <div className='h-10 w-10 rounded-full border-2 bg-slate-500 flex items-center justify-center font-bold'>{(!!auth)?auth.firstName.charAt(0).toUpperCase():""}</div>
                                        <p className='bg-blue-300 px-4 py-2 rounded-2xl max-w-[49%]' style={{ wordBreak: 'break-all' }}>{query}</p>
                                    </div>
                                    <div className='w-full flex items-center justify-end px-4'>
                                        <p className='bg-slate-300 px-4 py-2 rounded-2xl max-w-[49%]' style={{ wordBreak: 'break-all' }}>{answer}</p>
                                    </div>
                                </div>}
                    <div ref={scrollable}></div>
                </div>
                <div className='h-1/6 w-5/6 flex justify-start items-center gap-5'>
                    {!showQuery && <input type='text' className='w-full h-10 rounded-full py-2 px-4 bg-slate-500 outline-none font-semibold text-white' value={query} onChange={e => setQuery(e.target.value)} placeholder='Message...' onKeyDown={onPressEnter}></input>}
                    {showQuery && <div className='w-full h-10 rounded-full py-2 px-4 bg-slate-500 outline-none font-semibold text-white'></div>}
                    <button className='text-white font-semibold rounded-full px-4 py-2 bg-blue-500' onClick={handleClick}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Reports