import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from '../../server';

const CreateSponsor = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [buttonLink, setButtonLink] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newForm = new FormData();
        newForm.append("image", image);
        newForm.append("title", title);
        newForm.append("description", description);
        newForm.append("buttonText", buttonText);
        newForm.append("buttonLink", buttonLink);

        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };

        await axios.post(
            `${server}/sponsors/create-sponsor`,
            newForm,
            config
        ).then(({ data }) => {
            if (data.success) {
                toast.success("Sponsor added successfully!");
                navigate("/admin-sponsors");
                window.location.reload();
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        });
    };

    return (
        <div className="w-[90%] m-10 800px:w-[50%] bg-white  shadow h-[70vh] rounded-[4px] p-3 overflow-auto">
            <h5 className="text-[30px] font-Poppins text-center">Add New Slider</h5>
            <form onSubmit={handleSubmit}>
                <br />
                <div>
                    <label className="pb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={title}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter slide title..."
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={description}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter slide description..."
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Button Text <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={buttonText}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Enter slide button text..."
                    />
                </div>
                <br />
                <div>
                    <label className="pb-2">
                        Button Link <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={buttonLink}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setButtonLink(e.target.value)}
                        placeholder="Enter slide button link..."
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

export default CreateSponsor