import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import RenderExpandableCell from "../Layout/RenderExpandableCell";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

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

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs." + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={8}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
