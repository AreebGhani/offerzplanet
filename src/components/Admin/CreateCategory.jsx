import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../redux/actions/category";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
    const { success, error } = useSelector((state) => state.categories);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (success) {
            toast.success("Category created successfully!");
            navigate("/admin-categories");
            window.location.reload();
        }
    }, [error, success]);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newForm = new FormData();
        newForm.append("image", image);
        newForm.append("name", name);
        dispatch(createCategory(newForm));
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
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Upload Image <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        name=""
                        id="upload"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                    />
                    <div className="w-full flex items-center flex-wrap">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="category"
                                width={100}
                                height={100}
                                className="object-cover rounded-full"
                            />
                        ) : (
                            <label htmlFor="upload" className='cursor-pointer'>
                                <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
                            </label>
                        )}
                    </div>
                    <br />
                    <div>
                        <input
                            type="submit"
                            value="Create"
                            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateCategory