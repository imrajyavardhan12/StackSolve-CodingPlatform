import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen gradient-bg">
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Layout