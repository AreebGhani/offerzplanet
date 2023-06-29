import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import CreateBrand from "../components/Admin/CreateBrand";

const AdminDashboardCreateCategory = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={9} />
          </div>
          <div className="w-full justify-center flex">
            <CreateBrand />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardCreateCategory