import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import RenderExpandableCell from "../Layout/RenderExpandableCell";
import { Button } from "@material-ui/core";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellers } from "../../redux/actions/sellers";

const AllWithdraw = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState('Processing');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [showDetails, setShowDetails] = useState(null);


  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);
  

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    {
     field: "id",
     headerName: "Withdraw Id",
     minWidth: 130,
     flex: 0.8,
     renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Succeed"
          ? "greenColor"
          : params.getValue(params.id, "status") === "Denied"
            ? "redColor"
            : "orangeColor";
      },
    },
    {
      field: "createdAt",
      headerName: "Requested At",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "View Details",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => {
              setOpenView(true);
              setShowDetails(params.row);
            }}>
              <AiOutlineEye size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => {

        return (
          <BsPencil
            size={20}
            className={`${params.row.status !== "Processing" ? 'hidden' : ''} mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`, {
        sellerId: withdrawData.shopId,
        status: withdrawStatus,
      }, { withCredentials: true })
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
        setLoading(false);
        window.location.reload();
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "Rs." + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex items-center pt-5 justify-center">
          <div className="w-[95%] bg-white">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={8}
              disableSelectionOnClick
              autoHeight
            />
          </div>
          {open && (
            <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
              <div className="w-[70%] min-h-[40vh] bg-white rounded shadow p-10">
                <div className="flex justify-end w-full">
                  <RxCross1 className="cursor-pointer" size={25} onClick={() => setOpen(false)} />
                </div>
                <h1 className="text-[25px] text-center font-Poppins">
                  Update Withdraw status
                </h1>
                <br />
                <select
                  name=""
                  id=""
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="w-[200px] h-[35px] border rounded"
                >
                  <option value={withdrawStatus}>{withdrawData.status}</option>
                  <option value="Succeed">Succeed</option>
                  <option value="Denied">Denied</option>
                </select>
                <button
                  type="submit"
                  className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
                  onClick={handleSubmit}
                >
                  {loading ? "Loading..." : "Update"}
                </button>
              </div>
            </div>
          )}
          {openView && (
            <div className="w-full fixed p-10 h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
              <div className="w-[70%] min-h-[40vh] bg-white rounded shadow p-10">
                <div className="flex justify-end w-full">
                  <RxCross1 className="cursor-pointer" size={25} onClick={() => setOpenView(false)} />
                </div>
                <h1 className="text-[25px] text-center font-Poppins">
                  View Details
                </h1>
                <div className="m-3 mt-5">
		    {sellers?.filter((o) => o._id === showDetails?.shopId).map(({withdrawMethod}) => {
                       return (
                          <div key={withdrawMethod.bankAccountNumber}>
                            <b className="mr-3">Account Number:</b> {withdrawMethod.bankAccountNumber}<br/>
                            <b className="mr-3">Bank Address:</b> {withdrawMethod.bankAddress}<br/>
                            <b className="mr-3">Bank Country:</b> {withdrawMethod.bankCountry}<br/>
                            <b className="mr-3">Account Holder Name:</b> {withdrawMethod.bankHolderName}<br/>
                            <b className="mr-3">Bank Name:</b> {withdrawMethod.bankName}<br/>
                            <b className="mr-3">Bank Swift Code:</b> {withdrawMethod.bankSwiftCode}<br/>
                          </div>
                        )
		     })
		    }
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllWithdraw;