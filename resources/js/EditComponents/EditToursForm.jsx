// import React, { useState, useEffect } from "react";
// import { X, Plus, Trash2, ImagePlus, ChevronDown } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditToursForm = ({
//     editingTour,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     showForm,
//     setEditingTour,
//     allCategory = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [newImages, setNewImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [validationErrors, setValidationErrors] = useState({});

//     const emptyForm = {
//         title: "",
//         category_id: "",
//         description: "",
//         includes: "",
//         excludes: "",
//     };

//     const [tourForm, setTourForm] = useState(emptyForm);
//     const [itineraries, setItineraries] = useState([]);

//     // ─────────────────────────────────────────────────────────────
//     // Quill modules
//     // ─────────────────────────────────────────────────────────────
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

//     // ─────────────────────────────────────────────────────────────
//     // Populate form with editing data
//     // ─────────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (editingTour) {
//             setTourForm({
//                 title: editingTour.title || "",
//                 category_id: editingTour.category_id || "",
//                 description: editingTour.description || "",
//                 includes: editingTour.includes || "",
//                 excludes: editingTour.excludes || "",
//             });

//             setItineraries(
//                 editingTour.itineraries?.map((i, idx) => ({
//                     day: i.day || idx + 1,
//                     title: i.title || "",
//                     description: i.description || "",
//                 })) || [],
//             );

//             setNewImages([]);
//             setImagePreviews([]);
//             setShowForm(true);
//         }
//     }, [editingTour, setShowForm]);

//     // ─────────────────────────────────────────────────────────────
//     // Reset form
//     // ─────────────────────────────────────────────────────────────
//     const resetForm = () => {
//         setTourForm(emptyForm);
//         setItineraries([]);
//         setNewImages([]);
//         setImagePreviews([]);
//         setValidationErrors({});
//     };

//     // ─────────────────────────────────────────────────────────────
//     // Handle input
//     // ─────────────────────────────────────────────────────────────
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setTourForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleRichTextChange = (field, value) => {
//         setTourForm((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     // ─────────────────────────────────────────────────────────────
//     // Image handling
//     // ─────────────────────────────────────────────────────────────
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);

//         setNewImages((prev) => [...prev, ...files]);

//         const previews = files.map((f) => URL.createObjectURL(f));

//         setImagePreviews((prev) => [...prev, ...previews]);
//     };

//     const removeNewImage = (index) => {
//         setNewImages((prev) => prev.filter((_, i) => i !== index));

//         setImagePreviews((prev) => {
//             URL.revokeObjectURL(prev[index]);
//             return prev.filter((_, i) => i !== index);
//         });
//     };

//     // ─────────────────────────────────────────────────────────────
//     // Itinerary handling
//     // ─────────────────────────────────────────────────────────────
//     const addItinerary = () => {
//         setItineraries((prev) => [
//             ...prev,
//             {
//                 day: prev.length + 1,
//                 title: "",
//                 description: "",
//             },
//         ]);
//     };

//     const removeItinerary = (index) => {
//         setItineraries((prev) =>
//             prev
//                 .filter((_, i) => i !== index)
//                 .map((it, i) => ({
//                     ...it,
//                     day: i + 1,
//                 })),
//         );
//     };

//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((item, i) =>
//                 i === index
//                     ? {
//                           ...item,
//                           [field]: value,
//                       }
//                     : item,
//             ),
//         );
//     };

//     // ─────────────────────────────────────────────────────────────
//     // Submit Update
//     // ─────────────────────────────────────────────────────────────
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setValidationErrors({});

//         const formData = new FormData();

//         Object.entries(tourForm).forEach(([key, value]) => {
//             if (value !== null && value !== "") {
//                 formData.append(key, value);
//             }
//         });

//         // New images
//         newImages.forEach((img) => {
//             formData.append("images[]", img);
//         });

//         // Itineraries
//         itineraries.forEach((item, i) => {
//             formData.append(`itineraries[${i}][day]`, item.day);
//             formData.append(`itineraries[${i}][title]`, item.title);
//             formData.append(`itineraries[${i}][description]`, item.description);
//         });

//         try {
//             setSubmitting(true);
//             await handleUpdate(formData, editingTour.id);
//             resetForm();
//             setShowForm(false);
//             setEditingTour(null);
//         } catch (error) {
//             if (error.response?.status === 422) {
//                 const errors = error.response.data.errors || {};
//                 console.error("Validation errors:", errors);
//                 setValidationErrors(errors);
//             } else {
//                 console.error("Error updating tour:", error);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//         setEditingTour(null);
//     };

//     if (!showForm || !editingTour) return null;

//     const existingImages = editingTour?.images || [];

//     return (
//         <>
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

//             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh]">
//                     {/* Header */}
//                     <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
//                         <h2 className="text-xl font-bold text-gray-900">
//                             Edit Tour
//                         </h2>

//                         <button
//                             onClick={handleClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>

//                     {/* Form */}
//                     <form
//                         onSubmit={handleSubmit}
//                         className="overflow-y-auto flex-1 px-6 py-5 space-y-8"
//                     >
//                         {/* Validation */}
//                         {Object.keys(validationErrors).length > 0 && (
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                                 <p className="text-sm font-semibold text-red-700 mb-1">
//                                     Please fix the following errors:
//                                 </p>

//                                 <ul className="list-disc list-inside space-y-0.5">
//                                     {Object.entries(validationErrors).map(
//                                         ([field, messages]) =>
//                                             messages.map((msg, i) => (
//                                                 <li
//                                                     key={`${field}-${i}`}
//                                                     className="text-xs text-red-600"
//                                                 >
//                                                     {msg}
//                                                 </li>
//                                             )),
//                                     )}
//                                 </ul>
//                             </div>
//                         )}

//                         {/* Basic Info */}
//                         <section className="space-y-5">
//                             {/* Title */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Title{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>

//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={tourForm.title}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="e.g. Everest Base Camp Trek"
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             {/* Category */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Category{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>

//                                 <div className="relative">
//                                     <select
//                                         name="category_id"
//                                         value={tourForm.category_id}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white pr-8"
//                                     >
//                                         <option value="">
//                                             Select a category
//                                         </option>

//                                         {allCategory.map((cat) => (
//                                             <option key={cat.id} value={cat.id}>
//                                                 {cat.name}
//                                             </option>
//                                         ))}
//                                     </select>

//                                     <ChevronDown
//                                         size={16}
//                                         className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Description{" "}
//                                     <span className="text-red-500">*</span>
//                                 </label>

//                                 <div className="quill-wrapper">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={tourForm.description}
//                                         onChange={(value) =>
//                                             handleRichTextChange(
//                                                 "description",
//                                                 value,
//                                             )
//                                         }
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="Describe the tour experience..."
//                                     />
//                                 </div>
//                             </div>

//                             {/* Includes */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Includes
//                                 </label>

//                                 <div className="quill-small">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={tourForm.includes}
//                                         onChange={(value) =>
//                                             handleRichTextChange(
//                                                 "includes",
//                                                 value,
//                                             )
//                                         }
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="What's included..."
//                                     />
//                                 </div>
//                             </div>

//                             {/* Excludes */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Excludes
//                                 </label>

//                                 <div className="quill-small">
//                                     <ReactQuill
//                                         theme="snow"
//                                         value={tourForm.excludes}
//                                         onChange={(value) =>
//                                             handleRichTextChange(
//                                                 "excludes",
//                                                 value,
//                                             )
//                                         }
//                                         modules={quillModules}
//                                         formats={quillFormats}
//                                         placeholder="What's excluded..."
//                                     />
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Images */}
//                         <section className="space-y-3">
//                             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
//                                 Images
//                             </h3>

//                             {/* Existing Images */}
//                             {existingImages.length > 0 && (
//                                 <div>
//                                     <p className="text-xs text-gray-500 mb-2">
//                                         Current images
//                                     </p>

//                                     <div className="flex flex-wrap gap-2">
//                                         {existingImages.map((img) => (
//                                             <div
//                                                 key={img.id}
//                                                 className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
//                                             >
//                                                 <img
//                                                     src={`/storage/${img.image}`}
//                                                     alt="tour"
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* New Previews */}
//                             {imagePreviews.length > 0 && (
//                                 <div className="flex flex-wrap gap-2">
//                                     {imagePreviews.map((src, i) => (
//                                         <div
//                                             key={i}
//                                             className="relative w-20 h-20 rounded-lg overflow-hidden border border-indigo-200 group"
//                                         >
//                                             <img
//                                                 src={src}
//                                                 alt={`preview-${i}`}
//                                                 className="w-full h-full object-cover"
//                                             />

