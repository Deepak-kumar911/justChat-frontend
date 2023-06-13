import React from 'react';
import { BsChatDots } from 'react-icons/bs';




export const NoMessage = () => {
    return (
        <div className='grid place-content-center text-center h-[80vh]'>
            <div className='bg-slate-200 border rounded-full w-[5rem] h-[5rem] mx-auto flex place-content-center mb-4'>
                <BsChatDots className='text-4xl text-slate-400 my-auto' />
            </div>
            <h1 className='flec font-bold'>Message</h1>
            <p>No Recent Chat Now. </p>
            <div className='flex gap-x-2 px-2 py-1 bg-blue-600 text-white rounded-md items-center w-340 mx-auto mt-3'>
                <BsChatDots />
                <p>New Message</p>
            </div>
        </div>
    )
}
