import axios from "axios";

const API = axios.create({
  baseURL: "http://20.40.59.234:3000/api/admin/categories/",
});

export const getCategories = () => API.get("/");
export const addCategory = (categoryData) => {
  return API.post("/addCategories", categoryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateCategory = (id, formData) => API.put(`/${id}`, formData);
export const deleteCategory = (id) => API.delete(`/${id}`);
