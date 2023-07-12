import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../redux/actions/category";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import { backend_url, server } from '../../server';

const CreateCategory = () => {
    const { success, error } = useSelector((state) => state.categories);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const _id = searchParams.get("_id");
    const existingName = searchParams.get("name");
    const existingImage = searchParams.get("image");
    const [name, setName] = useState(existingName || "");
    const [image, setImage] = useState(existingImage || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) {
            setLoading(false)
            toast.dismiss();
            toast.error(error);
        }
        if (success) {
            setLoading(false)
            toast.dismiss();
            toast.success("Category created successfully!");
            navigate("/admin-categories");
            window.location.reload();
        }
    }, [error, success, navigate]);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (image === null || image === "") {
            setLoading(false);
            toast.error("Image required!");
            return;
        }
        const newForm = new FormData();
        newForm.append("image", image);
        newForm.append("name", name);

        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };

        if (_id && existingName && existingImage) {
            newForm.append("_id", _id);
            await axios.put(
                `${server}/categories/${image === existingImage ? "update-category" : "update-category-image"}`,
                newForm,
                config
            ).then(({ data }) => {
                setLoading(false);
                if (data.success) {
                    toast.success("Category Updated successfully!");
                    navigate("/admin-categories");
                    window.location.reload();
                }
            }).catch((error) => {
                setLoading(false);
                toast.error(error.response.data.message);
            });
        } else {
            dispatch(createCategory(newForm));
        }
    };

    return (
        <div className="w-[90%] m-10 800px:w-[50%] bg-white  shadow h-[70vh] rounded-[4px] p-3 overflow-auto">
            <h5 className="text-[30px] font-Poppins text-center">Create Category</h5>
            <form onSubmit={handleSubmit}>
                <br />
                <div>
                    <label className="pb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your new category name..."
                        required
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Upload Image <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        name="upload"
                        id="upload"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <div className="w-full flex items-center flex-wrap">
                        {image ?
                            image === existingImage ? (
                                <>
                                    <img
                                        src={`${backend_url}${existingImage}`}
                                        alt="category"
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-full"
                                    />
                                    <label htmlFor="upload" className='cursor-pointer'>
                                        <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
                                    </label>
                                </>
                            )
                                : (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="category"
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-full"
                                    />
                                )
                            : (
                                <label htmlFor="upload" className='cursor-pointer'>
                                    <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
                                </label>
                            )}
                    </div>
                    <br />
                    <div>
                        <input
                            type="submit"
                            value={loading ? "Loading..." : _id ? "Update" : "Create"}
                            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateCategory