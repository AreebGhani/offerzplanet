import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import RenderExpandableCell from "../Layout/RenderExpandableCell";
import { getAllSellers } from "../../redux/actions/sellers";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning = adminOrders && adminOrders.reduce((acc, item) => acc + item.totalPrice * .10, 0);

  const adminBalance = adminEarning?.toFixed(2);

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

  if (adminOrderLoading || isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full p-4">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Total Earning
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">Rs.{adminBalance}</h5>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Sellers
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{sellers && sellers.length}</h5>
          <Link to="/admin-sellers">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminOrders && adminOrders.length}</h5>
          <Link to="/admin-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={3}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default AdminDashboardMain;
