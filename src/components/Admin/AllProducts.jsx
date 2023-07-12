import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import RenderExpandableCell from "../Layout/RenderExpandableCell";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`${server}/product/admin-all-products`, { withCredentials: true }).then((res) => {
      setData(res.data.products);
      setIsLoading(false);
    }).catch((e) => setIsLoading(false))
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      renderCell: params => <RenderExpandableCell {...params} />
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs." + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={8}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllProducts;
