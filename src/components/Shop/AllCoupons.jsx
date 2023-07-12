import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import RenderExpandableCell from "../Layout/RenderExpandableCell";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import { toast } from "react-toastify";
import { BsPencil } from 'react-icons/bs';

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [value, setValue] = useState("");
  const { seller } = useSelector((state) => state.seller);
  const { products, isLoading } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setCouponsLoading(false);
        setCoupouns(res.data.couponCodes);
      }).catch((e) => setCouponsLoading(false));
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    let e = window.confirm("Do you want to Delete it?");
    if (e) {
      axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true }).then((res) => {
        toast.success("Coupon code deleted succesfully!")
      })
      window.location.reload();
    }
  };

  const handleEdit = (data) => {
    setId(data.id);
    setName(data.name);
    setValue(data.price.slice(0, -1));
    setSelectedProduct(getSelectedProductID(data.product));
    setMinAmount(data.minAmount);
    setMaxAmount(data.maxAmount);
    setOpen(true);
    setUpdate(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (update) {
      await axios
        .put(
          `${server}/coupon/update-coupon-code/${id}`,
          {
            name,
            minAmount,
            maxAmount,
            selectedProduct,
            value,
            shopId: seller._id,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setLoading(false);
          toast.success("Coupon code updated successfully!");
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setOpen(false)
          toast.error(error.response.data.message);
        });
    } else {
      await axios
        .post(
          `${server}/coupon/create-coupon-code`,
          {
            name,
            minAmount,
            maxAmount,
            selectedProduct,
            value,
            shopId: seller._id,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setLoading(false);
          toast.success("Coupon code created successfully!");
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setOpen(false)
          toast.error(error.response.data.message);
        });
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "minAmount",
      headerName: "Min",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "maxAmount",
      headerName: "Max",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "product",
      headerName: "Selected Product",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "Edit",
      flex: 0.4,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleEdit(params.row)}>
              <BsPencil size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  function getSelectedProduct(item) {
    let selectedProduct = products?.filter(p => p._id === item.selectedProduct);
    return selectedProduct[0]?.name;
  }

  function getSelectedProductID(name) {
    let selectedProduct = products?.filter(p => p.name === name);
    return selectedProduct[0]?._id;
  }

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item?._id,
        name: item?.name,
        price: item?.value + "%",
        minAmount: item?.minAmount,
        maxAmount: item?.maxAmount,
        product: getSelectedProduct(item),
      });
    });

  if (isLoading || couponsLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <div className="w-full flex justify-end">
        <div
          className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
          onClick={() => {
            setId("");
            setName("");
            setValue("");
            setSelectedProduct("");
            setMinAmount("");
            setMaxAmount("");
            setUpdate(false);
            setOpen(true);
          }}
        >
          <span className="text-white">Create Coupon Code</span>
        </div>
      </div>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={8}
        disableSelectionOnClick
        autoHeight
      />
      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[100] flex items-center justify-center overflow-y-scroll">
          <div className="w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow p-4 overflow-y-scroll">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setUpdate(false);
                }}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              {update ? "Update" : "Create"} Coupon code
            </h5>
            {/* create coupoun code */}
            <form onSubmit={handleSubmit}>
              <br />
              <div>
                <label className="pb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your coupon code name..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Discount Percentenge{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  min={0}
                  value={value}
                  required
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter your coupon code percentage value..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  min={0}
                  value={minAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Enter your coupon code min amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  min={minAmount + 1}
                  value={maxAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Enter your coupon code max amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Selected Product</label>
                <select
                  className="w-full mt-2 border h-[35px] rounded-[5px]"
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="Choose your selected products">
                    Choose a selected product
                  </option>
                  {products &&
                    products.map((i) => (
                      <option value={i._id} key={i._id}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <div>
                <input
                  type="submit"
                  value={loading ? "Loading..." : update ? "Update" : "Create"}
                  className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
