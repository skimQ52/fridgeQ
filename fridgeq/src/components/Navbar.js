import { Link } from 'react-router-dom';

const Navbar = () => {

    return ( 
        <div className="navbar">
            <nav className="bar">
                <div className="links">
                    <Link className="link" to="/fridge">My Fridge</Link>
                </div>
            </nav>
        </div>
    );
}
 
export default Navbar;