//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     removeNewImage(i)
//                                                 }
//                                                 className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
//                                             >
//                                                 <X
//                                                     size={16}
//                                                     className="text-white"
//                                                 />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Upload */}
//                             <label className="flex items-center gap-2 w-fit cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-500 rounded-lg px-4 py-2.5 text-sm transition-colors">
//                                 <ImagePlus size={18} />

//                                 <span>Add more images</span>

//                                 <input
//                                     type="file"
//                                     multiple
//                                     accept="image/jpg,image/jpeg,image/png,image/webp"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                 />
//                             </label>
//                         </section>

//                         {/* Itineraries */}
//                         <section className="space-y-3 pt-4">
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
//                                     Itineraries
//                                 </h3>

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
//                                 {itineraries.map((item, index) => (
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

//                                         {/* Title */}
//                                         <div className="flex items-center gap-3 mb-4">
//                                             <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
//                                                 Day {item.day}:
//                                             </span>

//                                             <div className="flex-1">
//                                                 <input
//                                                     type="text"
//                                                     value={item.title}
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

//                                         {/* Description */}
//                                         <div className="quill-itinerary">
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={item.description}
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
//                         </section>
//                     </form>

//                     {/* Footer */}
//                     <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             onClick={handleSubmit}
//                             disabled={submitting}
//                             className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                     Updating...
//                                 </>
//                             ) : (
//                                 "Update Tour"
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default EditToursForm;


