import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2 } from "lucide-react";

const AddActivitiesForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingActivity,
    setEditingActivity,
    handleUpdate,
    allCategory,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const defaultForm = {
        title: "",
        category_id: "",
        sub_category_id: "",
        description: "",
        includes: "",
        excludes: "",
    };

    const [activitiesForm, setActivitiesForm] = useState(defaultForm);
    const [selectedImages, setSelectedImages] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        if (editingActivity) {
            setActivitiesForm({
                title: editingActivity.title || "",
                category_id: editingActivity.category_id || "",
                sub_category_id: editingActivity.sub_category_id || "",
                description: editingActivity.description || "",
                includes: editingActivity.includes || "",
                excludes: editingActivity.excludes || "",
            });
            setItineraries(
                editingActivity.itineraries?.map((it) => ({
                    day: it.day,
                    title: it.title,
                    description: it.description,
                })) || [],
            );
            setSelectedImages([]);
        } else {
            setActivitiesForm(defaultForm);
            setItineraries([]);
            setSelectedImages([]);
        }
        setServerError(null);
    }, [editingActivity]);

    useEffect(() => {
        if (activitiesForm.category_id && allCategory?.length) {
            const found = allCategory.find(
                (cat) => String(cat.id) === String(activitiesForm.category_id),
            );
            setSubCategories(found?.sub_categories || []);
        } else {
            setSubCategories([]);
        }
    }, [activitiesForm.category_id, allCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivitiesForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeSelectedImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const addItinerary = () => {
        setItineraries((prev) => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" },
        ]);
    };

    const removeItinerary = (index) => {
        setItineraries((prev) =>
            prev
                .filter((_, i) => i !== index)
                .map((it, i) => ({ ...it, day: i + 1 })),
        );
    };

    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
        );
    };

    const buildFormData = () => {
        const formData = new FormData();
        formData.append("title", activitiesForm.title);
        formData.append("category_id", activitiesForm.category_id);
        formData.append("sub_category_id", activitiesForm.sub_category_id);
        formData.append("description", activitiesForm.description);
        if (activitiesForm.includes)
            formData.append("includes", activitiesForm.includes);
        if (activitiesForm.excludes)
            formData.append("excludes", activitiesForm.excludes);

        selectedImages.forEach((file) => {
            formData.append("images[]", file);
        });

        itineraries.forEach((it, index) => {
            formData.append(`itineraries[${index}][day]`, it.day);
            formData.append(`itineraries[${index}][title]`, it.title);
            formData.append(
                `itineraries[${index}][description]`,
                it.description,
            );
        });

        return formData;
    };

    const handleCreate = async (formData) => {
        await axios.post(route("ouractivities.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        const formData = buildFormData();

        try {
            setSubmitting(true);
            if (editingActivity) {
                await handleUpdate(formData, editingActivity.id);
            } else {
                await handleCreate(formData);
            }
            setActivitiesForm(defaultForm);
            setItineraries([]);
            setSelectedImages([]);
            setShowForm(false);
            setEditingActivity(null);
        } catch (error) {
            console.error("Error saving activity:", error);
            const responseData = error.response?.data;
            console.log("Error response data:", responseData);
            let msg = "Something went wrong. Please try again.";
            if (responseData?.errors) {
                msg = Object.values(responseData.errors).flat().join(", ");
            } else if (responseData?.message) {
                msg = responseData.message;
            }

            setServerError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingActivity(null);
        setActivitiesForm(defaultForm);
        setItineraries([]);
        setSelectedImages([]);
        setServerError(null);
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingActivity ? "Edit Activity" : "Add New Activity"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Server error banner */}
                {serverError && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={activitiesForm.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Activity title"
                        />
                    </div>

                    {/* Category & Sub-category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={activitiesForm.category_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {allCategory?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Category{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="sub_category_id"
                                value={activitiesForm.sub_category_id}
                                onChange={handleChange}
                                required
                                disabled={!activitiesForm.category_id}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={activitiesForm.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Activity description"
                        />
                    </div>

                    {/* Includes & Excludes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Includes
                            </label>
                            <textarea
                                name="includes"
                                value={activitiesForm.includes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="What's included"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Excludes
                            </label>
                            <textarea
                                name="excludes"
                                value={activitiesForm.excludes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="What's excluded"
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Images
                        </label>
                        <input
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {selectedImages.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSelectedImage(index)
                                            }
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {editingActivity?.images?.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">
                                    Existing images (adding new images won't
                                    remove these):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {editingActivity.images.map((img) => (
                                        <img
                                            key={img.id}
                                            src={`/${img.image}`}
                                            alt="existing"
                                            className="w-20 h-20 object-cover rounded-lg border opacity-70"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Itineraries - Updated Layout */}
                    {/* Itineraries - Day and Title on same row */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Itineraries
                            </label>
                            <button
                                type="button"
                                onClick={addItinerary}
                                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition"
                            >
                                <Plus size={16} />
                                Add Day
                            </button>
                        </div>

                        {itineraries.length === 0 && (
                            <p className="text-sm text-gray-400 italic">
                                No itinerary days added yet.
                            </p>
                        )}

                        <div className="space-y-4">
                            {itineraries.map((it, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 relative"
                                >
                                    <div className="flex justify-end mb-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItinerary(index)
                                            }
                                            className="text-red-400 hover:text-red-600 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Day label and Title input on same row */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
                                            Day {it.day}:
                                        </span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={it.title}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="Day title"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Description below */}
                                    <div>
                                        <textarea
                                            value={it.description}
                                            onChange={(e) =>
                                                handleItineraryChange(
                                                    index,
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            rows={2}
                                            placeholder="Day description"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {submitting
                                ? "Saving..."
                                : editingActivity
                                  ? "Update Activity"
                                  : "Create Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddActivitiesForm;

// import React from 'react'

// const AddActivitiesForm = () => {
//     const [submitting, setSubmitting] = useState(false);
//     const [activitiesForm, setActivitiesForm] = useState({
//        title: "",
//        category_id: "",
//        sub_category_id: "",
//          description: "",
//          include: "",
//          excludes: "",
//             image: null,

//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingActivity) {
//             setActivitiesForm({
//                 ...editingActivity,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setActivitiesForm({
//                 name: "",
//             });
//         }
//     }, [editingActivity]);

//     // Handle Create Activity
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ouractivities.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating activity", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in activitiesForm) {
//             if (activitiesForm[key] !== null && activitiesForm[key] !== "") {
//                 formData.append(key, activitiesForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingActivity) {
//                 // Editing existing activity
//                 await handleUpdate(formData, editingActivity.id);
//             } else {
//                 // Creating new activity
//                 await handleCreate(formData);
//             }
//             setActivitiesForm({
//                 name: "",
//             });

//             setShowForm(false);
//             setEditingActivity(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setActivitiesForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//      if (!showForm) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New Activity
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
//   )
// }

// export default AddActivitiesForm
