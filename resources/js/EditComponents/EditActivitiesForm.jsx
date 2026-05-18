import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditActivitiesForm = ({
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
    const [imagePreviews, setImagePreviews] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    // ─── Quill modules and formats ──────────────────────────────────────────
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "clean"],
            ["blockquote", "code-block"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "blockquote",
        "code-block",
    ];

    useEffect(() => {
        if (editingActivity && showForm) {
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
            setImagePreviews([]);
            setServerError(null);
        }
    }, [editingActivity, showForm]);

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

    // Clean up blob URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivitiesForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRichTextChange = (field, value) => {
        setActivitiesForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prev) => [...prev, ...files]);

        const previews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    const removeSelectedImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        const formData = buildFormData();

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingActivity.id);
            setActivitiesForm(defaultForm);
            setItineraries([]);
            setSelectedImages([]);
            setImagePreviews([]);
            setShowForm(false);
            setEditingActivity(null);
        } catch (error) {
            console.error("Error updating activity:", error);
            const responseData = error.response?.data;
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
        // Clean up preview URLs
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setShowForm(false);
        setEditingActivity(null);
        setActivitiesForm(defaultForm);
        setItineraries([]);
        setSelectedImages([]);
        setImagePreviews([]);
        setServerError(null);
    };

    if (!showForm || !editingActivity) return null;

    return (
        <>
            {/* Quill custom styles */}
            <style>
                {`
                .quill-wrapper .ql-container {
                    min-height: 250px;
                    max-height: 450px;
                    overflow-y: auto;
                    font-size: 14px;
                }

                .quill-wrapper .ql-editor {
                    min-height: 250px;
                }

                .quill-small .ql-container {
                    min-height: 180px;
                    max-height: 300px;
                    overflow-y: auto;
                    font-size: 14px;
                }

                .quill-small .ql-editor {
                    min-height: 180px;
                }

                .quill-itinerary .ql-container {
                    min-height: 140px;
                    max-height: 250px;
                    overflow-y: auto;
                    font-size: 14px;
                }

                .quill-itinerary .ql-editor {
                    min-height: 140px;
                }

                .ql-toolbar.ql-snow {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    border-color: #d1d5db;
                }

                .ql-container.ql-snow {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    border-color: #d1d5db;
                }
                `}
            </style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Activity
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
                                    Category{" "}
                                    <span className="text-red-500">*</span>
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
                                    <option value="">
                                        Select Sub Category
                                    </option>
                                    {subCategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="quill-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={activitiesForm.description}
                                    onChange={(value) =>
                                        handleRichTextChange(
                                            "description",
                                            value,
                                        )
                                    }
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Describe this activity in detail..."
                                />
                            </div>
                        </div>

                        {/* Includes - Full Width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Includes
                            </label>
                            <div className="quill-small">
                                <ReactQuill
                                    theme="snow"
                                    value={activitiesForm.includes}
                                    onChange={(value) =>
                                        handleRichTextChange("includes", value)
                                    }
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="What's included..."
                                />
                            </div>
                        </div>

                        {/* Excludes - Full Width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excludes
                            </label>
                            <div className="quill-small">
                                <ReactQuill
                                    theme="snow"
                                    value={activitiesForm.excludes}
                                    onChange={(value) =>
                                        handleRichTextChange("excludes", value)
                                    }
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="What's excluded..."
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Add New Images
                            </label>
                            <input
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            {/* New image previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {imagePreviews.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={url}
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

                            {/* Existing images (edit mode) */}
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

                        {/* Itineraries - With Rich Text Editor */}
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
                                <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
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

                                        {/* Description - Rich Text Editor */}
                                        <div className="quill-itinerary">
                                            <ReactQuill
                                                theme="snow"
                                                value={it.description}
                                                onChange={(value) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "description",
                                                        value,
                                                    )
                                                }
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Day description..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {itineraries.length > 0 && (
                                <button
                                    type="button"
                                    onClick={addItinerary}
                                    className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={15} />
                                    Add another itinerary item
                                </button>
                            )}
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
                                {submitting ? "Updating..." : "Update Activity"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditActivitiesForm;
