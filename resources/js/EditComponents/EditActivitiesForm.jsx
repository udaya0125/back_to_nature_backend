// import React, { useState, useEffect } from "react";
// import { X, Plus, Trash2 } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditActivitiesForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingActivity,
//     setEditingActivity,
//     handleUpdate,
//     allCategory,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [serverError, setServerError] = useState(null);

//     const defaultForm = {
//         title: "",
//         category_id: "",
//         sub_category_id: "",
//         description: "",
//         includes: "",
//         excludes: "",
//     };

//     const [activitiesForm, setActivitiesForm] = useState(defaultForm);
//     const [selectedImages, setSelectedImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [itineraries, setItineraries] = useState([]);
//     const [subCategories, setSubCategories] = useState([]);

//     // ─── Quill modules and formats ──────────────────────────────────────────
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ align: [] }],
//             ["link", "clean"],
//             ["blockquote", "code-block"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "align",
//         "link",
//         "blockquote",
//         "code-block",
//     ];

//     useEffect(() => {
//         if (editingActivity && showForm) {
//             setActivitiesForm({
//                 title: editingActivity.title || "",
//                 category_id: editingActivity.category_id || "",
//                 sub_category_id: editingActivity.sub_category_id || "",
//                 description: editingActivity.description || "",
//                 includes: editingActivity.includes || "",
//                 excludes: editingActivity.excludes || "",
//             });
//             setItineraries(
//                 editingActivity.itineraries?.map((it) => ({
//                     day: it.day,
//                     title: it.title,
//                     description: it.description,
//                 })) || [],
//             );
//             setSelectedImages([]);
//             setImagePreviews([]);
//             setServerError(null);
//         }
//     }, [editingActivity, showForm]);

//     useEffect(() => {
//         if (activitiesForm.category_id && allCategory?.length) {
//             const found = allCategory.find(
//                 (cat) => String(cat.id) === String(activitiesForm.category_id),
//             );
//             setSubCategories(found?.sub_categories || []);
//         } else {
//             setSubCategories([]);
//         }
//     }, [activitiesForm.category_id, allCategory]);

//     // Clean up blob URLs on unmount
//     useEffect(() => {
//         return () => {
//             imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [imagePreviews]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setActivitiesForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleRichTextChange = (field, value) => {
//         setActivitiesForm((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setSelectedImages((prev) => [...prev, ...files]);

//         const previews = files.map((f) => URL.createObjectURL(f));
//         setImagePreviews((prev) => [...prev, ...previews]);
//     };

//     const removeSelectedImage = (index) => {
//         URL.revokeObjectURL(imagePreviews[index]);
//         setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     };

//     const addItinerary = () => {
//         setItineraries((prev) => [
//             ...prev,
//             { day: prev.length + 1, title: "", description: "" },
//         ]);
//     };

//     const removeItinerary = (index) => {
//         setItineraries((prev) =>
//             prev
//                 .filter((_, i) => i !== index)
//                 .map((it, i) => ({ ...it, day: i + 1 })),
//         );
//     };

//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)),
//         );
//     };

//     const buildFormData = () => {
//         const formData = new FormData();
//         formData.append("title", activitiesForm.title);
//         formData.append("category_id", activitiesForm.category_id);
//         formData.append("sub_category_id", activitiesForm.sub_category_id);
//         formData.append("description", activitiesForm.description);
//         if (activitiesForm.includes)
//             formData.append("includes", activitiesForm.includes);
//         if (activitiesForm.excludes)
//             formData.append("excludes", activitiesForm.excludes);

//         selectedImages.forEach((file) => {
//             formData.append("images[]", file);
//         });

//         itineraries.forEach((it, index) => {
//             formData.append(`itineraries[${index}][day]`, it.day);
//             formData.append(`itineraries[${index}][title]`, it.title);
//             formData.append(
//                 `itineraries[${index}][description]`,
//                 it.description,
//             );
//         });

