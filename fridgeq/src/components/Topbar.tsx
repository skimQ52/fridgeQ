import React from "react"
import {Link} from 'react-router-dom'
import {useLogout} from '../hooks/useLogout.ts'
import {useAuthContext} from '../hooks/useAuthContext.ts';
import {usePage} from '../context/PageContext.tsx';

const Topbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { currentPage } = usePage();

  const handleClick = () => {
    logout()
  }

  return (
    <div className="flex absolute w-full h-12 bg-gray-200 z-10 drop-shadow-md items-center gap-10">
      {user && (
          <h2 className="text-2xl absolute left-72 first-letter:capitalize">{user.name}'s {currentPage}</h2>
      )}
      <div className="absolute right-8 flex items-center">
        <nav>
          {user && (
            <div>
                <span>{user.email}</span>
                <button className='topbarButton glow-on-hover' onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
                <Link className='topbarButton glow-on-hover' to="/login">Login</Link>
                <Link className='topbarButton glow-on-hover' to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}

export default Topbar