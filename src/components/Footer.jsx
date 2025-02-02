import { Link } from "react-router-dom";
import { socialLinks } from "../constants";
import { useState } from 'react';

const Footer = () => {
  // 🔹 使用 `useState` 追踪是否正在悬停 WeChat 图标
  const [isWeChatHovered, setIsWeChatHovered] = useState(false);

  return (
    <footer className='footer font-poppins'>
      <hr className='border-slate-200' />

      <div className='footer-container'>
        <p>
          © 2025 Created by <strong>KunCheng Li</strong>. All rights reserved. 
          <br />
          This website is for personal educational use only. If there are any copyright infringements, please contact me.
        </p>

        {/* 🔹 社交图标 */}
        <div className='flex gap-3 justify-center items-center relative'>
          {socialLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.link} 
              target='_blank'
              className="relative"
              onMouseEnter={() => link.name === "WeChat" && setIsWeChatHovered(true)}
              onMouseLeave={() => link.name === "WeChat" && setIsWeChatHovered(false)}
            >
              {/* 默认社交图标 */}
              <img
                src={link.iconUrl}
                alt={link.name}
                className='w-6 h-6 object-contain'
              />

              {/* 🔹 只在 WeChat 被悬停时，显示二维码 */}
              {link.name === "WeChat" && isWeChatHovered && (
                <img
                  src="src/assets/images/wechatQRcode.png" // 确保路径正确
                  alt="WeChat QR Code"
                  style={{ width: "250px", height: "300px", maxWidth: "none", display: "block", left: "50px"}}
                  className="absolute top-[-1280%] transform -translate-x-1/2 shadow-lg transition-opacity duration-300"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;