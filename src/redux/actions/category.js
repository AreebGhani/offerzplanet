import axios from "axios";
import { server } from "../../server";

// create product
export const createCategory = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "categoryCreateRequest",
        });

        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };

        const { data } = await axios.post(
            `${server}/categories/create-category`,
            newForm,
            config
        );
        dispatch({
            type: "categoryCreateSuccess",
            payload: data.category,
        });
    } catch (error) {
        dispatch({
            type: "categoryCreateFail",
            payload: error.response.data.message,
        });
    }
};

// get All Products of a shop
export const getAllCategories = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllCategoriesRequest",
        });

        const { data } = await axios.get(`${server}/categories/get-all-categories`, { withCredentials: true });
        dispatch({
            type: "getAllCategoriesSuccess",
            payload: data.categories,
        });
    } catch (error) {
        dispatch({
            type: "getAllCategoriesFailed",
            payload: error.response.data.message,
        });
    }
};

// delete product of a shop
export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteCategoryRequest",
        });

        const { data } = await axios.delete(
            `${server}/categories/delete-category/${id}`,
            { withCredentials: true, }
        );
        dispatch({
            type: "deleteCategorySuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteCategoryFailed",
            payload: error.response.data.message,
        });
    }
};