import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { Contacts } from '../component/contacts';
import { TiDeleteOutline } from 'react-icons/ti'
// import { NoMessage } from '../component/noMessage';
import { MessageContainer } from '../component/messageContainer';


export const Conversation = () => {
  const [currentuser, setCurrentUser] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [allUser, SetallUser] = useState([]);
  const [online, setOnline] = useState([])
  const [history, setHistory] = useState([])
  const [View, setView] = useState(false);
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const [profile, setProfile] = useState(false)
  const [userprofile, setUserProfile] = useState(false);
  const [viewprofile, setViewProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editUserProfile,setEditUserProfile] = useState({usename:"",desc:""})




  useEffect(() => {
    const getAuth = localStorage.getItem("token");
    //   console.log(getAuth,"getAuth");
    if (!getAuth) {
      navigate("/login")
    }
  }, [navigate, currentuser])


  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user`);
        // console.log(data,"data");
        const decode = jwtDecode(localStorage.getItem("token"))
        const filterData = data.filter(user => user._id !== decode._id)
        SetallUser(filterData)
        setCurrentUser(decode)
      } catch (err) {
        console.log(err);
      }
    } fetch()
  }, []);

 useEffect(()=>{
  setEditUserProfile({usename:currentuser.username,desc:currentuser.desc})
 },[currentuser])

  const handleChat = (detail) => {
    setSelectedUser(detail)
    setView(!View)
    setProfile(false)
    setUserProfile(false);
  }


  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser("")
    setUserProfile(false)
  }

  const handleViewProfile = () => {
    setUserProfile(false);
    setViewProfile(true)
    setEditProfile(false)
  }

  const handleEditProfile = () => {
    setUserProfile(false);
    setViewProfile(false)
    setEditProfile(true)
  }

  const handleEditChange = (e)=>{
    const {name,value} = e.target;
    setEditUserProfile({...editUserProfile,[name]:value})
  }

  const updateProfile = async (e)=>{
    e.preventDefault();
    // console.log(editUserProfile);
    try {
      const {data} = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user/update/${currentuser._id}`,editUserProfile);
        //  console.log(res);
      setCurrentUser(data)
      setEditProfile(false);
      setViewProfile(true);
    } catch (err) {
      console.log(err);
    }
  }
 
  console.log(currentuser,"current user");

  const userData = search.length > 1 ? allUser.filter(user => user.username.includes(search)) : allUser;

  return (
    <div className='flex flex-col gap-y-4 h-[100vh] bg-orange-200 p-2'>
      <div className='grid grid-cols-1 md:grid-cols-12 md:gap-x-4'>
        <div className={`md:col-span-3 bg-white rounded-md flex flex-col gap-y-2 ${View ? "hidden md:visible md:col-span-3 bg-white rounded-md md:flex flex-col gap-y-2" : "visible h-[98vh]  md:h-[100%]"}`}>

          <div className=' px-4 py-3'>
            <div className='flex justify-between'>
              <h1>Contacts</h1>
              <div className='flex items-center gap-x-2'>
                <h1 className=''>{userData.length}</h1>
                <BsThreeDotsVertical onClick={() => setUserProfile(!userprofile)} className='cursor-pointer' />
              </div>
            </div>
            <div className='flex items-center w-[100%] gap-x-2 px-2 py-1 border border-slate-300 rounded-md'>
              <BsSearch />
              <div className='flex items-center justify-between w-[100%] z-5 relative'>
                <input type="text" name="search" id="search" value={search} onChange={handleSearch} className='outline-none w-[80%]' placeholder='Search' />
                {search.length > 1 && <TiDeleteOutline className='text-xl text-red-500 cursor-pointer' onClick={() => setSearch("")} />}
                <div className={`${userprofile ? "visible" : "hidden"} absolute z-10 top-0 bg-indigo-600 px-5 w-[80%] text-white right-0 text-center rounded-b-lg rounded-l-lg `}>
                  {/* profile */}
                  <h3 className='text-xl'>Welcome to JustChat</h3>
                  <ul className='my-2'>
                    <li className='hover:bg-black rounded-md cursor-pointer' onClick={handleViewProfile}>View Profile</li>
                    <li className='hover:bg-black rounded-md cursor-pointer' onClick={handleEditProfile}>Edit Profile</li>
                    <li className='hover:bg-black rounded-md cursor-pointer' onClick={logout}>Logout</li>
                  </ul>
                </div>

                {/* view profile */}
                <div className={`${viewprofile ? "visible" : "hidden"} absolute flex flex-col justify-center items-center z-10 top-0 bg-indigo-600 px-3 py-5  w-[80%] text-white right-0 text-center rounded-b-lg rounded-l-lg `}>
                  <div className='flex justify-between items-center w-[100%] mb-4'><h3 className='text-xl'>My Profile</h3><TiDeleteOutline className='text-2xl cursor-pointer' onClick={() => setViewProfile(false)} /> </div>
                  <img src={currentuser.profilePicture ? `${import.meta.env.VITE_APP_BACKEND_URL}/${currentuser?.profilePicture}` : "/logo1.jpg"} alt="pic" className='w-[3.5rem] border-2 p-1 border-white md:w-[5rem] h-[3.5rem] md:h-[5rem]  rounded-full ' />
                  <h4 className='text-2xl text-white capitalize'> {currentuser.username}</h4>
                  <h6 className='text-sm text-green-300'>{currentuser.email}</h6>
                  <p className='text-md text-white '>About: {currentuser.desc}</p>
                </div>

            {/* edit profile */}
                <div className={`${editProfile ? "visible" : "hidden"} absolute flex flex-col justify-center items-center z-10 top-0 bg-indigo-600 px-3 py-5  w-[80%] text-white right-0 text-center rounded-b-lg rounded-l-lg `}>
                  <div className='flex justify-between items-center w-[100%] mb-4'><h3 className='text-xl'>Edit my Profile</h3><TiDeleteOutline className='text-2xl cursor-pointer' onClick={() => setEditProfile(false)} /> </div>
                  <img src={currentuser.profilePicture ? `${import.meta.env.VITE_APP_BACKEND_URL}/${currentuser?.profilePicture}` : "/logo1.jpg"} alt="pic" className='w-[3.5rem] border-2 p-1 border-white md:w-[5rem] h-[3.5rem] md:h-[5rem]  rounded-full ' />
                  <div className='flex flex-col gap-y-2 mt-4 text-indigo-500 w-[100%]'>
                  <input type="text" name="username" value={editUserProfile.usename} onChange={handleEditChange} className='h-8 border w-[100%] border-indigo-500 px-2 outline-none rounded-md'  placeholder='UserName' />
                  <input type="text" name="desc" value={editUserProfile.desc} onChange={handleEditChange} className='h-8 border border-indigo-500 w-[100%] px-2 outline-none rounded-md'  placeholder='About' />
                  <button className='bg-green-600 h-8 rounded-md  text-white' onClick={updateProfile}>Update</button>     
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={"h-[80vh] overflow-auto overflow-y-auto "}>
              {userData.length > 0 ? userData.map(user => <Contacts key={user._id} detail={user} online={online?.filter(userme => userme.userId === user._id).length > 0 ? "online" : "offline"} handleChat={handleChat} />)
                : <p>No User Right Now!</p>} </div>
          </div>
        </div>

        <div className={`${View ? "visible  md:flex flex-col md:col-span-9 bg-white rounded-md" : 'hidden md:flex flex-col md:col-span-9 bg-white rounded-md'} `}>
          {/* <NoMessage /> */}
          <MessageContainer setOnline={setOnline} online={online} setView={setView} profile={profile} setProfile={setProfile} setSelectedUser={setSelectedUser} setHistory={setHistory} selectedUser={selectedUser} currentuser={currentuser} />
        </div>
      </div>

    </div>
  )
}
