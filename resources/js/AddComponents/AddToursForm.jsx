// import React from "react";

// const AddToursForm = ({ editingTour, setShowForm ,handleUpdate, setReloadTrigger,showForm,setEditingTour}) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [tourForm, setTourForm] = useState({
//         title: "",
//         category_id: "",
//         description: "",
//         includes: "",
//         excludes: "",
//         image: null,
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingTour) {
//             setTourForm({
//                 ...editingTour,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setTourForm({
//                 title: "",
//                 category_id: "",
//                 description: "",
//                 includes: "",
//                 excludes: "",
//                 image: null,
//             });
//         }
//     }, [editingTour]);

//     // Handle Create Category
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourcategories.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating category", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in tourForm) {
//             if (tourForm[key] !== null && tourForm[key] !== "") {
//                 formData.append(key, tourForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingTour) {
//                 // Editing existing tour
//                 await handleUpdate(formData, editingTour.id);
//             } else {
//                 // Creating new tour
//                 await handleCreate(formData);
//             }
//             setTourForm({
//               title: "",
//         category_id: "",
//         description: "",
//         includes: "",
//         excludes: "",
//         image: null,
//             });

//             setShowForm(false);
//             setEditingTour(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setTourForm((prev) => ({
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
//                         Add New Category
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

// export default AddToursForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2, ImagePlus, ChevronDown, Loader2 } from "lucide-react";

const AddToursForm = ({
    editingTour,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
    showForm,
    setEditingTour,
    allCategory = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const emptyForm = {
        title: "",
        category_id: "",
        description: "",
        includes: "",
        excludes: "",
    };

    const [tourForm, setTourForm] = useState(emptyForm);
    const [itineraries, setItineraries] = useState([]);

    // ─── Populate form when editing ───────────────────────────────────────────
    useEffect(() => {
        if (editingTour) {
            setTourForm({
                title: editingTour.title || "",
                category_id: editingTour.category_id || "",
                description: editingTour.description || "",
                includes: editingTour.includes || "",
                excludes: editingTour.excludes || "",
            });
            setItineraries(
                (editingTour.itineraries || []).map((i) => ({
                    day: i.day,
                    title: i.title,
                    description: i.description,
                }))
            );
            setNewImages([]);
            setImagePreviews([]);
            setShowForm(true);
        } else {
            resetForm();
        }
    }, [editingTour]);

    // Clean up blob URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const resetForm = () => {
        setTourForm(emptyForm);
        setItineraries([]);
        setNewImages([]);
        setImagePreviews([]);
        setValidationErrors({});
    };

    // ─── Field change ─────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourForm((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // ─── Image handling ───────────────────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setNewImages((prev) => [...prev, ...files]);
        const previews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...previews]);

        // Reset input
        e.target.value = "";
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Itinerary handling ───────────────────────────────────────────────────
    const addItinerary = () => {
        setItineraries((prev) => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" },
        ]);
    };

    const removeItinerary = (index) => {
        setItineraries((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            // Re-number days
            return updated.map((item, i) => ({ ...item, day: i + 1 }));
        });
    };

    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
        // Clear itinerary-specific errors
        const errorKey = `itinerary_${field}_${index}`;
        if (validationErrors[errorKey]) {
            setValidationErrors((prev) => ({ ...prev, [errorKey]: null }));
        }
    };

    // ─── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const errors = {};
        
        if (!tourForm.title.trim()) errors.title = "Title is required.";
        if (!tourForm.category_id) errors.category_id = "Please select a category.";
        if (!tourForm.description.trim()) errors.description = "Description is required.";
        
        itineraries.forEach((item, i) => {
            if (!item.title.trim()) {
                errors[`itinerary_title_${i}`] = "Title is required.";
            }
            if (!item.description.trim()) {
                errors[`itinerary_desc_${i}`] = "Description is required.";
            }
        });
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ─── Create ───────────────────────────────────────────────────────────────
    const handleCreate = async (formData) => {
        await axios.post(route("ourtours.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();

        // Core fields
        Object.entries(tourForm).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // Images
        newImages.forEach((img) => formData.append("images[]", img));

        // Itineraries
        itineraries.forEach((item, i) => {
            formData.append(`itineraries[${i}][day]`, item.day);
            formData.append(`itineraries[${i}][title]`, item.title);
            formData.append(`itineraries[${i}][description]`, item.description);
        });

        try {
            setSubmitting(true);
            if (editingTour) {
                await handleUpdate(formData, editingTour.id);
            } else {
                await handleCreate(formData);
            }
            resetForm();
            setShowForm(false);
            setEditingTour(null);
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                const mapped = {};
                Object.entries(errors).forEach(([key, msgs]) => {
                    mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setValidationErrors(mapped);
            } else {
                console.error("Error saving tour:", error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setShowForm(false);
        setEditingTour(null);
    };

    if (!showForm) return null;

    // ─── Existing images (edit mode) ─────────────────────────────────────────
    const existingImages = editingTour?.images || [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingTour ? "Edit Tour" : "Create New Tour"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                    {/* ── Basic Info ── */}
                    <Field label="Title" required error={validationErrors.title}>
                        <input
                            type="text"
                            name="title"
                            value={tourForm.title}
                            onChange={handleChange}
                            placeholder="e.g. Everest Base Camp Trek"
                            className={inputClass(validationErrors.title)}
                        />
                    </Field>

                    {/* Category */}
                    <Field label="Category" required error={validationErrors.category_id}>
                        <div className="relative">
                            <select
                                name="category_id"
                                value={tourForm.category_id}
                                onChange={handleChange}
                                className={selectClass(validationErrors.category_id)}
                            >
                                <option value="">Select a category</option>
                                {allCategory.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={15}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </Field>

                    {/* Description */}
                    <Field label="Description" required error={validationErrors.description}>
                        <textarea
                            name="description"
                            value={tourForm.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the tour experience..."
                            className={`${inputClass(validationErrors.description)} resize-none`}
                        />
                    </Field>

                    {/* Includes / Excludes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Includes" error={validationErrors.includes}>
                            <textarea
                                name="includes"
                                value={tourForm.includes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="What's included..."
                                className={`${inputClass(validationErrors.includes)} resize-none`}
                            />
                        </Field>
                        <Field label="Excludes" error={validationErrors.excludes}>
                            <textarea
                                name="excludes"
                                value={tourForm.excludes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="What's excluded..."
                                className={`${inputClass(validationErrors.excludes)} resize-none`}
                            />
                        </Field>
                    </div>

                    {/* ── Images ── */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Images
                        </label>

                        {/* Existing images (edit mode) */}
                        {existingImages.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-2">Current images</p>
                                <div className="flex flex-wrap gap-2">
                                    {existingImages.map((img) => (
                                        <img
                                            key={img.id}
                                            src={`/storage/${img.image}`}
                                            alt="tour"
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={src}
                                            alt={`preview-${i}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-indigo-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(i)}
                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload button */}
                        <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-sm text-gray-500 w-fit">
                            <ImagePlus size={17} className="text-indigo-400" />
                            <span>
                                {editingTour ? "Add more images" : "Upload images"}
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {validationErrors["images.0"] && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors["images.0"]}</p>
                        )}
                    </div>

                    {/* ── Itinerary Builder ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Itinerary
                            </label>
                            <button
                                type="button"
                                onClick={addItinerary}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                            >
                                <Plus size={13} />
                                Add Day
                            </button>
                        </div>

                        {itineraries.length === 0 ? (
                            <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
                                No itinerary added yet. Click "Add Day" to start.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {itineraries.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-100 rounded-xl p-4 bg-gray-50/60 relative"
                                    >
                                        {/* Day badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">
                                                Day {item.day}
                                            </span>
                                            {itineraries.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItinerary(index)}
                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <input
                                            value={item.title}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "title", e.target.value)
                                            }
                                            placeholder="Day title (e.g. Arrival in Kathmandu)"
                                            className={`${inputClass(validationErrors[`itinerary_title_${index}`])} mb-2`}
                                        />
                                        {validationErrors[`itinerary_title_${index}`] && (
                                            <p className="text-red-500 text-xs mb-2">
                                                {validationErrors[`itinerary_title_${index}`]}
                                            </p>
                                        )}

                                        {/* Description */}
                                        <textarea
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "description", e.target.value)
                                            }
                                            placeholder="Describe what happens on this day..."
                                            rows={2}
                                            className={`${inputClass(validationErrors[`itinerary_desc_${index}`])} resize-none`}
                                        />
                                        {validationErrors[`itinerary_desc_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {validationErrors[`itinerary_desc_${index}`]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form=""
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                <span>{editingTour ? "Updating..." : "Creating..."}</span>
                            </>
                        ) : (
                            <span>{editingTour ? "Update Tour" : "Create Tour"}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Helper Components ─────────────────────────────────────────────────────────

const Field = ({ label, required, error, children }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const inputClass = (error) =>
    `w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
        error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 focus:border-indigo-400"
    } bg-white placeholder-gray-400`;

const selectClass = (error) =>
    `w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
        error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 focus:border-indigo-400"
    } bg-white`;

export default AddToursForm;
