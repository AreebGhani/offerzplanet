import React from "react";
import { BsShopWindow } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer, MdOutlineDashboardCustomize } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";
import { TfiLayoutSlider } from "react-icons/tfi";

const AdminSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard" className="w-full flex items-center">
          <RxDashboard
            size={30}
            color={`${active === 1 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 1 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-orders" className="w-full flex items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 2 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Orders
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-sellers" className="w-full flex items-center">
          <BsShopWindow
            size={30}
            color={`${active === 3 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 3 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Sellers
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-users" className="w-full flex items-center">
          <HiOutlineUserGroup
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 4 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Users
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-products" className="w-full flex items-center">
          <BsHandbag
            size={30}
            color={`${active === 5 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 5 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Products
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-categories" className="w-full flex items-center">
          <BiCategoryAlt
            size={30}
            color={`${active === 6 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 6 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Categories
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-events" className="w-full flex items-center">
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 7 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 7 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Events
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/admin-withdraw-request"
          className="w-full flex items-center"
        >
          <CiMoneyBill
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 8 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            Withdraw Request
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/admin-brands"
          className="w-full flex items-center"
        >
          <SiBrandfolder
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 9 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            All Brands
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/admin-sponsors"
          className="w-full flex items-center"
        >
          <TfiLayoutSlider
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 10 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            Home Slider
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/admin-config"
          className="w-full flex items-center"
        >
          <MdOutlineDashboardCustomize
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 11 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            Configuration
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/profile"
          className="w-full flex items-center"
        >
          <AiOutlineSetting
            size={30}
            color={`${active === 12 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${active === 12 ? "text-[crimson]" : "text-[#555]"
              }`}
          >
            Settings
          </h5>
        </Link>
      </div>

    </div>
  );
};

export default AdminSideBar;
