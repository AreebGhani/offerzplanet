import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import CreateSponsor from "../components/Admin/CreateSponsor";

const AdminDashboardCreateSponsor = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={10} />
          </div>
          <div className="w-full justify-center flex">
            <CreateSponsor />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardCreateSponsor