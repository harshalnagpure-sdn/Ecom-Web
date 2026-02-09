import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/images/ui/logo.png";
import { cleanEnvVar } from "../../utils/envUtils";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1E1E1E] text-white pt-[48px] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Logo" className="w-[60px] h-[60px] mb-4" />
            <p className="font-normal text-base leading-6 text-[#FFFFFFB2]">
              Where Fashion Meets Intelligence
            </p>
          </div>
    
          {/* Product */}
          <div>
            <h3 className="font-bold text-base mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                to='/collections/:collection' 
                className="text-[#FFFFFFB2] hover:text-white">Shop</Link>
              </li>
              <li>
                <Link
                  to="/virtualtryon"
                  className="text-[#FFFFFFB2] hover:text-white"
                >
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link
                  to="/aistylist"
                  className="text-[#FFFFFFB2] hover:text-white"
                >
                  AI Stylist
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-base mb-4">Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/aboutus"
                    className="text-[#FFFFFFB2] hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-[#FFFFFFB2] hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faqs"
                    className="text-[#FFFFFFB2] hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>

              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/securityanddata"
                    className="text-[#FFFFFFB2] hover:text-white">
                    Security
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/termsandprivacy"
                    className="text-[#FFFFFFB2] hover:text-white">
                    Privacy Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/digitalresponsibility"
                    className="text-[#FFFFFFB2] hover:text-white">
                   Digital Responsibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-base mb-4">Connect</h3>
            <div className="flex items-center space-x-4 mb-6">
              <a 
                href={cleanEnvVar(import.meta.env.VITE_TWITTER_ACCOUNT)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#DDAE8C4D] rounded-lg hover:bg-[#DDAE8C66] transition-colors cursor-pointer"
              >
                <RiTwitterXLine className="h-5 w-5" />
              </a>
              <a 
                href={cleanEnvVar(import.meta.env.VITE_INSTAGRAM_ACCOUNT)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#DDAE8C4D] rounded-lg hover:bg-[#DDAE8C66] transition-colors cursor-pointer"
              >
                <IoLogoInstagram className="h-5 w-5" />
              </a>
              <a 
                href={cleanEnvVar(import.meta.env.VITE_LINKEDIN_ACCOUNT)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#DDAE8C4D] rounded-lg hover:bg-[#DDAE8C66] transition-colors cursor-pointer"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="w-full mt-12 border-t border-[#FFFFFF33] py-6 text-center">
          <p className="text-[#FFFFFFB2] text-[16px]">
            © {new Date().getFullYear()} nAia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