import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, AlertCircle, ChevronDown } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditToursForm = ({
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
    const [isDragging, setIsDragging] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const emptyForm = {
        title: "",
        category_id: "",
        description: "",
        includes: "",
        excludes: "",
    };

    const [tourForm, setTourForm] = useState(emptyForm);
    const [itineraries, setItineraries] = useState([]);

    // ─────────────────────────────────────────────────────────────
    // Quill modules
    // ─────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────
    // Populate form with editing data
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (editingTour && showForm) {
            setTourForm({
                title: editingTour.title || "",
                category_id: editingTour.category_id || "",
                description: editingTour.description || "",
                includes: editingTour.includes || "",
                excludes: editingTour.excludes || "",
            });

            setItineraries(
                editingTour.itineraries?.map((i, idx) => ({
                    day: i.day || idx + 1,
                    title: i.title || "",
                    description: i.description || "",
                })) || [],
            );

            setExistingImages(editingTour.images || []);
            setNewImages([]);
            setImagePreviews([]);
            setDeletedImageIds([]);
            setValidationErrors({});
        }
    }, [editingTour, showForm]);

    // ─── Clean up blob URLs on unmount ─────────────────────────────────────
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    // ─────────────────────────────────────────────────────────────
    // Reset form
    // ─────────────────────────────────────────────────────────────
    const resetForm = () => {
        setTourForm(emptyForm);
        setItineraries([]);
        setNewImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setDeletedImageIds([]);
        setValidationErrors({});
        setIsDragging(false);
    };

    // ─────────────────────────────────────────────────────────────
    // Handle input
    // ─────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        setTourForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRichTextChange = (field, value) => {
        setTourForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ─────────────────────────────────────────────────────────────
    // Image validation
    // ─────────────────────────────────────────────────────────────
    const validateImageSize = (file) => {
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.size > maxSizeInBytes) {
            alert(`${file.name} exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            return false;
        }
        return true;
    };

    // ─────────────────────────────────────────────────────────────
    // Image handling
    // ─────────────────────────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const validFiles = files.filter(validateImageSize);
        
        if (validFiles.length !== files.length) {
            const rejectedCount = files.length - validFiles.length;
            alert(`${rejectedCount} file(s) were rejected due to size limit of 5MB.`);
        }
        
        if (validFiles.length > 0) {
            setNewImages((prev) => [...prev, ...validFiles]);
            const previews = validFiles.map((f) => URL.createObjectURL(f));
            setImagePreviews((prev) => [...prev, ...previews]);
        }

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId) => {
        setDeletedImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    // ─────────────────────────────────────────────────────────────
    // Drag and drop handlers
    // ─────────────────────────────────────────────────────────────
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
            setNewImages((prev) => [...prev, ...validFiles]);
            const previews = validFiles.map((f) => URL.createObjectURL(f));
            setImagePreviews((prev) => [...prev, ...previews]);
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Itinerary handling
    // ─────────────────────────────────────────────────────────────
    const addItinerary = () => {
        setItineraries((prev) => [
            ...prev,
            {
                day: prev.length + 1,
                title: "",
                description: "",
            },
        ]);
    };

    const removeItinerary = (index) => {
        setItineraries((prev) =>
            prev
                .filter((_, i) => i !== index)
                .map((it, i) => ({
                    ...it,
                    day: i + 1,
                })),
        );
    };

    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item,
            ),
        );
    };

    // ─────────────────────────────────────────────────────────────
    // Submit Update
    // ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidationErrors({});

        const formData = new FormData();
        
        // Add _method for Laravel to treat as PUT request
        formData.append('_method', 'PUT');

        Object.entries(tourForm).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // New images
        newImages.forEach((img) => {
            formData.append("images[]", img);
        });

        // Deleted image IDs - send only if there are deleted images
        if (deletedImageIds.length > 0) {
            deletedImageIds.forEach((id) => {
                formData.append("deleted_images[]", id);
            });
        }

        // Itineraries
        itineraries.forEach((item, i) => {
            formData.append(`itineraries[${i}][day]`, item.day);
            formData.append(`itineraries[${i}][title]`, item.title);
            formData.append(`itineraries[${i}][description]`, item.description);
        });

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingTour.id);
            resetForm();
            setShowForm(false);
            setEditingTour(null);
            setReloadTrigger(prev => !prev);
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                console.error("Validation errors:", errors);
                setValidationErrors(errors);
            } else {
                console.error("Error updating tour:", error);
                alert(error.response?.data?.message || "Failed to update tour. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        // Clean up preview URLs
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        resetForm();
        setShowForm(false);
        setEditingTour(null);
    };

    if (!showForm || !editingTour) return null;

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

            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh]">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">
                            Edit Tour
                        </h2>

                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-8">
                            {/* Validation */}
                            {Object.keys(validationErrors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-red-700 mb-1">
                                        Please fix the following errors:
                                    </p>

                                    <ul className="list-disc list-inside space-y-0.5">
                                        {Object.entries(validationErrors).map(
                                            ([field, messages]) =>
                                                Array.isArray(messages) && messages.map((msg, i) => (
                                                    <li
                                                        key={`${field}-${i}`}
                                                        className="text-xs text-red-600"
                                                    >
                                                        {msg}
                                                    </li>
                                                )),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Basic Info */}
                            <section className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={tourForm.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. European Tour Package"
                                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <select
                                            name="category_id"
                                            value={tourForm.category_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full appearance-none border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white pr-8"
                                        >
                                            <option value="">
                                                Select a category
                                            </option>

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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div className="quill-wrapper">
                                        <ReactQuill
                                            theme="snow"
                                            value={tourForm.description}
                                            onChange={(value) =>
                                                handleRichTextChange(
                                                    "description",
                                                    value,
                                                )
                                            }
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Describe the tour experience..."
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
                                            value={tourForm.includes}
                                            onChange={(value) =>
                                                handleRichTextChange(
                                                    "includes",
                                                    value,
                                                )
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
                                            value={tourForm.excludes}
                                            onChange={(value) =>
                                                handleRichTextChange(
                                                    "excludes",
                                                    value,
                                                )
                                            }
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="What's excluded..."
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Images - Improved UI Section */}
                            <section className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Images
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Maximum file size: 5MB per image • Supported formats: JPG, JPEG, PNG, WEBP
                                    </p>
                                </div>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div>
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
                                                        src={`${imgurl}/${img.image}`}
                                                        alt="tour"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute bottom-0 left-0 right-0 p-2">
                                                            <p className="text-white text-xs truncate">
                                                                Click X to remove
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(img.id)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105 shadow-lg"
                                                        title="Remove image"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {deletedImageIds.length > 0 && (
                                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {deletedImageIds.length} image(s) will be permanently removed when you save
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* New Image Previews Grid */}
                                {imagePreviews.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-green-600 mb-2">
                                            New Images ({imagePreviews.length}) - Will be added when saved
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imagePreviews.map((src, i) => (
                                                <div
                                                    key={i}
                                                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-green-200 hover:border-green-400 transition-all"
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`preview-${i}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    
                                                    {/* Image overlay with file info */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute bottom-0 left-0 right-0 p-2">
                                                            <p className="text-white text-xs truncate">
                                                                {newImages[i]?.name}
                                                            </p>
                                                            <p className="text-white/70 text-xs">
                                                                {(newImages[i]?.size / (1024 * 1024)).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Remove button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(i)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-105 shadow-lg"
                                                        title="Remove new image"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area - Drag & Drop */}
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
                                        multiple
                                        accept="image/jpg,image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        id="image-upload"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    <div className="text-center">
                                        <div className={`
                                            inline-flex p-3 rounded-full mb-3 transition-all
                                            ${isDragging ? 'bg-indigo-100' : 'bg-white'}
                                        `}>
                                            <Upload 
                                                size={32} 
                                                className={isDragging ? 'text-indigo-600' : 'text-gray-400'}
                                            />
                                        </div>
                                        
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            {isDragging ? 'Drop your images here' : 'Drag & drop new images here'}
                                        </p>
                                        
                                        <p className="text-xs text-gray-500 mb-3">
                                            or click to browse from your computer
                                        </p>
                                        
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                            <AlertCircle size={12} />
                                            <span>Maximum 5MB per image</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload tips */}
                                {imagePreviews.length === 0 && existingImages.length === 0 && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                                        <AlertCircle size={14} />
                                        <span>Tip: You can upload multiple images at once. First image will be used as the tour cover.</span>
                                    </div>
                                )}
                            </section>

                            {/* Itineraries */}
                            <section className="space-y-3 pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                        Itineraries
                                    </h3>

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
                                    {itineraries.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 relative bg-white"
                                        >
                                            <div className="flex justify-end mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItinerary(index)
                                                    }
                                                    className="text-red-400 hover:text-red-600 transition p-1"
                                                    title="Remove day"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Title */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
                                                    Day {item.day}:
                                                </span>

                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={item.title}
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

                                            {/* Description */}
                                            <div className="quill-itinerary">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={item.description}
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
                            </section>
                        </form>
                    </div>

                    {/* Footer - Attached at bottom */}
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
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
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Tour"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditToursForm;