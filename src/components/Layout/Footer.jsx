import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import logo from "../../Assests/img/logo.png";
import payment from "../../Assests/img/footer-payment.webp";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <div className="bg-[#000] text-white">
      <div className="flex justify-around items-center sm:px-12 px-4 bg-[#ec1c2c] py-7">
        <h1 className="lg:text-4xl sm:text-sm md:mb-0 mb-6 font-semibold md:w-[60%] lg:w-[60%] w-1/2">
          <span className="text-[#fff]">For more information feel free to contact us</span>
        </h1>
        <div>
          <a href="tel:+923090855822" className="bg-transparent cursor-pointer hover:bg-white text-white font-semibold hover:text-[#ec1c2c] border border-white hover:border-transparent rounded-full duration-300 px-5 py-2.5 text-black sm:text-sm">
            Contact Us
          </a>
        </div>
      </div>
      <div className="sm:px-8 px-5 py-8 text-center">
        <ul className="px-5 flex flex-col justify-center items-center">
          <img
            src={logo}
            alt=""
            className="h-1/3 w-1/3"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <br />
          <p>Connect Customers With Sellers.</p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        {/*<ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>*/}

      </div>

      <div
        className="flex flex-col md:flex-row lg:flex-row justify-between items-center text-center px-10 text-gray-400 text-sm pb-8"
      >
        <span>© {date} Offerzplanet. All rights reserved.</span>
        {/*<span>Terms · Privacy Policy</span>*/}
          <img
            src={payment}
            alt=""
            className="mt-5 md:mt-0 lg:mt-0"
          />
      </div>
    </div>
  );
};

export default Footer;
