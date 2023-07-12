import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import CreateCategory from "../components/Admin/CreateCategory";

const AdminDashboardCreateCategory = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={6} />
          </div>
          <div className="w-full justify-center flex">
              <CreateCategory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardCreateCategory