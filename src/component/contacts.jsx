import React from 'react';

export const Contacts = ({detail,handleChat,online}) => {
    return (
        <div onClick={()=>handleChat(detail)} className='cursor-pointer'>
            <div className='grid grid-cols-12 px-3 py-1'>
                <div className='col-span-2'>
                    <div className='relative'>
                        <img className='w-[2.5rem] h-[2.5rem] rounded-md' src={`${(detail?.profilePicture) ? `${import.meta.env.VITE_APP_BACKEND_URL}/${detail?.profilePicture}` : "/logo1.jpg" } `} alt="pic" />
                    </div>
                </div>
                <div className='col-span-10'>
                    <div className='flex justify-between'>
                        <h1 className='capitalize'>{detail.username}</h1>
                        <div className='flex gap-x-2'>
                            <h1 className={`${online==="online" ? "bg-green-600 w-[0.5rem] h-[0.5rem] rounded-full px-1 flex items-center" : ""} `}></h1>
                            {/* <h2 className='bg-orange-300 rounded-full w-[1.5rem] h-[1.5rem] items-center flex flex-col'>2</h2> */}
                        </div>
                    </div>
                    <div className='grid grid-cols-12'>
                        <p className='col-span-9 text-xs'>{detail?.desc ? detail?.desc : ""}</p>
                        {/* <p className='text-xs col-span-3 '>{online}</p> */}
                    </div>
                </div>
            </div>
            <hr className='mb-1' />
        </div>
    )
}
