import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import RenderExpandableCell from "../components/Layout/RenderExpandableCell";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered" || params.getValue(params.id, "status") === "Refund Success"
          ? "greenColor"
          : params.getValue(params.id, "status") === "Refund Denied"
            ? "redColor"
            : "orangeColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: "Rs." + item?.totalPrice,
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>
          {
            adminOrderLoading ?
              <div className="flex justify-center items-center w-full h-screen">
                <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
              </div>
              :
              <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
                <div className="w-[97%] flex justify-center">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={8}
                    disableSelectionOnClick
                    autoHeight
                  />
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
