
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Joi from 'joi';
import axios from 'axios'
import avatar from '../service/avatar';


export const Register = () => {
    const navigate = useNavigate()
    const [details,setDetails] = useState({username:"",email:"",password:"",avatar:""})

    const handleChange =(e)=>{
            const {name,value} = e.target;
              setDetails({...details,[name]:value})
            
    }

    const validateForm =(user)=>{
        const schema = Joi.object({
            username:Joi.string().min(3).required(),
            email:Joi.string().email({tlds:false}).required(),
            password:Joi.string().min(6).required(),
            avatar:Joi.object().required()
        })
        return schema.validate(user)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!details?.avatar) return alert("Please Select Your Avatar")
        
        const {error} =  validateForm(details);
        if(error){
            alert(error.details[0].message)
        }else{
          console.log(details,"else block");
          try {
              const res = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/register`,details);
              localStorage.setItem("token",res.headers["x-auth-token"])
              navigate("/")
            } catch (err) {
              console.log(err);
              if(err && err.response && err.response.data){
                  alert(err.response.data)
              }     
            }
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
        <input type="text" placeholder='UserName' name="username" value={details.username} onChange={handleChange} className='h-[2rem] w-[100%] border border-indigo-600 outline-none rounded-md px-2' />
        <input type="text" name="email" value={details.email} onChange={handleChange}   placeholder='Email' className='h-[2rem] w-[100%] border border-indigo-600 outline-none rounded-md px-2'/>
        <input type="password" name="password" value={details.password} onChange={handleChange} className='h-[2rem] w-[100%] border border-indigo-600 outline-none rounded-md px-2' placeholder='Password'/>
        {/* <input type="file" name="avatar"  onChange={handleChange} className=''/> */}
          <div className='flex gap-x-3 w-[100%] overflow-auto h-full px-3'>
            {avatar?.map(avatar=><img onClick={()=>setDetails({...details,avatar:avatar})} key={avatar.id} src={avatar.imgSrc} alt={avatar.name}  className={`w-[3rem] h-[3rem] rounded-full ${details?.avatar?.name===avatar.name ? "border-2 border-indigo-700" : "border border-slate-300" } `}/>)}
             
          </div>
        <button type="submit" className='h-[2rem] rounded-md bg-green-600 hover:bg-red-600 w-[100%] text-white text-xl'>Register</button>
        </form>
    </div>
    <div className='account'>
        <p className='text-indigo-500 underline text-md mt-2'>Already have a Account ?</p>
      <NavLink to="/login"> <button className='h-[2rem] rounded-md bg-indigo-600 w-[100%] text-white text-xl'>Login</button></NavLink>
    </div>

</div>

</div>
  )
}

