import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllBrands from "../components/Admin/AllBrands";

const AdminDashboardBrand = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={9} />
          </div>
          <AllBrands />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardBrand