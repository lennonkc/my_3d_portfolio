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
        <NavLink to='/about' className={({ isActive }) => isActive ? "rounded-lg  p-2 items-center justify-center flex font-bold shadow-md blue-gradient_text text-xl bg-white" : "text-black p-2 font-bold" }>
          About
        </NavLink>
        <NavLink to='/projects' className={({ isActive }) => isActive ? "rounded-lg bg-white p-2 items-center justify-center flex font-bold shadow-md blue-gradient_text text-xl" : "text-black p-2 font-bold"}>
          Projects
        </NavLink>
        <NavLink to='/gallery' className={({ isActive }) => isActive ? "rounded-lg bg-white p-2 items-center justify-center flex font-bold shadow-md blue-gradient_text text-xl" : "text-black p-2 font-bold"}>
          Gallery
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