//         return formData;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setServerError(null);
//         const formData = buildFormData();

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingActivity.id);
//             setActivitiesForm(defaultForm);
//             setItineraries([]);
//             setSelectedImages([]);
//             setImagePreviews([]);
//             setShowForm(false);
//             setEditingActivity(null);
//         } catch (error) {
//             console.error("Error updating activity:", error);
//             const responseData = error.response?.data;
//             let msg = "Something went wrong. Please try again.";
//             if (responseData?.errors) {
//                 msg = Object.values(responseData.errors).flat().join(", ");
//             } else if (responseData?.message) {
//                 msg = responseData.message;
//             }
//             setServerError(msg);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         // Clean up preview URLs
//         imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//         setShowForm(false);
//         setEditingActivity(null);
//         setActivitiesForm(defaultForm);
//         setItineraries([]);
//         setSelectedImages([]);
//         setImagePreviews([]);
//         setServerError(null);
//     };

//     if (!showForm || !editingActivity) return null;

//     return (
//         <>
//             {/* Quill custom styles */}
//             <style>
//                 {`
//                 .quill-wrapper .ql-container {
//                     min-height: 250px;
//                     max-height: 450px;
//                     overflow-y: auto;
//                     font-size: 14px;
//                 }

//                 .quill-wrapper .ql-editor {
//                     min-height: 250px;
//                 }

//                 .quill-small .ql-container {
//                     min-height: 180px;
//                     max-height: 300px;
//                     overflow-y: auto;
//                     font-size: 14px;
//                 }

//                 .quill-small .ql-editor {
//                     min-height: 180px;
//                 }

//                 .quill-itinerary .ql-container {
//                     min-height: 140px;
//                     max-height: 250px;
//                     overflow-y: auto;
//                     font-size: 14px;
//                 }

//                 .quill-itinerary .ql-editor {
//                     min-height: 140px;
//                 }

//                 .ql-toolbar.ql-snow {
//                     border-top-left-radius: 8px;
//                     border-top-right-radius: 8px;
//                     border-color: #d1d5db;
//                 }

//                 .ql-container.ql-snow {
//                     border-bottom-left-radius: 8px;
//                     border-bottom-right-radius: 8px;
//                     border-color: #d1d5db;
//                 }
//                 `}
//             </style>

//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
//                     {/* Header */}
//                     <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
//                         <h2 className="text-2xl font-bold text-gray-800">
//                             Edit Activity
//                         </h2>
//                         <button
//                             onClick={handleClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             <X size={24} />
//                         </button>
//                     </div>

//                     {/* Server error banner */}
//                     {serverError && (
//                         <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                             {serverError}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="p-6 space-y-5">
//                         {/* Title */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Title <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={activitiesForm.title}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 placeholder="Activity title"
//                             />
//                         </div>

