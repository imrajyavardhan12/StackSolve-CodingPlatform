import React from "react"
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = ()=>{

    const {authUser} = useAuthStore()

    return (
     <nav className="sticky top-0 z-50 w-full py-5">
      <div className="flex w-full justify-between mx-auto max-w-4xl glass-navbar shadow-lg backdrop-blur-lg p-4 rounded-2xl">
        <Link to="/" className="flex items-center gap-3 cursor-pointer hover-glow transition-all duration-300">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-dark-navy font-bold text-lg animate-glow">
            <img 
              src="/stacksolve-icon.svg" 
              alt="StackSolve Logo" 
              className="h-8 w-8" 
            />
          </div>
          <span className="text-lg md:text-2xl font-bold tracking-tight gradient-text hidden md:block">
            StackSolve
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row hover-scale">
              <div className="w-10 rounded-full ring-2 ring-primary/30 hover:ring-primary/60 transition-all duration-300">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover rounded-full"
                />
              </div>
           
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow glass-effect rounded-box w-52 space-y-3"
            >
              <li>
                <p className="text-base font-semibold text-white">
                  {authUser?.name}
                </p>
                <hr className="border-primary/20" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-primary/20 hover:text-primary text-base font-semibold text-white transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="hover:bg-primary/20 hover:text-primary text-base font-semibold text-white transition-all duration-300"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Add Problem
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="hover:bg-primary/20 hover:text-primary text-white transition-all duration-300">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    )
}

export default Navbar;