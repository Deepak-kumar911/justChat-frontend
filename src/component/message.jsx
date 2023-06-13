import React, { useEffect, useRef } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export const Message = ({own, message}) => {
    const scrollRef = useRef()
  
    useEffect(()=>{
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    },[message])
  
    const date = new Date(message.createdAt).getTime() ? new Date(message.createdAt).getTime() : new Date()

    const sender = "p-2 border border-orange-200  rounded-t-lg rounded-l-lg  bg-orange-200 text-black";
    const receiver = "p-2 border border-indigo-700  rounded-t-lg rounded-r-lg  bg-indigo-700 text-white";
    return (
        <div className={`mt-2 grid ${own ? "place-items-end" : ""}`} ref={scrollRef}>
            <div className={`flex flex-col gap-y-1 max-w-[50%]  ${own ? "items-end" : "items-start"}`}>
                <div className={own ? sender : receiver}>
                    <p>{message.text}</p>
                </div>
                <div className='text-sm  flex gap-x-1'>
                    <p className='text-slate-400'>{timeAgo.format(date)}</p> 
                    {own && <div className='w-[1rem] h-[1rem] rounded-full bg-orange-200'></div>
                    }</div>
            </div>
        </div>
    )
}
