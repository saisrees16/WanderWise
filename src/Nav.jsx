// Nav.jsx
import logo from './assets/logo-removebg-preview.png';
import { Link } from 'react-router-dom';

const Nav = () => {
    return (
        <div className="flex items-center justify-between sticky top-0 bg-white/75 z-10 shadow-gray-500/85 shadow-md">
            <div className="flex items-center">
                <img src={logo} alt="img" className="h-auto w-63 "/>
            </div>
            <div className="flex items-center p-3 text-xl gap-3">
                <Link to="/" className=" hover:bg-orange-300 hover:text-black rounded-full px-2 py-1 ">Home</Link>
                <Link to="/about" className=" hover:bg-orange-300 hover:text-black rounded-full px-2 py-1 transition ">About Us</Link>
                <Link to="/contact" className=" hover:bg-orange-300 hover:text-black rounded-full px-2 py-1 ">Contact</Link>
                <Link to="/login" className="bg-black text-white hover:bg-orange-400 hover:text-black rounded-full px-2 py-1">Login</Link>
            </div>
        </div>
    );
}
export default Nav;