//                         {/* Category & Sub-category */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Category{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     name="category_id"
//                                     value={activitiesForm.category_id}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 >
//                                     <option value="">Select Category</option>
//                                     {allCategory?.map((cat) => (
//                                         <option key={cat.id} value={cat.id}>
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Sub Category{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     name="sub_category_id"
//                                     value={activitiesForm.sub_category_id}
//                                     onChange={handleChange}
//                                     required
//                                     disabled={!activitiesForm.category_id}
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
//                                 >
//                                     <option value="">
//                                         Select Sub Category
//                                     </option>
//                                     {subCategories.map((sub) => (
//                                         <option key={sub.id} value={sub.id}>
//                                             {sub.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Description - Rich Text Editor */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Description{" "}
//                                 <span className="text-red-500">*</span>
//                             </label>
//                             <div className="quill-wrapper">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={activitiesForm.description}
//                                     onChange={(value) =>
//                                         handleRichTextChange(
//                                             "description",
//                                             value,
//                                         )
//                                     }
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="Describe this activity in detail..."
//                                 />
//                             </div>
//                         </div>

//                         {/* Includes - Full Width */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Includes
//                             </label>
//                             <div className="quill-small">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={activitiesForm.includes}
//                                     onChange={(value) =>
//                                         handleRichTextChange("includes", value)
//                                     }
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="What's included..."
//                                 />
//                             </div>
//                         </div>

//                         {/* Excludes - Full Width */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Excludes
//                             </label>
//                             <div className="quill-small">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={activitiesForm.excludes}
//                                     onChange={(value) =>
//                                         handleRichTextChange("excludes", value)
//                                     }
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="What's excluded..."
//                                 />
//                             </div>
//                         </div>

//                         {/* Images */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Add New Images
//                             </label>
//                             <input
//                                 type="file"
//                                 accept="image/jpg,image/jpeg,image/png,image/webp"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />

//                             {/* New image previews */}
//                             {imagePreviews.length > 0 && (
//                                 <div className="mt-2 flex flex-wrap gap-2">
//                                     {imagePreviews.map((url, index) => (
//                                         <div
//                                             key={index}
//                                             className="relative group"
//                                         >
//                                             <img
//                                                 src={url}
//                                                 alt={`preview-${index}`}
//                                                 className="w-20 h-20 object-cover rounded-lg border"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeSelectedImage(index)
//                                                 }
//                                                 className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
//                                             >
//                                                 <X size={12} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Existing images (edit mode) */}
//                             {editingActivity?.images?.length > 0 && (
//                                 <div className="mt-2">
//                                     <p className="text-xs text-gray-500 mb-1">
//                                         Existing images (adding new images won't
//                                         remove these):
//                                     </p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {editingActivity.images.map((img) => (
//                                             <img
//                                                 key={img.id}
//                                                 src={`/${img.image}`}
//                                                 alt="existing"
//                                                 className="w-20 h-20 object-cover rounded-lg border opacity-70"
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Itineraries - With Rich Text Editor */}
//                         <div>
//                             <div className="flex justify-between items-center mb-2">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Itineraries
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={addItinerary}
//                                     className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition"
//                                 >
//                                     <Plus size={16} />
//                                     Add Day
//                                 </button>
//                             </div>

//                             {itineraries.length === 0 && (
//                                 <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
//                                     No itinerary days added yet.
//                                 </p>
//                             )}

//                             <div className="space-y-4">
//                                 {itineraries.map((it, index) => (
//                                     <div
//                                         key={index}
//                                         className="border border-gray-200 rounded-lg p-4 relative"
//                                     >
//                                         <div className="flex justify-end mb-2">
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeItinerary(index)
//                                                 }
//                                                 className="text-red-400 hover:text-red-600 transition"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>

//                                         {/* Day label and Title input on same row */}
//                                         <div className="flex items-center gap-3 mb-3">
//                                             <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
//                                                 Day {it.day}:
//                                             </span>
//                                             <div className="flex-1">
//                                                 <input
//                                                     type="text"
//                                                     value={it.title}
//                                                     onChange={(e) =>
//                                                         handleItineraryChange(
//                                                             index,
//                                                             "title",
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     required
//                                                     placeholder="Day title"
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Description - Rich Text Editor */}
//                                         <div className="quill-itinerary">
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={it.description}
//                                                 onChange={(value) =>
//                                                     handleItineraryChange(
//                                                         index,
//                                                         "description",
//                                                         value,
//                                                     )
//                                                 }
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Day description..."
//                                             />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             {itineraries.length > 0 && (
//                                 <button
//                                     type="button"
//                                     onClick={addItinerary}
//                                     className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
//                                 >
//                                     <Plus size={15} />
//                                     Add another itinerary item
//                                 </button>
//                             )}
//                         </div>

//                         {/* Actions */}
//                         <div className="flex justify-end gap-3 pt-2 border-t">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
//                             >
//                                 {submitting ? "Updating..." : "Update Activity"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default EditActivitiesForm;



