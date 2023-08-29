import { Link } from 'react-router-dom';

const Navbar = () => {

    return ( 
        <div className="navbar">
            <nav className="bar">
                <div className="links">
                    <Link className="glow-on-hover link" to="/fridge">My Fridge</Link>
                    <Link className="glow-on-hover link" to="">Meals</Link>
                </div>
            </nav>
        </div>
    );
}
 
export default Navbar;