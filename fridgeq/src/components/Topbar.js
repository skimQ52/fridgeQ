import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

const Topbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <nav>
          {user && ( // if have a user
            <div>
                <span>{user.email}</span>
                <button className='topbarButton' onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && ( // if no user
            <div>
                <Link className='topbarButton' to="/login">Login</Link>
                <Link className='topbarButton' to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Topbar