import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import axios from "axios";
import { backend_url, server } from '../../server';
import { AiOutlineDelete } from 'react-icons/ai';
import RenderExpandableCell from "../Layout/RenderExpandableCell";
import { toast } from "react-toastify";
import { BsPencil } from 'react-icons/bs';

const AllSponsors = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${server}/sponsors/get-all-sponsors`, { withCredentials: true }).then((res) => {
            setSponsors(res.data.sponsors);
            setIsLoading(false);
        }).catch((e) => setIsLoading(false));
    }, []);

    const handleDelete = async (id) => {
        let e = window.confirm("Do you want to Delete it?");
        if (e) {
            await axios.delete(
                `${server}/sponsors/delete-sponsor/${id}`,
                { withCredentials: true, }
            ).then(({ data }) => {
                if (data.success) {
                    toast.success("Sponsor deleted successfully!");
                    navigate("/admin-sponsors");
                    window.location.reload();
                }
            }).catch((error) => {
                toast.error(error.response.data.message);
            });
        }
    };

    const handleEdit = (data) => {
        navigate(`/admin-sponsor/new?_id=${data.id}&title=${data.title}&description=${data.description}&buttonText=${data.buttonText}&buttonLink=${data.buttonLink}&image=${data.image}`);
    }

    const columns = [
        {
            field: "title",
            headerName: "Title",
            minWidth: 130,
            flex: 0.8,
            renderCell: params => <RenderExpandableCell {...params} />
        },
        {
            field: "description",
            headerName: "Description",
            minWidth: 130,
            flex: 0.8,
            renderCell: params => <RenderExpandableCell {...params} />
        },
        {
            field: "buttonText",
            headerName: "Button Text",
            minWidth: 130,
            flex: 0.8,
            renderCell: params => <RenderExpandableCell {...params} />
        },
        {
            field: "buttonLink",
            headerName: "Button Link",
            minWidth: 130,
            flex: 0.8,
            renderCell: params => <RenderExpandableCell {...params} />
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

    sponsors &&
        sponsors.forEach((item) => {
            row.push({
                id: item._id,
                title: item.title,
                description: item.description,
                buttonText: item.buttonText,
                buttonLink: item.buttonLink,
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
                <Link to={'/admin-sponsor/new'}>
                    <Button variant="outlined">
                        Add New Slider
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

export default AllSponsors