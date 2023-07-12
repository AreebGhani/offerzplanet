import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import axios from "axios";
import { backend_url, server } from '../../server';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from "react-toastify";
import { BsPencil } from 'react-icons/bs';

const AllBrands = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${server}/brands/get-all-brands`, { withCredentials: true }).then((res) => {
            setBrands(res.data.brands);
            setIsLoading(false);
        }).catch((e) => setIsLoading(false));
    }, []);

    const handleDelete = async (id) => {
        let e = window.confirm("Do you want to Delete it?");
        if (e) {
            await axios.delete(
                `${server}/brands/delete-brand/${id}`,
                { withCredentials: true, }
            ).then(({ data }) => {
                if (data.success) {
                    toast.success("Brand deleted successfully!");
                    navigate("/admin-brands");
                    window.location.reload();
                }
            }).catch((error) => {
                toast.error(error.response.data.message);
            });
        }
    };

    const handleEdit = (data) => {
        navigate(`/admin-brand/new?_id=${data.id}&name=${data.name}&image=${data.image}`);
    }

    const columns = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.6,
            align: 'left'
        },
        {
            field: "image",
            headerName: "Image",
            minWidth: 280,
            flex: 0.6,
            align: 'center',
            renderCell: (params) => <img className='w-auto h-auto object-contain border-none' src={`${backend_url}${params.value}`} alt='img' />,
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
            flex: 0.4,
            minWidth: 100,
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

    brands &&
        brands.forEach((item) => {
            row.push({
                id: item._id,
                name: item.name,
                image: item.image,
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
            <div className='m-5 text-center'>
                <Link to={'/admin-brand/new'}>
                    <Button variant="outlined">
                        Add New Brand
                    </Button>
                </Link>
            </div >
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={2}
                disableSelectionOnClick
                autoHeight
                rowHeight={200}
            />
        </div>
    );

}

export default AllBrands