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
import { X, Plus, Trash2, ImagePlus, ChevronDown } from "lucide-react";

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

    const emptyItinerary = { day: "", title: "", description: "" };

    const [tourForm, setTourForm] = useState(emptyForm);
    const [itineraries, setItineraries] = useState([{ ...emptyItinerary }]);

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
                editingTour.itineraries?.length
                    ? editingTour.itineraries.map((i) => ({
                          day: i.day,
                          title: i.title,
                          description: i.description,
                      }))
                    : [{ ...emptyItinerary }]
            );
            setNewImages([]);
            setImagePreviews([]);
            setShowForm(true);
        } else {
            resetForm();
        }
    }, [editingTour]);

    const resetForm = () => {
        setTourForm(emptyForm);
        setItineraries([{ ...emptyItinerary }]);
        setNewImages([]);
        setImagePreviews([]);
        setValidationErrors({});
    };

    // ─── Field change ─────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourForm((prev) => ({ ...prev, [name]: value }));
    };

    // ─── Image handling ───────────────────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);

        const previews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    // ─── Itinerary handling ───────────────────────────────────────────────────
    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addItinerary = () =>
        setItineraries((prev) => [...prev, { ...emptyItinerary }]);

    const removeItinerary = (index) =>
        setItineraries((prev) => prev.filter((_, i) => i !== index));

    // ─── Create ───────────────────────────────────────────────────────────────
    const handleCreate = async (formData) => {
        // Do NOT set Content-Type manually — browser must set it with the multipart boundary
        await axios.post(route("ourtours.store"), formData);
        setReloadTrigger((prev) => !prev);
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        const formData = new FormData();

        // Core fields
        Object.entries(tourForm).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // Images — append each file under "images[]"
        // Laravel sees this as the "images" array
        newImages.forEach((img) => formData.append("images[]", img));

        // Itineraries — Laravel requires this exact dot/bracket format
        // itineraries[0][day], itineraries[0][title], itineraries[0][description]
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
            // Laravel 422 — surface the exact field errors
            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                console.error("Validation errors:", errors);
                setValidationErrors(errors);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
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
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto flex-1 px-6 py-5 space-y-6"
                >
                    {/* ── Validation error banner ── */}
                    {Object.keys(validationErrors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-700 mb-1">
                                Please fix the following errors:
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {Object.entries(validationErrors).map(([field, messages]) =>
                                    messages.map((msg, i) => (
                                        <li key={`${field}-${i}`} className="text-xs text-red-600">
                                            {msg}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}

                    {/* ── Basic Info ── */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Basic Info
                        </h3>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={tourForm.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Everest Base Camp Trek"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="category_id"
                                    value={tourForm.category_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white pr-8"
                                >
                                    <option value="">Select a category</option>
                                    {allCategory.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={tourForm.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Describe the tour experience..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Includes / Excludes */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Includes
                                </label>
                                <textarea
                                    name="includes"
                                    value={tourForm.includes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="What's included..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Excludes
                                </label>
                                <textarea
                                    name="excludes"
                                    value={tourForm.excludes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="What's excluded..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── Images ── */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Images
                        </h3>

                        {/* Existing images (edit mode) */}
                        {existingImages.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">
                                    Current images
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                                        >
                                            <img
                                                src={`/storage/${img.image}`}
                                                alt="tour"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {imagePreviews.map((src, i) => (
                                    <div
                                        key={i}
                                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-indigo-200 group"
                                    >
                                        <img
                                            src={src}
                                            alt={`preview-${i}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(i)}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <X size={16} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload button */}
                        <label className="flex items-center gap-2 w-fit cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-500 rounded-lg px-4 py-2.5 text-sm transition-colors">
                            <ImagePlus size={18} />
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
                    </section>

                    {/* ── Itineraries ── */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Itinerary
                            </h3>
                            <button
                                type="button"
                                onClick={addItinerary}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                <Plus size={14} />
                                Add Day
                            </button>
                        </div>

                        <div className="space-y-3">
                            {itineraries.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                            Day {index + 1}
                                        </span>
                                        {itineraries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItinerary(index)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Day No. <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={item.day}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "day",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                min="1"
                                                placeholder="1"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                placeholder="e.g. Arrival in Kathmandu"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItineraryChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            rows={2}
                                            placeholder="What happens on this day..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form=""
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : editingTour ? (
                            "Update Tour"
                        ) : (
                            "Create Tour"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToursForm;