import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, AlertCircle } from "lucide-react";
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
    const [isDragging, setIsDragging] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

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
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/storage/')) return imagePath;
        return `${imgurl}/${imagePath}`;
    };

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
                category_id: editingActivity.category_id?.toString() || "",
                sub_category_id: editingActivity.sub_category_id?.toString() || "",
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
            setExistingImages(editingActivity.images || []);
            setSelectedImages([]);
            setImagePreviews([]);
            setDeletedImageIds([]);
            setServerError(null);
            setValidationErrors({});
            setIsDragging(false);
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
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRichTextChange = (field, value) => {
        setActivitiesForm((prev) => ({ ...prev, [field]: value }));
    };

    // ─── Image Validation ───────────────────────────────────────────────────────
    const validateImageSize = (file) => {
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.size > maxSizeInBytes) {
            alert(`${file.name} exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            return false;
        }
        return true;
    };

    // ─── Image Handling ───────────────────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const validFiles = files.filter(validateImageSize);
        
        if (validFiles.length !== files.length) {
            const rejectedCount = files.length - validFiles.length;
            alert(`${rejectedCount} file(s) were rejected due to size limit of 5MB.`);
        }
        
        if (validFiles.length > 0) {
            setSelectedImages((prev) => [...prev, ...validFiles]);
            const previews = validFiles.map((f) => URL.createObjectURL(f));
            setImagePreviews((prev) => [...prev, ...previews]);
        }

        e.target.value = "";
    };

    const removeSelectedImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId) => {
        setDeletedImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    // ─── Drag and drop handlers ─────────────────────────────────────────────
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert("Please drop image files only (jpg, jpeg, png, webp)");
            return;
        }
        
        const validFiles = imageFiles.filter(validateImageSize);
        
        if (validFiles.length !== imageFiles.length) {
            const rejectedCount = imageFiles.length - validFiles.length;
            alert(`${rejectedCount} file(s) were rejected due to size limit of 5MB.`);
        }
        
        if (validFiles.length > 0) {
            setSelectedImages((prev) => [...prev, ...validFiles]);
            const previews = validFiles.map((f) => URL.createObjectURL(f));
            setImagePreviews((prev) => [...prev, ...previews]);
        }
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
        
        // Add _method for Laravel to handle as PUT request
        formData.append("_method", "PUT");
        
        // Basic fields
        formData.append("title", activitiesForm.title);
        formData.append("category_id", activitiesForm.category_id);
        formData.append("sub_category_id", activitiesForm.sub_category_id);
        formData.append("description", activitiesForm.description || "");
        formData.append("includes", activitiesForm.includes || "");
        formData.append("excludes", activitiesForm.excludes || "");

        // Add new images
        selectedImages.forEach((file) => {
            formData.append("images[]", file);
        });

        // Add deleted image IDs
        deletedImageIds.forEach((id) => {
            formData.append("deleted_images[]", id);
        });

        // Add itineraries
        if (itineraries.length > 0) {
            itineraries.forEach((it, index) => {
                formData.append(`itineraries[${index}][day]`, it.day);
                formData.append(`itineraries[${index}][title]`, it.title);
                formData.append(`itineraries[${index}][description]`, it.description);
            });
        }

        return formData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        setValidationErrors({});
        
        // Validate required fields
        const errors = {};
        if (!activitiesForm.title) errors.title = "Title is required";
        if (!activitiesForm.category_id) errors.category_id = "Category is required";
        if (!activitiesForm.sub_category_id) errors.sub_category_id = "Sub category is required";
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        const formData = buildFormData();

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingActivity.id);
            // Reset form on success
            setActivitiesForm(defaultForm);
            setItineraries([]);
            setSelectedImages([]);
            setImagePreviews([]);
            setExistingImages([]);
            setDeletedImageIds([]);
            setShowForm(false);
            setEditingActivity(null);
            if (setReloadTrigger) setReloadTrigger(prev => !prev);
        } catch (error) {
            console.error("Error updating activity:", error);
            const responseData = error.response?.data;
            
            if (error.response?.status === 422 && responseData?.errors) {
                setValidationErrors(responseData.errors);
                let msg = "Please fix the following errors:\n";
                Object.values(responseData.errors).flat().forEach(err => {
                    msg += `- ${err}\n`;
                });
                setServerError(msg);
            } else if (responseData?.message) {
                setServerError(responseData.message);
            } else {
                setServerError("Something went wrong. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setShowForm(false);
        setEditingActivity(null);
        setActivitiesForm(defaultForm);
        setItineraries([]);
        setSelectedImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setDeletedImageIds([]);
        setServerError(null);
        setValidationErrors({});
    };

    if (!showForm || !editingActivity) return null;

    return (
        <>
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

            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">
                            Edit Activity
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto flex-1">
                        {serverError && (
                            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-wrap">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={activitiesForm.title}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        validationErrors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Activity title"
                                />
                                {validationErrors.title && (
                                    <p className="mt-1 text-xs text-red-500">{validationErrors.title[0]}</p>
                                )}
                            </div>

                            {/* Category & Sub-category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category_id"
                                        value={activitiesForm.category_id}
                                        onChange={handleChange}
                                        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                            validationErrors.category_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Category</option>
                                        {allCategory?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.category_id && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.category_id[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Sub Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="sub_category_id"
                                        value={activitiesForm.sub_category_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!activitiesForm.category_id}
                                        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 ${
                                            validationErrors.sub_category_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.sub_category_id && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.sub_category_id[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description - Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="quill-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={activitiesForm.description}
                                        onChange={(value) =>
                                            handleRichTextChange("description", value)
                                        }
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Describe this activity in detail..."
                                    />
                                </div>
                            </div>

                            {/* Includes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
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

                            {/* Excludes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
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

                            {/* Images Section */}
                            <div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Images
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Maximum file size: 5MB per image • Supported formats: JPG, JPEG, PNG, WEBP
                                    </p>
                                </div>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-gray-500 mb-2">
                                            Existing Images ({existingImages.length})
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {existingImages.map((img) => (
                                                <div
                                                    key={img.id}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-red-300 transition-all"
                                                >
                                                    <img
                                                        src={getImageUrl(img.image)}
                                                        alt="existing"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(img.id)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105 shadow-lg"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {deletedImageIds.length > 0 && (
                                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {deletedImageIds.length} image(s) will be removed
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-gray-500 mb-2">
                                            New Images ({imagePreviews.length})
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imagePreviews.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-all"
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`preview-${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSelectedImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105 shadow-lg"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
                                        ${isDragging 
                                            ? 'border-indigo-500 bg-indigo-50' 
                                            : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <input
                                        type="file"
                                        accept="image/jpg,image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    <div className="text-center">
                                        <div className={`inline-flex p-3 rounded-full mb-3 transition-all ${isDragging ? 'bg-indigo-100' : 'bg-white'}`}>
                                            <Upload size={32} className={isDragging ? 'text-indigo-600' : 'text-gray-400'} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            {isDragging ? 'Drop your images here' : 'Drag & drop new images here'}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                                    </div>
                                </div>
                            </div>

                            {/* Itineraries */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Itineraries
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

                                {itineraries.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
                                        No itinerary days added yet.
                                    </p>
                                )}

                                <div className="space-y-4">
                                    {itineraries.map((it, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                            <div className="flex justify-end mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItinerary(index)}
                                                    className="text-red-400 hover:text-red-600 transition p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
                                                    Day {it.day}:
                                                </span>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={it.title}
                                                        onChange={(e) =>
                                                            handleItineraryChange(index, "title", e.target.value)
                                                        }
                                                        required
                                                        placeholder="Day title"
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="quill-itinerary">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={it.description}
                                                    onChange={(value) =>
                                                        handleItineraryChange(index, "description", value)
                                                    }
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    placeholder="Day description..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Activity"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditActivitiesForm;