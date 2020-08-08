import React from 'react'
import './Header.css'
// import { render } from '@testing-library/react'
import {Link} from 'react-router-dom'

function Header (){
   return(
       <nav>
           <Link to = '/'>Home</Link>
           <Link to = '/login'>Login</Link>
           <Link to = '/signup'>Signup</Link>
           <Link to = '/friends'>Friend Requests</Link>
       </nav>
   )
}

export default Header