import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const EditCategoryForm = ({ 
    showForm, 
    setShowForm, 
    setReloadTrigger, 
    editingCategory, 
    setEditingCategory 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: "" });

    useEffect(() => {
        if (editingCategory) {
            setCategoryForm({ name: editingCategory.name });
        }
    }, [editingCategory]);

    const handleClose = () => {
        setShowForm(false);
        setEditingCategory(null);
        setCategoryForm({ name: "" });
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Update error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", categoryForm.name);

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingCategory.id);
            handleClose();
        } catch (error) {
            console.error("Error updating category:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!showForm || !editingCategory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Category
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={categoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Electronics"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryForm;