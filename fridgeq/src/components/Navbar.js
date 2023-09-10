import { Link } from 'react-router-dom';
import FridgeWise from '../imgs/FridgeWise.png'

const Navbar = () => {

    return ( 
        <div className="navbar">
            <div className="logoDiv">
                <img src={FridgeWise} alt='FridgeWise Logo'/>
            </div>
            <nav className="bar">
                <div className="links">
                    <Link className="glow-on-hover link" to="/fridge">My Fridge</Link>
                    <Link className="glow-on-hover link" to="/meals">Meals</Link>
                </div>
            </nav>
        </div>
    );
}
 
export default Navbar;