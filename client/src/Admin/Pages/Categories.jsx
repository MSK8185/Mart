import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  addNewCategory,
  updateExistingCategory,
  removeCategory,
  clearNotification,
  clearError,
} from "../../store/categorySlice";
import CategoryList from "../components/CategoryList";
import CategoryForm from "../components/CategoryForm";
import ConfirmModal from "../../components/ConfirmModal";
import CategoryDetail from "../components/CategoryDetail";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, notification, error } = useSelector(
    (state) => state.categories
  );

  const [editingCategory, setEditingCategory] = useState(null);
  const [detailCategory, setDetailCategory] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // State for deletion confirmation dialog
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (notification || error) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
        dispatch(clearError()); // clear the error after 3 sec
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, error, dispatch]);

  const handleAddCategory = async (formData) => {
    setActionLoading(true);
    const resultAction = await dispatch(addNewCategory(formData));
    setActionLoading(false);

    // Check if the action was rejected
    if (addNewCategory.rejected.match(resultAction)) {
      console.error("Add category rejected:", resultAction.payload);
    }
  };

  const handleUpdateCategory = async (id, formData) => {
    setActionLoading(true);
    const resultAction = await dispatch(updateExistingCategory({ id, categoryData: formData }));
    setActionLoading(false);

    // Check if the action was successful before closing modal
    if (!updateExistingCategory.rejected.match(resultAction)) {
      closeModal();
    } else {
      console.error("Update category rejected:", resultAction.payload);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    // Open the confirmation dialog and store the category info
    setCategoryToDelete({ id, name });
    setIsConfirmDeleteOpen(true);
  };

  // This function is called when user confirms deletion in the custom dialog
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setActionLoading(true);
    const resultAction = await dispatch(removeCategory({
      id: categoryToDelete.id,
      name: categoryToDelete.name
    }));
    setActionLoading(false);

    if (removeCategory.rejected.match(resultAction)) {
      console.error("Delete category rejected:", resultAction.payload);
    }

    // Clear the category to delete after action is completed
    setCategoryToDelete(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const openDetailModal = (category) => {
    setDetailCategory(category);
    setDetailModal(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setIsModalOpen(false);
  };
  const closeDetailModal = () => {
    setDetailCategory([]);
    setDetailModal(false);
  };

  return (
    <div className="container mx-auto p-4 font-poppins">
      {/* Notification System */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg z-50 max-w-md">
          {notification}
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white py-3 px-6 rounded-xl shadow-lg z-50 max-w-md">
          {error}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={categoryToDelete ? `Are you sure you want to delete category "${categoryToDelete.name}"?` : ""}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Category Management</h1>

        <button
          onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-500 transition"
        >
          {showAddCategoryForm ? "Close Form" : "+ Add Category"}
        </button>
      </div>

      {/* Show loading spinner for actions */}
      {actionLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
          <div className="flex flex-col justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-blue-500">Processing...</span>
          </div>
        </div>
      )}

      {showAddCategoryForm && (
        <CategoryForm
          onSubmit={handleAddCategory}
          editingCategory={null}
          setEditingCategory={setEditingCategory}
        />
      )}

      <CategoryList
        categories={categories}
        onDelete={handleDeleteCategory}
        onDetails={openDetailModal}
        onEdit={openEditModal}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <CategoryForm
              onSubmit={(formData) => handleUpdateCategory(editingCategory._id, formData)}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
            />
            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {detailModal && (
        <CategoryDetail
          category={detailCategory}
          closeModal={closeDetailModal}
        />
      )}
    </div>
  );
};

export default Categories;