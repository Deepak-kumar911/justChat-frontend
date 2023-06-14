import React from 'react'
import { GrAdd } from 'react-icons/gr';
import { IoPaperPlane } from 'react-icons/io5';
import { AiOutlineSmile } from 'react-icons/ai';
import {TiArrowBack} from 'react-icons/ti'
import { useEffect } from 'react';
import { Message } from './message';
import axios from 'axios';
import { useState } from 'react';
import { useRef } from 'react';
import { NoMessage } from './noMessage';
import io from 'socket.io-client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react'
let socket = io.connect(import.meta.env.VITE_APP_BACKEND_URL,{transports: ['websocket', 'polling', 'flashsocket']})

console.log(import.meta.env.VITE_APP_BACKEND_URL,"env url");

export const MessageContainer = ({ selectedUser, setOnline,setSelectedUser, currentuser,setView,online,profile,setProfile }) => {
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [arrivedMessage, setArrivedMessage] = useState("")
    let sendMessage = useRef()
    const [toggleEmoji,setToggleEmoji] = useState(false)
  
    // console.log(selectedUser,"selectedUser");
  
    useEffect(() => {
    //   console.log("calling getmessage");
      socket.on("getMessage", (payload) => setArrivedMessage(()=>payload))
    }, [])
  
    useEffect(() => {
      socket.emit("adduser", currentuser._id);
      // socket.on("getHistory", (history) => setHistory([...history]))
      socket.on("getusers", user => setOnline([...user]))
    }, [currentuser,setOnline])
  
  
    useEffect(() => {
      if(selectedUser){
        setMessages((pre) => [...pre, arrivedMessage])
      }
    }, [arrivedMessage,selectedUser])
  
  
  
  
    useEffect(() => {
      if (selectedUser) {
        // console.log(selectedUser);
        async function fetch() {
          try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/conversation/${currentuser._id}`)
            const oldConversation = data.filter(m => m.members.includes(selectedUser._id))
            // console.log("oldconversation1", oldConversation);
            setConversation(oldConversation[0])
            if (oldConversation.length === 0) {
              // console.log("calling if block");
              try {
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/conversation`, {
                  senderId: currentuser._id, receiverId: selectedUser._id
                });
                // console.log("calling2");
                const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/conversation/${currentuser._id}`)
                const newConversation = data.filter(m => m.members.includes(selectedUser._id));
                // console.log("newConversation", newConversation);
                setConversation(newConversation[0])
              } catch (err) {
                console.log(err);
              }
            }
          } catch (err) {
            console.log(err);
          }
        } fetch()
      } else { }
    }, [selectedUser, currentuser])
  
  
    useEffect(() => {
      if (conversation) {
        // console.log("useeffect2", conversation._id);
        async function fetch() {
          try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/${conversation._id}`)
            // console.log("message of select user:", data);
            setMessages(data)
            // console.log(messages,"connvers");
          } catch (err) {
            alert(err)
          }
        } fetch()
      } else { }
    }, [conversation])
  
  
    const handleSend = async () => {
      const message = sendMessage.current.value
      if (message) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message`, {
            conversationId: conversation._id,
            sender: currentuser._id,
            text: message
          })
  
          setMessages((pre) => [...pre, res.data])
  
          socket.emit("sendmessage", {
            ...res.data,
            receiverId: selectedUser._id,
          })
          sendMessage.current.value = ""
    setToggleEmoji(false)

        } catch (err) {
          alert(err)}
      } else {
        alert('Write message before send')
      }}
    // console.log(messages,"message");
   const handleBack = ()=>{
    // console.log("calling");
    setSelectedUser(null);
    setView(false)
   }



    return (
        <>
        {selectedUser ?  
        <div className='p-4 h-[97vh] md:h-[98vh] overflow-auto'>
            {/* message header */}
            <div className='flex'>
                <div className='w-[15%] md:w-[5%] flex items-center'><img src={selectedUser.profilePicture ? `${import.meta.env.VITE_APP_BACKEND_URL}/${selectedUser?.profilePicture}` : "/logo1.jpg"} className='w-[2.3rem] h-[2.3rem] rounded-md' alt="avatar" /></div>
                <div className='w-[85%] md:w-[95%]'>
                    <div className='flex justify-between items-center'>
                        <h2 className='capitalize'>{selectedUser.username}</h2>
                        <div className='flex gap-x-2'>
                            <h4 className='text-sm text-indigo-600 cursor-pointer' onClick={()=>setProfile(!profile)}>View Profile</h4>
                            <div onClick={handleBack} className='md:hidden cursor-pointer text-sm border flex items-center  rounded-md bg-orange-200 px-1'><TiArrowBack/> Back</div>
                        </div>

                    </div>
                    <div className='flex items-center gap-x-2'>
                        {online?.filter(userme=>userme.userId===selectedUser._id).length>0 ? 
                        <div className='flex items-center gap-x-1'>
                            <div className='w-[0.6rem] h-[0.6rem] rounded-full bg-indigo-700 border-2 border-slate-400 '></div>
                            <div className='text-indigo-700'>Online</div>
                        </div> : <div className='text-orange-400'>Offline</div> }
                        {/* <h6 className='text-xs text-slate-400'>12:55 am</h6> */}
                    </div>
                </div>
            </div>
                        <hr  className='border-indigo-500 border'/>

            {/* message area */}
     
            <div>     
            <div className='h-[76vh] z-5 md:h-[79vh] relative overflow-auto'>
            <div className={`${profile ? "z-10 bg-black sticky top-5 px-4 py-2 w-[80%] md:w-[25%] mx-auto mt-5 flex flex-col items-center  rounded-md" : "hidden"} `}>
                <img src={selectedUser.profilePicture ? `${import.meta.env.VITE_APP_BACKEND_URL}/${selectedUser?.profilePicture}` : "/logo1.jpg" } alt="pic" className='w-[3.5rem] md:w-[5rem] border-2 p-1 border-white h-[3.5rem] md:h-[5rem] rounded-full '/>
                <h4 className='text-2xl text-indigo-500 capitalize'> {selectedUser.username}</h4>
                <h6 className='text-sm text-violet-600'>{selectedUser.email}</h6>
                <p className='text-md text-white  text-center'>Desc: {selectedUser.desc}</p>

            </div>
            {messages.length>0 ? messages?.map((message,ind) =><Message  key={message._id+(new Date())} own={message?.sender === currentuser._id} message={message} />)
                : <NoMessage/> }
                    <div className={`${toggleEmoji ? "visible" : "hidden"} w-[100%] absolute bottom-0 right-0`}>
                    <Picker data={data} onEmojiSelect={(data)=>sendMessage.current.value=sendMessage.current.value+data.native}/>
                    </div>
            </div>

            {/* message sending area */}
            <div className='mt-4'>
                <div className='flex justify-between border border-slate-300  rounded-md items-center px-2 py-1 w-[100%]'>
                    <div className='flex gap-x-3 w-[100%]'>
                        <div className='px-2 bg-orange-200 flex items-center rounded-md'><GrAdd /></div>
                        <input type="text" ref={sendMessage} placeholder=' Your message' className='w-[80%] border-none outline-none' />
                    </div>
                    <div className='flex gap-x-3 items-center'>
                        <div><AiOutlineSmile  className='text-2xl text-indigo-800' onClick={()=>setToggleEmoji(!toggleEmoji)}/></div>
                        <div className='flex border border-orange-200 cursor-pointer bg-orange-200 items-center gap-x-1 py-1 px-3 rounded-md' onClick={handleSend}>
                            <p>Send</p>
                            <IoPaperPlane />
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </div>
            : <div className='p-4 h-[98vh] overflow-auto flex flex-col justify-center items-center'>
                <div className='w-fit h-fit rounded-md bg-indigo-500 text-white p-2 text-center'>
                    <h2 className='text-xl'>Welcome to JustChat, <span className='capitalize '>{currentuser.username}</span></h2>
                    <p>Please select User to Chat </p>
                </div>
                </div> }
        </>
    )
}
