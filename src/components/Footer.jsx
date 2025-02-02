import { Link } from "react-router-dom";

import { socialLinks } from "../constants";

const Footer = () => {
  return (
    <footer className='footer font-poppins'>
      <hr className='border-slate-200' />

      <div className='footer-container'>
        <p>
          © 2025 Created by <strong> KunCheng Li</strong>. All rights reserved. 
          {/* <br></br>Webstyle designed by  */}
          {/* <a href='https://github.com/adrianhajdin/3D_portfolio?tab=readme-ov-file' target='_blank' rel='noreferrer'> Adrian Hajdin</a>. */}
        </p>

        <div className='flex gap-3 justify-center items-center'>
          {socialLinks.map((link) => (
            <Link key={link.name} to={link.link} target='_blank'>
              <img
                src={link.iconUrl}
                alt={link.name}
                className='w-6 h-6 object-contain'
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
