import React, { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { getAllCategories } from "../../redux/actions/category";
import { toast } from "react-toastify";
import { ReactSortable } from "react-sortablejs";
import { backend_url, server } from "../../server";
import axios from "axios";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");

  const product = products?.filter((p) => p?._id === _id);

  const values = product && product[0]?.properties;

  const parsedValues = values?.map((jsonString) => JSON.parse(jsonString));

  const [images, setImages] = useState((product && product[0]?.images) || []);
  const [name, setName] = useState((product && product[0]?.name) || "");
  const [description, setDescription] = useState((product && product[0]?.description) || "");
  const [category, setCategory] = useState((product && product[0]?.category) || "");
  const [properties, setProperties] = useState(parsedValues || []);
  const [originalPrice, setOriginalPrice] = useState((product && product[0]?.originalPrice) || "");
  const [discountPrice, setDiscountPrice] = useState((product && product[0]?.discountPrice) || "");
  const [stock, setStock] = useState((product && product[0]?.stock) || "");
  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error);
    }
    if (success) {
      setLoading(false);
      toast.dismiss();
      toast.success("Product created successfully!");
      navigate("/dashboard-products");
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
    if (_id) {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      newForm.append("_id", _id);
      await axios.put(
        `${server}/product/${upload ? "update-product-images" : "update-product"}`,
        newForm,
        config
      ).then(({ data }) => {
        setLoading(false);
        if (data.success) {
          toast.success("Product Updated successfully!");
          navigate("/dashboard-products");
          window.location.reload();
        }
      }).catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message);
      });
    } else {
      dispatch(createProduct(newForm));
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
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">{_id ? "Update" : "Create"} Product</h5>
      {/* create product form */}
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
            placeholder="Enter your product name..."
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
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
            required
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
          {properties.length > 0 && properties.map((property, index) => (
            <div key={index} className="flex gap-1 mt-2">
              <input type="text"
                value={property.name}
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
                value={property.values}
                placeholder="Comma Separated Values" />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="mx-1 cursor-pointer text-center px-3 h-[35px] border border-black-300 rounded-[3px] hover:ring-red-500 hover:border-red-500 sm:text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
        <br />
        <div>
          <label className="pb-2">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            required
            min={50}
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
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
            required
            max={originalPrice - 1}
            min={0}
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
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
            required
            min={1}
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
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

export default CreateProduct;
