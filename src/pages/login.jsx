import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate()
  const [details,setDetails] = useState({email:"",password:""})

  const handleChange =(e)=>{
    const {name,value} = e.target;
    setDetails({...details,[name]:value})
  }

  // console.log(details);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/login`,details);
      localStorage.setItem("token",res.headers["x-auth-token"])
      navigate("/")
    } catch (err) {
      console.log(err);
      alert(err.response.data)

    }
  }

  return (
    <div className='h-[100vh] bg-indigo-600 flex flex-col items-center justify-center'>
        <div className='h-fit bg-white md:w-[20%] w-[90%] mx-auto  px-3 py-2 rounded-md'>
            <div className='flex justify-center items-center gap-x-3'>
                <img src="/logo2.jpg" alt="logo" className='w-[3rem] h-[3rem] rounded-full'/>
                <p className='text-3xl'>JustChat</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-y-3">
                <input type="text" name="email" value={details.email} onChange={handleChange} className='h-[2rem] w-[100%] border border-indigo-600 outline-none rounded-md px-2'  placeholder='Email'/>
                <input type="password" name="password" value={details.password} onChange={handleChange} className='h-[2rem] w-[100%] border border-indigo-600 outline-none rounded-md px-2' placeholder='Password'/>
                <button type="submit" className='h-[2rem] rounded-md bg-green-600 hover:bg-red-600 w-[100%] text-white text-xl'>Login</button>
                </form>
            </div>
            <div className='account'>
                <p className='text-indigo-500 underline text-md mt-2'>Don't have a Account ?</p>
              <NavLink to="/register"> <button className='h-[2rem] rounded-md bg-indigo-600 w-[100%] text-white text-xl'>Register</button></NavLink>
            </div>

        </div>

    </div>
  )
}