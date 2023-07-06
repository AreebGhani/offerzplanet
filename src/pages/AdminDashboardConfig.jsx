import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminConfig from "../components/Admin/AdminConfig";

const AdminDashboardConfig = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={11} />
          </div>
          <div className="w-full justify-center flex">
            <AdminConfig />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardConfig;