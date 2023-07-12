import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
import { getAllCategories } from "../../redux/actions/category";
import { ReactSortable } from "react-sortablejs";
import { backend_url, server } from "../../server";
import axios from "axios";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, events } = useSelector((state) => state.events);
  const { categories } = useSelector((state) => state.categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");

  const event = events?.filter((e) => e?._id === _id);

  const values = event && event[0]?.properties;

  const parsedValues = values?.map((jsonString) => JSON.parse(jsonString));

  const [images, setImages] = useState((event && event[0]?.images) || []);
  const [name, setName] = useState((event && event[0]?.name) || "");
  const [description, setDescription] = useState((event && event[0]?.description) || "");
  const [category, setCategory] = useState((event && event[0]?.category) || "");
  const [properties, setProperties] = useState(parsedValues || []);
  const [originalPrice, setOriginalPrice] = useState((event && event[0]?.originalPrice) || "");
  const [discountPrice, setDiscountPrice] = useState((event && event[0]?.discountPrice) || "");
  const [stock, setStock] = useState((event && event[0]?.stock) || "");
  const [startDate, setStartDate] = useState(event && isNaN(new Date(event[0]?.start_Date)) && null);
  const [endDate, setEndDate] = useState(event && isNaN(new Date(event[0]?.Finish_Date)) && null);
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    !_id && setEndDate(null);
    document.getElementById("end-date").min = minEndDate.toISOString.slice(0, 10);
  }

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate ? new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";

  useEffect(() => {
    if (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error);
    }
    if (success) {
      setLoading(false);
      toast.dismiss();
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [error, success, navigate]);

  const handleImageChange = (e) => {
    e.preventDefault();
    _id && setImages([]);
    _id && setUpload(true);
    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newForm = new FormData();
    if (images.length === 0) {
      setLoading(false);
      toast.error("Image required!");
      return;
    }
    images.forEach((image) => {
      newForm.append("images", image);
    });
    properties.forEach((propertie) => {
      newForm.append("properties", JSON.stringify(propertie));
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    newForm.append("start_Date", startDate.toISOString());
    newForm.append("Finish_Date", endDate.toISOString());
    if (_id) {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      newForm.append("_id", _id);
      await axios.put(
        `${server}/event/${upload ? "update-event-images" : "update-event"}`,
        newForm,
        config
      ).then(({ data }) => {
        setLoading(false);
        if (data.success) {
          toast.success("Event Updated successfully!");
          navigate("/dashboard-events");
          window.location.reload();
        }
      }).catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message);
      });
    } else {
      dispatch(createevent(newForm));
    }
  };

  function updateImagesOrder(images) {
    setImages(images);
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <div className="w-full 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">{_id ? "Update" : "Create"} Event</h5>
      {/* create event form */}
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
            placeholder="Enter your event product name..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your event product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categories &&
              categories.map((i) => (
                <option value={i._id} key={i._id}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="mt-3 cursor-pointer text-center px-3 h-[35px] border border-black-300 rounded-[3px] hover:ring-blue-500 hover:border-blue-500 sm:text-sm">
            Add New Property
          </button>
          {properties?.length > 0 && properties?.map((property, index) => {
            return (
              <div key={index} className="flex gap-1 mt-2">
                <input type="text"
                  value={property?.name}
                  className="mx-1 appearance-none text-left block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                  placeholder="Property Name: " />
                <input type="text"
                  className="mx-1 appearance-none text-left block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={ev =>
                    handlePropertyValuesChange(
                      index,
                      property,
                      ev.target.value
                    )}
                  value={property?.values}
                  placeholder="Comma Separated Values" />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="mx-1 cursor-pointer text-center px-3 h-[35px] border border-black-300 rounded-[3px] hover:ring-red-500 hover:border-red-500 sm:text-sm">
                  Remove
                </button>
              </div>
            )
          })}
        </div>
        <br />
        <div>
          <label className="pb-2">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            min={50}
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your event product price..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discount"
            max={originalPrice - 1}
            min={0}
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your event product price with discount..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            min={1}
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your event product stock..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
            required
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
            required
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            name="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <label htmlFor="upload">
            <BsUpload size={30} className="mt-5 mr-5 cursor-pointer" color="#555" />
          </label>
          <div className="w-full flex items-center flex-wrap mt-3">
            <ReactSortable
              list={images}
              className="flex flex-wrap gap-1"
              setList={updateImagesOrder}>
              {images?.length !== 0 &&
                images?.map((i, index) => (
                  _id ?
                    !upload ?
                      <img
                        src={`${backend_url}${i}`}
                        key={index}
                        alt=""
                        className="h-[120px] w-[120px]"
                      />
                      :
                      <img
                        src={URL.createObjectURL(i)}
                        key={index}
                        alt=""
                        className="h-[120px] w-[120px]"
                      />
                    :
                    <img
                      src={URL.createObjectURL(i)}
                      key={index}
                      alt=""
                      className="h-[120px] w-[120px]"
                    />
                ))}
            </ReactSortable>
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
  );
};

export default CreateEvent;
