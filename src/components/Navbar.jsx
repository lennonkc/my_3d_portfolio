import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  return (
    <header className='header'>
      
      <NavLink to='/' className="w-11 h-11 rounded-lg bg-white 
      items-center justify-center flex font-bold shadow-md">
        {/* <img src={logo} alt='logo' className='w-18 h-18 object-contain' /> */}
        <p className="blue-gradient_text text-xl">KC</p>
      </NavLink>

      <nav className='flex text-lg gap-7 font-medium'>
        <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-600" : "text-black" }>
          About
        </NavLink>
        <NavLink to='/projects' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
          Projects
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
