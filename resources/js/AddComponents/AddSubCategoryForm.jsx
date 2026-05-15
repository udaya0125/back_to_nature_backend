// import { X } from "lucide-react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const AddSubCategoryForm = ({
//     editingSubCategory,
//     setEditingSubCategory,
//     setShowForm,
//     setReloadTrigger,
//     showForm,
//     handleUpdate,
//     allCategory,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         name: "",
//         category_id: "",
//     });

//     useEffect(() => {
//         if (editingSubCategory) {
//             setSubCategoryForm({
//                 name: editingSubCategory.name || "",
//                 category_id: editingSubCategory.category_id || "",
//             });
//             setShowForm(true);
//         } else {
//             setSubCategoryForm({ name: "", category_id: "" });
//         }
//     }, [editingSubCategory]);

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingSubCategory(null);
//         setSubCategoryForm({ name: "", category_id: "" });
//     };

//     const handleCreate = async (formData) => {
//         await axios.post(route("oursubcategories.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         for (const key in subCategoryForm) {
//             if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
//                 formData.append(key, subCategoryForm[key]);
//             }
//         }

//         try {
//             setSubmitting(true);
//             if (editingSubCategory) {
//                 await handleUpdate(formData, editingSubCategory.id);
//             } else {
//                 await handleCreate(formData);
//             }
//             handleClose();
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSubCategoryForm((prev) => ({ ...prev, [name]: value }));
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingSubCategory
//                             ? "Edit SubCategory"
//                             : "Add New SubCategory"}
//                     </h2>
//                     <button
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             SubCategory Name
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={subCategoryForm.name}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter subcategory name"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Category Dropdown */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Category
//                         </label>
//                         <select
//                             name="category_id"
//                             value={subCategoryForm.category_id}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                         >
//                             <option value="">-- Select Category --</option>
//                             {allCategory.map((cat) => (
//                                 <option key={cat.id} value={cat.id}>
//                                     {cat.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Submit */}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingSubCategory
//                                   ? "Update"
//                                   : "Create"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddSubCategoryForm;

import { X } from "lucide-react";
import axios from "axios";
import React, { useState } from "react";

const AddSubCategoryForm = ({
    setShowForm,
    setReloadTrigger,
    showForm,
    allCategory,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategoryForm, setSubCategoryForm] = useState({
        name: "",
        category_id: "",
    });

    const handleClose = () => {
        setShowForm(false);
        setSubCategoryForm({ name: "", category_id: "" });
    };

    const handleCreate = async (formData) => {
        await axios.post(route("oursubcategories.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in subCategoryForm) {
            if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
                formData.append(key, subCategoryForm[key]);
            }
        }

        try {
            setSubmitting(true);
            await handleCreate(formData);
            handleClose();
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({ ...prev, [name]: value }));
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New SubCategory
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SubCategory Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={subCategoryForm.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter subcategory name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={subCategoryForm.category_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">-- Select Category --</option>
                            {allCategory.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryForm;

// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddSubCategoryForm = ({ editingSubCategory, setShowForm, setReloadTrigger,showForm }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         name: "",
//         category_id: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingSubCategory) {
//             setSubCategoryForm({
//                 ...editingSubCategory,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setSubCategoryForm({
//                 name: "",
//                 category_id: "",
//             });
//         }
//     }, [editingSubCategory]);

//     // Handle Create SubCategory
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("subcategories.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating subcategory", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in subCategoryForm) {
//             if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
//                 formData.append(key, subCategoryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingSubCategory) {
//                 // Editing existing subcategory
//                 await handleUpdate(formData, editingSubCategory.id);
//             } else {
//                 // Creating new subcategory
//                 await handleCreate(formData);
//             }
//             setSubCategoryForm({
//                 name: "",
//                 category_id: "",
//             });

//             setShowForm(false);
//             setEditingSubCategory(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setSubCategoryForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };
//     if (!showForm) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New SubCategory
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddSubCategoryForm;
