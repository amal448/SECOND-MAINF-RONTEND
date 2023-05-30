import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import swal from 'sweetalert'
import { Link } from "react-router-dom";
import siteLogo from './../../../assets/svg/site-logo.svg'
import { userLogout } from '../../../store/slice/userSlice'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'

function UserNavBar() {
const userToken =localStorage.getItem('user-token')

const {login }= useSelector(state =>state.root.user)
const dispatch=useDispatch()

function logoutHandler(){
  if(userToken){
    swal({
      title: "Are you sure?",
      text:"Are you sure !",
      icon:"warning",
      buttons: true,
      dangerMode :true
    })
    .then((willDelete)=>{
      dispatch(userLogout(willDelete))
    })
  }
}
 
  return (
    <nav className='user-navbar'>
      <div className="logo">
        <img src={siteLogo} alt="" />
        <span>Skin Care</span>
      </div>
      <ul>
        <li>
        <Link to="/" style={{ textDecoration: 'none' }}>
          Home
          </Link>
        </li>
       <li>          
       <Link to="/booking" style={{ textDecoration: 'none' }}>
          Appointment
        </Link>
        </li>
        <li>
          Services
        </li>
        <li>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          About US             
          
        </Link>
        </li>
        <li>
          Contact US
        </li>
        <li>
            {userToken ?
            
          <button onClick={logoutHandler} >LogOut</button>
          :
          <button onClick={()=>window.location='/login'}>Login</button>

          }
        </li>
      </ul>
    </nav >
  )

}

export default UserNavBar