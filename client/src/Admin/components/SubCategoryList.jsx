// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ConfirmModal from "../../components/ConfirmModal";

// const SubCategoryList = () => {
//   const [subcategories, setSubCategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [editName, setEditName] = useState("");
//   const [editCategory, setEditCategory] = useState("");
//   const [editImage, setEditImage] = useState(null);
//   const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);
//   const [notification, setNotification] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
//   const [contactToDelete, setContactToDelete] = useState(null);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const subcategoriesPerPage = 5;

//   // Pagination button style
//   const paginationButtonStyle = {
//     padding: "8px 16px",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     margin: "0 5px",
//     cursor: "pointer",
//   };

//   useEffect(() => {
//     fetchSubcategories();
//     fetchCategories();
//     const interval = setInterval(fetchSubcategories, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchSubcategories = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/admin/subcategories"
//       );
//       setSubCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/admin/categories"
//       );
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const openEditModal = (subcategory) => {
//     setSubcategoryToEdit(subcategory);
//     setEditName(subcategory.name);
//     setEditCategory(subcategory.category?._id || "");
//     setEditImage(null);
//     setEditModalVisible(true);
//   };

//   const openDeleteModal = (subcategory) => {
//     setContactToDelete(subcategory);
//     setIsConfirmDeleteOpen(true);
//   };

//   const confirmDeleteContact = async () => {
//     if (!contactToDelete) return;
//     try {
//       await axios.delete(
//         `http://localhost:3000/api/admin/subcategories/${contactToDelete._id}`
//       );
//       setSubCategories((prev) =>
//         prev.filter((sub) => sub._id !== contactToDelete._id)
//       );
//       setNotification("Subcategory deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting subcategory:", error);
//     } finally {
//       setIsConfirmDeleteOpen(false);
//       setContactToDelete(null);
//     }
//   };

//   const handleEditSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", editName);
//       formData.append("category", editCategory);
//       if (editImage) formData.append("image", editImage);

//       const response = await axios.put(
//         `http://localhost:3000/api/admin/subcategories/${subcategoryToEdit._id}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       const updatedSubcategory = response.data;

//       setSubCategories((prev) =>
//         prev.map((sub) =>
//           sub._id === subcategoryToEdit._id ? updatedSubcategory : sub
//         )
//       );

//       setNotification(`Subcategory "${editName}" updated successfully!`);
//       setTimeout(() => setNotification(""), 3000);

//       setEditModalVisible(false);
//       setSubcategoryToEdit(null);
//     } catch (error) {
//       console.error("Error updating subcategory:", error);
//     }
//   };

//   const filteredSubcategories = subcategories.filter((subcategory) =>
//     subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredSubcategories.length / subcategoriesPerPage);
//   const indexOfLast = currentPage * subcategoriesPerPage;
//   const indexOfFirst = indexOfLast - subcategoriesPerPage;
//   const currentSubcategories = filteredSubcategories.slice(indexOfFirst, indexOfLast);

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   return (
//     <>
//       {/* Notification */}
//       {notification && (
//         <div className="fixed top-4 right-4 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg z-50">
//           {notification}
//         </div>
//       )}

//       <ConfirmModal
//         isOpen={isConfirmDeleteOpen}
//         onClose={() => setIsConfirmDeleteOpen(false)}
//         onConfirm={confirmDeleteContact}
//         title="Delete Subcategory"
//         message={
//           contactToDelete
//             ? `Are you sure you want to delete "${contactToDelete.name}"?`
//             : ""
//         }
//         confirmText="Delete"
//         cancelText="Cancel"
//       />

//       {/* Search */}
//       <div className="my-6">
//         <input
//           type="text"
//           placeholder="Search subcategories..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2"
//         />
//       </div>

//       {/* Subcategory List */}
//       <div className="flex flex-col gap-4 my-6">
//         {currentSubcategories.map((subcategory) => (
//           <div
//             key={subcategory._id}
//             className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex items-center justify-between"
//           >
//             <div className="flex items-center space-x-4">
//               {subcategory.image ? (
//                 <img
//                   src={subcategory.image}
//                   alt={subcategory.name}
//                   className="w-16 h-16 object-cover rounded-md"
//                 />
//               ) : (
//                 <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
//                   No Image
//                 </div>
//               )}
//               <div>
//                 <h2 className="text-lg font-semibold">{subcategory.name}</h2>
//                 <h3 className="text-sm text-gray-500">
//                   Category: {subcategory.category?.name || "No Category"}
//                 </h3>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => openEditModal(subcategory)}
//                 className="bg-green-600 text-white px-4 py-2 rounded-md"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => openDeleteModal(subcategory)}
//                 className="bg-red-600 text-white px-4 py-2 rounded-md"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination Controls */}
// <div style={{ marginTop: "20px", textAlign: "center" }}>
//   <button
//     onClick={handlePrev}
//     disabled={currentPage === 1}
//     style={{
//       ...paginationButtonStyle,
//       backgroundColor: "#007bff",
//       opacity: currentPage === 1 ? 0.6 : 1,
//       width: "120px", // Set fixed width to make buttons the same size
//     }}
//   >
//     Previous
//   </button>

//   <span style={{ margin: "0 10px" }}>
//     Page {currentPage} of {totalPages}
//   </span>

//   <button
//     onClick={handleNext}
//     disabled={currentPage === totalPages}
//     style={{
//       ...paginationButtonStyle,
//       backgroundColor: "#28a745",
//       opacity: currentPage === totalPages ? 0.6 : 1,
//       width: "120px", // Set fixed width to make buttons the same size
//     }}
//   >
//     Next
//   </button>
// </div>


//       {/* Edit Modal */}
//       {editModalVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-md w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Subcategory</h2>
//             <input
//               type="text"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//               className="w-full border px-3 py-2 mb-3 rounded"
//               placeholder="Subcategory name"
//             />
//             <select
//               value={editCategory}
//               onChange={(e) => setEditCategory(e.target.value)}
//               className="w-full border px-3 py-2 mb-3 rounded"
//             >
//               <option value="" disabled>
//                 Select category
//               </option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="file"
//               onChange={(e) => setEditImage(e.target.files[0])}
//               className="w-full border px-3 py-2 mb-4 rounded"
//               accept="image/*"
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setEditModalVisible(false)}
//                 className="bg-gray-300 px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditSubmit}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SubCategoryList;


import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal";

const SubCategoryList = () => {
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const subcategoriesPerPage = 5;

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
    const interval = setInterval(fetchSubcategories, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/subcategories");
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openEditModal = (subcategory) => {
    setSubcategoryToEdit(subcategory);
    setEditName(subcategory.name);
    setEditCategory(subcategory.category?._id || "");
    setEditImage(null);
    setEditModalVisible(true);
  };

  const openDeleteModal = (subcategory) => {
    setContactToDelete(subcategory);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/subcategories/${contactToDelete._id}`);
      setSubCategories((prev) =>
        prev.filter((sub) => sub._id !== contactToDelete._id)
      );
      setNotification("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    } finally {
      setIsConfirmDeleteOpen(false);
      setContactToDelete(null);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("category", editCategory);
      if (editImage) formData.append("image", editImage);

      const response = await axios.put(
        `http://localhost:3000/api/admin/subcategories/${subcategoryToEdit._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedSubcategory = response.data;

      setSubCategories((prev) =>
        prev.map((sub) =>
          sub._id === subcategoryToEdit._id ? updatedSubcategory : sub
        )
      );

      setNotification(`Subcategory "${editName}" updated successfully!`);
      setTimeout(() => setNotification(""), 3000);

      setEditModalVisible(false);
      setSubcategoryToEdit(null);
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubcategories.length / subcategoriesPerPage);
  const indexOfLast = currentPage * subcategoriesPerPage;
  const indexOfFirst = indexOfLast - subcategoriesPerPage;
  const currentSubcategories = filteredSubcategories.slice(indexOfFirst, indexOfLast);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg z-50">
          {notification}
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteContact}
        title="Delete Subcategory"
        message={
          contactToDelete ? `Are you sure you want to delete "${contactToDelete.name}"?` : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className="my-6">
        <input
          type="text"
          placeholder="Search subcategories or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Subcategory Name</th>
              <th className="text-left px-4 py-2 border-b">Category</th>
              <th className="text-left px-4 py-2 border-b">Image</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSubcategories.map((subcategory) => (
              <tr key={subcategory._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{subcategory.name}</td>
                <td className="px-4 py-3">{subcategory.category?.name || "No Category"}</td>
                <td className="px-4 py-3">
                  {subcategory.image ? (
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-sm text-gray-400 rounded">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => openEditModal(subcategory)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(subcategory)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 text-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mx-2"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 mx-2"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Subcategory</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
              placeholder="Subcategory name"
            />
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="w-full border px-3 py-2 mb-4 rounded"
              accept="image/*"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalVisible(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategoryList;
