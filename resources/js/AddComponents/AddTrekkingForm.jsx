// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     X,
//     Plus,
//     Trash2,
//     ImagePlus,
//     ChevronDown,
//     Loader2,
//     Mountain,
// } from "lucide-react";

// /**
//  * AddTrekkingForm
//  *
//  * Props:
//  *  - showForm          {boolean}   Whether the modal is visible
//  *  - setShowForm       {fn}        Toggle modal visibility
//  *  - setReloadTrigger  {fn}        Flip to cause parent list to refresh
//  *  - editingTrekking   {object|null} The trekking being edited, or null for create
//  *  - setEditingTrekking {fn}       Clear editing state on close
//  *  - handleUpdate      {fn}        (formData, id) => Promise — injected from parent
//  *  - allCategory       {array}     Categories with sub_categories from parent
//  */
// const AddTrekkingForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingTrekking,
//     setEditingTrekking,
//     handleUpdate,
//     allCategory = [],
// }) => {
//     const isEditing = Boolean(editingTrekking);

//     // ─── Form State ──────────────────────────────────────────────────────────
//     const emptyForm = {
//         title: "",
//         category_id: "",
//         sub_category_id: "",
//         price: "",
//         description: "",
//         includes: "",
//         excludes: "",
//     };

//     const [formData, setFormData] = useState(emptyForm);
//     const [newImages, setNewImages] = useState([]); // File[] for upload
//     const [previewUrls, setPreviewUrls] = useState([]); // local blob previews
//     const [existingImages, setExistingImages] = useState([]); // from server when editing

//     // Itineraries: array of { day, title, description }
//     const [itineraries, setItineraries] = useState([]);

//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});

//     // Derived sub-categories based on selected category
//     const selectedCategory = allCategory.find(
//         (c) => String(c.id) === String(formData.category_id)
//     );
//     const subCategories = selectedCategory?.sub_categories || [];

//     // ─── Populate form when editing ─────────────────────────────────────────
//     useEffect(() => {
//         if (editingTrekking) {
//             setFormData({
//                 title: editingTrekking.title || "",
//                 category_id: editingTrekking.category_id || "",
//                 sub_category_id: editingTrekking.sub_category_id || "",
//                 price: editingTrekking.price || "",
//                 description: editingTrekking.description || "",
//                 includes: editingTrekking.includes || "",
//                 excludes: editingTrekking.excludes || "",
//             });
//             setExistingImages(editingTrekking.images || []);
//             setItineraries(
//                 (editingTrekking.itineraries || []).map((i, idx) => ({
//                     day: i.day || idx + 1,
//                     title: i.title || "",
//                     description: i.description || "",
//                 }))
//             );
//             setNewImages([]);
//             setPreviewUrls([]);
//         } else {
//             resetForm();
//         }
//     }, [editingTrekking]);

//     // Clean up blob URLs on unmount / change
//     useEffect(() => {
//         return () => {
//             previewUrls.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [previewUrls]);

//     // ─── Helpers ─────────────────────────────────────────────────────────────
//     const resetForm = () => {
//         setFormData(emptyForm);
//         setNewImages([]);
//         setPreviewUrls([]);
//         setExistingImages([]);
//         setItineraries([]);
//         setErrors({});
//     };

//     const closeModal = () => {
//         resetForm();
//         setEditingTrekking(null);
//         setShowForm(false);
//     };

//     // ─── Field Change ─────────────────────────────────────────────────────────
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//             // Reset sub-category when category changes
//             ...(name === "category_id" ? { sub_category_id: "" } : {}),
//         }));
//         // Clear error on change
//         if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
//     };

//     // ─── Image Handling ───────────────────────────────────────────────────────
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (!files.length) return;

//         setNewImages((prev) => [...prev, ...files]);
//         const urls = files.map((f) => URL.createObjectURL(f));
//         setPreviewUrls((prev) => [...prev, ...urls]);

//         // Reset input so same file can be re-selected
//         e.target.value = "";
//     };

//     const removeNewImage = (index) => {
//         URL.revokeObjectURL(previewUrls[index]);
//         setNewImages((prev) => prev.filter((_, i) => i !== index));
//         setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//     };

//     // ─── Itinerary Handling ───────────────────────────────────────────────────
//     const addItineraryRow = () => {
//         setItineraries((prev) => [
//             ...prev,
//             { day: prev.length + 1, title: "", description: "" },
//         ]);
//     };

//     const removeItineraryRow = (index) => {
//         setItineraries((prev) => {
//             const updated = prev.filter((_, i) => i !== index);
//             // Re-number days
//             return updated.map((item, i) => ({ ...item, day: i + 1 }));
//         });
//     };

//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((item, i) =>
//                 i === index ? { ...item, [field]: value } : item
//             )
//         );
//     };

//     // ─── Validation ───────────────────────────────────────────────────────────
//     const validate = () => {
//         const newErrors = {};
//         if (!formData.title.trim()) newErrors.title = "Title is required.";
//         if (!formData.category_id) newErrors.category_id = "Please select a category.";
//         if (!formData.description.trim()) newErrors.description = "Description is required.";

//         itineraries.forEach((item, i) => {
//             if (!item.title.trim())
//                 newErrors[`itinerary_title_${i}`] = "Title required.";
//             if (!item.description.trim())
//                 newErrors[`itinerary_desc_${i}`] = "Description required.";
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // ─── Create ───────────────────────────────────────────────────────────────
//     const handleCreate = async (fd) => {
//         await axios.post(route("ourtrekkings.store"), fd, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     // ─── Submit ───────────────────────────────────────────────────────────────
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;

//         const fd = new FormData();

//         // Core fields
//         Object.entries(formData).forEach(([key, value]) => {
//             if (value !== "" && value !== null && value !== undefined) {
//                 fd.append(key, value);
//             }
//         });

//         // Images — append each file under "images[]"
//         newImages.forEach((file) => {
//             fd.append("images[]", file);
//         });

//         // Itineraries — append as indexed arrays (Laravel style)
//         itineraries.forEach((item, i) => {
//             fd.append(`itineraries[${i}][day]`, item.day);
//             fd.append(`itineraries[${i}][title]`, item.title);
//             fd.append(`itineraries[${i}][description]`, item.description);
//         });

//         try {
//             setSubmitting(true);
//             if (isEditing) {
//                 await handleUpdate(fd, editingTrekking.id);
//             } else {
//                 await handleCreate(fd);
//             }
//             closeModal();
//         } catch (error) {
//             // Surface Laravel validation errors (422)
//             if (error.response?.status === 422) {
//                 const laravelErrors = error.response.data.errors || {};
//                 const mapped = {};
//                 Object.entries(laravelErrors).forEach(([key, msgs]) => {
//                     mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
//                 });
//                 setErrors(mapped);
//             } else {
//                 console.error("Error saving trekking:", error);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!showForm) return null;

//     // ─── Render ───────────────────────────────────────────────────────────────
//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
//                 {/* ── Header ── */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-indigo-100 rounded-lg">
//                             <Mountain size={18} className="text-indigo-600" />
//                         </div>
//                         <h2 className="text-xl font-bold text-gray-800">
//                             {isEditing ? "Edit Trekking" : "Add New Trekking"}
//                         </h2>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={closeModal}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* ── Scrollable Body ── */}
//                 <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             Title <span className="text-red-400 ml-0.5">*</span>
//                         </label>
//                         <input
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             placeholder="e.g. Everest Base Camp Trek"
//                             className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                 errors.title
//                                     ? "border-red-400 focus:border-red-400"
//                                     : "border-gray-200 focus:border-indigo-400"
//                             } bg-white placeholder-gray-400`}
//                         />
//                         {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//                     </div>

//                     {/* Category + Sub-category */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         {/* Category */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Category <span className="text-red-400 ml-0.5">*</span>
//                             </label>
//                             <div className="relative">
//                                 <select
//                                     name="category_id"
//                                     value={formData.category_id}
//                                     onChange={handleChange}
//                                     className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                         errors.category_id
//                                             ? "border-red-400 focus:border-red-400"
//                                             : "border-gray-200 focus:border-indigo-400"
//                                     } bg-white`}
//                                 >
//                                     <option value="">Select category</option>
//                                     {allCategory.map((cat) => (
//                                         <option key={cat.id} value={cat.id}>
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                             </div>
//                             {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
//                         </div>

//                         {/* Sub-category */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Sub-category
//                             </label>
//                             <div className="relative">
//                                 <select
//                                     name="sub_category_id"
//                                     value={formData.sub_category_id}
//                                     onChange={handleChange}
//                                     disabled={subCategories.length === 0}
//                                     className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                         errors.sub_category_id
//                                             ? "border-red-400 focus:border-red-400"
//                                             : "border-gray-200 focus:border-indigo-400"
//                                     } ${subCategories.length === 0 ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
//                                 >
//                                     <option value="">
//                                         {subCategories.length === 0
//                                             ? "No sub-categories"
//                                             : "Select sub-category"}
//                                     </option>
//                                     {subCategories.map((sub) => (
//                                         <option key={sub.id} value={sub.id}>
//                                             {sub.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                             </div>
//                             {errors.sub_category_id && <p className="text-red-500 text-xs mt-1">{errors.sub_category_id}</p>}
//                         </div>
//                     </div>

//                     {/* Price */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             Price (USD)
//                         </label>
//                         <div className="relative">
//                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">$</span>
//                             <input
//                                 name="price"
//                                 type="number"
//                                 min="0"
//                                 step="0.01"
//                                 value={formData.price}
//                                 onChange={handleChange}
//                                 placeholder="0.00"
//                                 className={`w-full px-3.5 py-2.5 pl-7 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                     errors.price
//                                         ? "border-red-400 focus:border-red-400"
//                                         : "border-gray-200 focus:border-indigo-400"
//                                 } bg-white placeholder-gray-400`}
//                             />
//                         </div>
//                         {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             Description <span className="text-red-400 ml-0.5">*</span>
//                         </label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             rows={4}
//                             placeholder="Describe this trek…"
//                             className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 resize-none ${
//                                 errors.description
//                                     ? "border-red-400 focus:border-red-400"
//                                     : "border-gray-200 focus:border-indigo-400"
//                             } bg-white placeholder-gray-400`}
//                         />
//                         {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//                     </div>

//                     {/* Includes / Excludes */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Includes
//                             </label>
//                             <textarea
//                                 name="includes"
//                                 value={formData.includes}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 placeholder="What's included…"
//                                 className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 resize-none ${
//                                     errors.includes
//                                         ? "border-red-400 focus:border-red-400"
//                                         : "border-gray-200 focus:border-indigo-400"
//                                 } bg-white placeholder-gray-400`}
//                             />
//                             {errors.includes && <p className="text-red-500 text-xs mt-1">{errors.includes}</p>}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Excludes
//                             </label>
//                             <textarea
//                                 name="excludes"
//                                 value={formData.excludes}
//                                 onChange={handleChange}
//                                 rows={3}
//                                 placeholder="What's excluded…"
//                                 className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 resize-none ${
//                                     errors.excludes
//                                         ? "border-red-400 focus:border-red-400"
//                                         : "border-gray-200 focus:border-indigo-400"
//                                 } bg-white placeholder-gray-400`}
//                             />
//                             {errors.excludes && <p className="text-red-500 text-xs mt-1">{errors.excludes}</p>}
//                         </div>
//                     </div>

//                     {/* ── Images ── */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Images
//                         </label>

//                         {/* Existing images (edit mode) */}
//                         {existingImages.length > 0 && (
//                             <div className="mb-3">
//                                 <p className="text-xs text-gray-400 mb-2">Current images</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {existingImages.map((img) => (
//                                         <img
//                                             key={img.id}
//                                             src={`/storage/${img.image}`}
//                                             alt="existing"
//                                             className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* New image previews */}
//                         {previewUrls.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mb-3">
//                                 {previewUrls.map((url, i) => (
//                                     <div key={i} className="relative group">
//                                         <img
//                                             src={url}
//                                             alt={`preview-${i}`}
//                                             className="w-16 h-16 object-cover rounded-lg border border-indigo-200"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeNewImage(i)}
//                                             className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
//                                         >
//                                             <X size={11} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Upload button */}
//                         <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-sm text-gray-500 w-fit">
//                             <ImagePlus size={17} className="text-indigo-400" />
//                             <span>
//                                 {isEditing ? "Add more images" : "Upload images"}
//                             </span>
//                             <input
//                                 type="file"
//                                 accept="image/jpg,image/jpeg,image/png,image/webp"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                         {errors["images.0"] && (
//                             <p className="text-red-500 text-xs mt-1">{errors["images.0"]}</p>
//                         )}
//                     </div>

//                     {/* ── Itinerary Builder ── */}
//                     <div>
//                         <div className="flex items-center justify-between mb-3">
//                             <label className="block text-sm font-semibold text-gray-700">
//                                 Itinerary
//                             </label>
//                             <button
//                                 type="button"
//                                 onClick={addItineraryRow}
//                                 className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
//                             >
//                                 <Plus size={13} />
//                                 Add Day
//                             </button>
//                         </div>

//                         {itineraries.length === 0 ? (
//                             <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
//                                 No itinerary added yet. Click "Add Day" to start.
//                             </p>
//                         ) : (
//                             <div className="space-y-4">
//                                 {itineraries.map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className="border border-gray-200 rounded-lg p-4 relative"
//                                     >
//                                         <div className="flex justify-end mb-2">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeItineraryRow(index)}
//                                                 className="text-red-400 hover:text-red-600 transition"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>

//                                         {/* Day label and Title input on same row */}
//                                         <div className="flex items-center gap-3 mb-3">
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
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                     required
//                                                     placeholder="Day title (e.g. Fly to Lukla)"
//                                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                 />
//                                             </div>
//                                         </div>
//                                         {errors[`itinerary_title_${index}`] && (
//                                             <p className="text-red-500 text-xs mb-2 -mt-2">
//                                                 {errors[`itinerary_title_${index}`]}
//                                             </p>
//                                         )}

//                                         {/* Description below */}
//                                         <div>
//                                             <textarea
//                                                 value={item.description}
//                                                 onChange={(e) =>
//                                                     handleItineraryChange(
//                                                         index,
//                                                         "description",
//                                                         e.target.value
//                                                     )
//                                                 }
//                                                 required
//                                                 rows={2}
//                                                 placeholder="Describe what happens this day…"
//                                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//                                             />
//                                         </div>
//                                         {errors[`itinerary_desc_${index}`] && (
//                                             <p className="text-red-500 text-xs mt-1">
//                                                 {errors[`itinerary_desc_${index}`]}
//                                             </p>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </form>

//                 {/* ── Footer ── */}
//                 <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
//                     <button
//                         type="button"
//                         onClick={closeModal}
//                         disabled={submitting}
//                         className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={submitting}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
//                     >
//                         {submitting ? (
//                             <>
//                                 <Loader2 size={15} className="animate-spin" />
//                                 <span>{isEditing ? "Updating…" : "Creating…"}</span>
//                             </>
//                         ) : (
//                             <span>{isEditing ? "Update Trekking" : "Create Trekking"}</span>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddTrekkingForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    X,
    Plus,
    Trash2,
    ImagePlus,
    ChevronDown,
    Loader2,
    Mountain,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * AddTrekkingForm - For creating new trekking entries
 *
 * Props:
 *  - showForm          {boolean}   Whether the modal is visible
 *  - setShowForm       {fn}        Toggle modal visibility
 *  - setReloadTrigger  {fn}        Flip to cause parent list to refresh
 *  - allCategory       {array}     Categories with sub_categories from parent
 */
const AddTrekkingForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    allCategory = [],
}) => {
    // ─── Form State ──────────────────────────────────────────────────────────
    const emptyForm = {
        title: "",
        category_id: "",
        sub_category_id: "",
        price: "",
        description: "",
        includes: "",
        excludes: "",
    };

    const [formData, setFormData] = useState(emptyForm);
    const [newImages, setNewImages] = useState([]); // File[] for upload
    const [previewUrls, setPreviewUrls] = useState([]); // local blob previews
    const [itineraries, setItineraries] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Derived sub-categories based on selected category
    const selectedCategory = allCategory.find(
        (c) => String(c.id) === String(formData.category_id)
    );
    const subCategories = selectedCategory?.sub_categories || [];

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

    // ─── Clean up blob URLs on unmount ─────────────────────────────────────
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    // ─── Reset form when modal opens ───────────────────────────────────────
    useEffect(() => {
        if (showForm) {
            resetForm();
        }
    }, [showForm]);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const resetForm = () => {
        setFormData(emptyForm);
        setNewImages([]);
        setPreviewUrls([]);
        setItineraries([]);
        setErrors({});
    };

    const closeModal = () => {
        resetForm();
        setShowForm(false);
    };

    // ─── Field Change ─────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Reset sub-category when category changes
            ...(name === "category_id" ? { sub_category_id: "" } : {}),
        }));
        // Clear error on change
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleRichTextChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    // ─── Image Handling ───────────────────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setNewImages((prev) => [...prev, ...files]);
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviewUrls((prev) => [...prev, ...urls]);

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(previewUrls[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Itinerary Handling ───────────────────────────────────────────────────
    const addItineraryRow = () => {
        setItineraries((prev) => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" },
        ]);
    };

    const removeItineraryRow = (index) => {
        setItineraries((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            return updated.map((item, i) => ({ ...item, day: i + 1 }));
        });
    };

    const handleItineraryChange = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // ─── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.category_id) newErrors.category_id = "Please select a category.";
        
        const stripHtml = (html) => {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };
        
        if (!stripHtml(formData.description).trim()) {
            newErrors.description = "Description is required.";
        }

        itineraries.forEach((item, i) => {
            if (!item.title.trim())
                newErrors[`itinerary_title_${i}`] = "Title required.";
            if (!stripHtml(item.description).trim())
                newErrors[`itinerary_desc_${i}`] = "Description required.";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ─── Create ───────────────────────────────────────────────────────────────
    const handleCreate = async (fd) => {
        await axios.post(route("ourtrekkings.store"), fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const fd = new FormData();

        // Core fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                fd.append(key, value);
            }
        });

        // Images
        newImages.forEach((file) => {
            fd.append("images[]", file);
        });

        // Itineraries
        itineraries.forEach((item, i) => {
            fd.append(`itineraries[${i}][day]`, item.day);
            fd.append(`itineraries[${i}][title]`, item.title);
            fd.append(`itineraries[${i}][description]`, item.description);
        });

        try {
            setSubmitting(true);
            await handleCreate(fd);
            closeModal();
        } catch (error) {
            if (error.response?.status === 422) {
                const laravelErrors = error.response.data.errors || {};
                const mapped = {};
                Object.entries(laravelErrors).forEach(([key, msgs]) => {
                    mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setErrors(mapped);
            } else {
                console.error("Error creating trekking:", error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm) return null;

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
                    border-color: #e5e7eb;
                }

                .ql-container.ql-snow {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    border-color: #e5e7eb;
                }
                `}
            </style>

            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Mountain size={18} className="text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add New Trekking
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Title <span className="text-red-400 ml-0.5">*</span>
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Everest Base Camp Trek"
                                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
                                    errors.title
                                        ? "border-red-400 focus:border-red-400"
                                        : "border-gray-200 focus:border-indigo-400"
                                } bg-white placeholder-gray-400`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Category + Sub-category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Category <span className="text-red-400 ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
                                            errors.category_id
                                                ? "border-red-400 focus:border-red-400"
                                                : "border-gray-200 focus:border-indigo-400"
                                        } bg-white`}
                                    >
                                        <option value="">Select category</option>
                                        {allCategory.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Sub-category
                                </label>
                                <div className="relative">
                                    <select
                                        name="sub_category_id"
                                        value={formData.sub_category_id}
                                        onChange={handleChange}
                                        disabled={subCategories.length === 0}
                                        className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
                                            errors.sub_category_id
                                                ? "border-red-400 focus:border-red-400"
                                                : "border-gray-200 focus:border-indigo-400"
                                        } ${subCategories.length === 0 ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
                                    >
                                        <option value="">
                                            {subCategories.length === 0
                                                ? "No sub-categories"
                                                : "Select sub-category"}
                                        </option>
                                        {subCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.sub_category_id && <p className="text-red-500 text-xs mt-1">{errors.sub_category_id}</p>}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Price (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">$</span>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`w-full px-3.5 py-2.5 pl-7 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
                                        errors.price
                                            ? "border-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:border-indigo-400"
                                    } bg-white placeholder-gray-400`}
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-400 ml-0.5">*</span>
                            </label>
                            <div className="quill-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(value) => handleRichTextChange("description", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Describe this trek in detail..."
                                />
                            </div>
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Includes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Includes
                            </label>
                            <div className="quill-small">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.includes}
                                    onChange={(value) => handleRichTextChange("includes", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="What's included in this trek..."
                                />
                            </div>
                            {errors.includes && <p className="text-red-500 text-xs mt-1">{errors.includes}</p>}
                        </div>

                        {/* Excludes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Excludes
                            </label>
                            <div className="quill-small">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.excludes}
                                    onChange={(value) => handleRichTextChange("excludes", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="What's excluded from this trek..."
                                />
                            </div>
                            {errors.excludes && <p className="text-red-500 text-xs mt-1">{errors.excludes}</p>}
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Images
                            </label>

                            {previewUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {previewUrls.map((url, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={url}
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

                            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-sm text-gray-500 w-fit">
                                <ImagePlus size={17} className="text-indigo-400" />
                                <span>Upload images</span>
                                <input
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {errors["images.0"] && (
                                <p className="text-red-500 text-xs mt-1">{errors["images.0"]}</p>
                            )}
                        </div>

                        {/* Itinerary Builder */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Itinerary
                                </label>
                                <button
                                    type="button"
                                    onClick={addItineraryRow}
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
                                <div className="space-y-4">
                                    {itineraries.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 relative"
                                        >
                                            <div className="flex justify-end mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItineraryRow(index)}
                                                    className="text-red-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

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
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        placeholder="Day title (e.g. Fly to Lukla)"
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            {errors[`itinerary_title_${index}`] && (
                                                <p className="text-red-500 text-xs mb-2 -mt-2">
                                                    {errors[`itinerary_title_${index}`]}
                                                </p>
                                            )}

                                            <div className="quill-itinerary">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={item.description}
                                                    onChange={(value) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "description",
                                                            value
                                                        )
                                                    }
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    placeholder="Describe what happens this day..."
                                                />
                                            </div>
                                            {errors[`itinerary_desc_${index}`] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors[`itinerary_desc_${index}`]}
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
                            onClick={closeModal}
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Creating…</span>
                                </>
                            ) : (
                                <span>Create Trekking</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTrekkingForm;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     X,
//     Plus,
//     Trash2,
//     ImagePlus,
//     ChevronDown,
//     Loader2,
//     Mountain,
// } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// /**
//  * AddTrekkingForm
//  *
//  * Props:
//  *  - showForm          {boolean}   Whether the modal is visible
//  *  - setShowForm       {fn}        Toggle modal visibility
//  *  - setReloadTrigger  {fn}        Flip to cause parent list to refresh
//  *  - editingTrekking   {object|null} The trekking being edited, or null for create
//  *  - setEditingTrekking {fn}       Clear editing state on close
//  *  - handleUpdate      {fn}        (formData, id) => Promise — injected from parent
//  *  - allCategory       {array}     Categories with sub_categories from parent
//  */
// const AddTrekkingForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingTrekking,
//     setEditingTrekking,
//     handleUpdate,
//     allCategory = [],
// }) => {
//     const isEditing = Boolean(editingTrekking);

//     // ─── Form State ──────────────────────────────────────────────────────────
//     const emptyForm = {
//         title: "",
//         category_id: "",
//         sub_category_id: "",
//         price: "",
//         description: "",
//         includes: "",
//         excludes: "",
//     };

//     const [formData, setFormData] = useState(emptyForm);
//     const [newImages, setNewImages] = useState([]); // File[] for upload
//     const [previewUrls, setPreviewUrls] = useState([]); // local blob previews
//     const [existingImages, setExistingImages] = useState([]); // from server when editing

//     // Itineraries: array of { day, title, description }
//     const [itineraries, setItineraries] = useState([]);

//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});

//     // Derived sub-categories based on selected category
//     const selectedCategory = allCategory.find(
//         (c) => String(c.id) === String(formData.category_id)
//     );
//     const subCategories = selectedCategory?.sub_categories || [];

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

//     // ─── Populate form when editing ─────────────────────────────────────────
//     useEffect(() => {
//         if (editingTrekking) {
//             setFormData({
//                 title: editingTrekking.title || "",
//                 category_id: editingTrekking.category_id || "",
//                 sub_category_id: editingTrekking.sub_category_id || "",
//                 price: editingTrekking.price || "",
//                 description: editingTrekking.description || "",
//                 includes: editingTrekking.includes || "",
//                 excludes: editingTrekking.excludes || "",
//             });
//             setExistingImages(editingTrekking.images || []);
//             setItineraries(
//                 (editingTrekking.itineraries || []).map((i, idx) => ({
//                     day: i.day || idx + 1,
//                     title: i.title || "",
//                     description: i.description || "",
//                 }))
//             );
//             setNewImages([]);
//             setPreviewUrls([]);
//         } else {
//             resetForm();
//         }
//     }, [editingTrekking]);

//     // Clean up blob URLs on unmount / change
//     useEffect(() => {
//         return () => {
//             previewUrls.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [previewUrls]);

//     // ─── Helpers ─────────────────────────────────────────────────────────────
//     const resetForm = () => {
//         setFormData(emptyForm);
//         setNewImages([]);
//         setPreviewUrls([]);
//         setExistingImages([]);
//         setItineraries([]);
//         setErrors({});
//     };

//     const closeModal = () => {
//         resetForm();
//         setEditingTrekking(null);
//         setShowForm(false);
//     };

//     // ─── Field Change ─────────────────────────────────────────────────────────
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//             // Reset sub-category when category changes
//             ...(name === "category_id" ? { sub_category_id: "" } : {}),
//         }));
//         // Clear error on change
//         if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
//     };

//     const handleRichTextChange = (field, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//         // Clear error on change
//         if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
//     };

//     // ─── Image Handling ───────────────────────────────────────────────────────
//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (!files.length) return;

//         setNewImages((prev) => [...prev, ...files]);
//         const urls = files.map((f) => URL.createObjectURL(f));
//         setPreviewUrls((prev) => [...prev, ...urls]);

//         // Reset input so same file can be re-selected
//         e.target.value = "";
//     };

//     const removeNewImage = (index) => {
//         URL.revokeObjectURL(previewUrls[index]);
//         setNewImages((prev) => prev.filter((_, i) => i !== index));
//         setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//     };

//     // ─── Itinerary Handling ───────────────────────────────────────────────────
//     const addItineraryRow = () => {
//         setItineraries((prev) => [
//             ...prev,
//             { day: prev.length + 1, title: "", description: "" },
//         ]);
//     };

//     const removeItineraryRow = (index) => {
//         setItineraries((prev) => {
//             const updated = prev.filter((_, i) => i !== index);
//             // Re-number days
//             return updated.map((item, i) => ({ ...item, day: i + 1 }));
//         });
//     };

//     const handleItineraryChange = (index, field, value) => {
//         setItineraries((prev) =>
//             prev.map((item, i) =>
//                 i === index ? { ...item, [field]: value } : item
//             )
//         );
//     };

//     // ─── Validation ───────────────────────────────────────────────────────────
//     const validate = () => {
//         const newErrors = {};
//         if (!formData.title.trim()) newErrors.title = "Title is required.";
//         if (!formData.category_id) newErrors.category_id = "Please select a category.";
        
//         // Check if rich text content is empty (strip HTML tags)
//         const stripHtml = (html) => {
//             const tmp = document.createElement("div");
//             tmp.innerHTML = html;
//             return tmp.textContent || tmp.innerText || "";
//         };
        
//         if (!stripHtml(formData.description).trim()) {
//             newErrors.description = "Description is required.";
//         }

//         itineraries.forEach((item, i) => {
//             if (!item.title.trim())
//                 newErrors[`itinerary_title_${i}`] = "Title required.";
//             if (!stripHtml(item.description).trim())
//                 newErrors[`itinerary_desc_${i}`] = "Description required.";
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // ─── Create ───────────────────────────────────────────────────────────────
//     const handleCreate = async (fd) => {
//         await axios.post(route("ourtrekkings.store"), fd, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     // ─── Submit ───────────────────────────────────────────────────────────────
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validate()) return;

//         const fd = new FormData();

//         // Core fields
//         Object.entries(formData).forEach(([key, value]) => {
//             if (value !== "" && value !== null && value !== undefined) {
//                 fd.append(key, value);
//             }
//         });

//         // Images — append each file under "images[]"
//         newImages.forEach((file) => {
//             fd.append("images[]", file);
//         });

//         // Itineraries — append as indexed arrays (Laravel style)
//         itineraries.forEach((item, i) => {
//             fd.append(`itineraries[${i}][day]`, item.day);
//             fd.append(`itineraries[${i}][title]`, item.title);
//             fd.append(`itineraries[${i}][description]`, item.description);
//         });

//         try {
//             setSubmitting(true);
//             if (isEditing) {
//                 await handleUpdate(fd, editingTrekking.id);
//             } else {
//                 await handleCreate(fd);
//             }
//             closeModal();
//         } catch (error) {
//             // Surface Laravel validation errors (422)
//             if (error.response?.status === 422) {
//                 const laravelErrors = error.response.data.errors || {};
//                 const mapped = {};
//                 Object.entries(laravelErrors).forEach(([key, msgs]) => {
//                     mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
//                 });
//                 setErrors(mapped);
//             } else {
//                 console.error("Error saving trekking:", error);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!showForm) return null;

//     // Helper to strip HTML for validation display
//     const stripHtmlForDisplay = (html) => {
//         const tmp = document.createElement("div");
//         tmp.innerHTML = html;
//         return tmp.textContent || tmp.innerText || "";
//     };

//     // ─── Render ───────────────────────────────────────────────────────────────
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
//                     border-color: #e5e7eb;
//                 }

//                 .ql-container.ql-snow {
//                     border-bottom-left-radius: 8px;
//                     border-bottom-right-radius: 8px;
//                     border-color: #e5e7eb;
//                 }
//                 `}
//             </style>

//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
//                     {/* ── Header ── */}
//                     <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-indigo-100 rounded-lg">
//                                 <Mountain size={18} className="text-indigo-600" />
//                             </div>
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 {isEditing ? "Edit Trekking" : "Add New Trekking"}
//                             </h2>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={closeModal}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>

//                     {/* ── Scrollable Body ── */}
//                     <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

//                         {/* Title */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Title <span className="text-red-400 ml-0.5">*</span>
//                             </label>
//                             <input
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleChange}
//                                 placeholder="e.g. Everest Base Camp Trek"
//                                 className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                     errors.title
//                                         ? "border-red-400 focus:border-red-400"
//                                         : "border-gray-200 focus:border-indigo-400"
//                                 } bg-white placeholder-gray-400`}
//                             />
//                             {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//                         </div>

//                         {/* Category + Sub-category */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* Category */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                     Category <span className="text-red-400 ml-0.5">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <select
//                                         name="category_id"
//                                         value={formData.category_id}
//                                         onChange={handleChange}
//                                         className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                             errors.category_id
//                                                 ? "border-red-400 focus:border-red-400"
//                                                 : "border-gray-200 focus:border-indigo-400"
//                                         } bg-white`}
//                                     >
//                                         <option value="">Select category</option>
//                                         {allCategory.map((cat) => (
//                                             <option key={cat.id} value={cat.id}>
//                                                 {cat.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                 </div>
//                                 {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
//                             </div>

//                             {/* Sub-category */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                     Sub-category
//                                 </label>
//                                 <div className="relative">
//                                     <select
//                                         name="sub_category_id"
//                                         value={formData.sub_category_id}
//                                         onChange={handleChange}
//                                         disabled={subCategories.length === 0}
//                                         className={`w-full appearance-none px-3.5 py-2.5 pr-8 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                             errors.sub_category_id
//                                                 ? "border-red-400 focus:border-red-400"
//                                                 : "border-gray-200 focus:border-indigo-400"
//                                         } ${subCategories.length === 0 ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
//                                     >
//                                         <option value="">
//                                             {subCategories.length === 0
//                                                 ? "No sub-categories"
//                                                 : "Select sub-category"}
//                                         </option>
//                                         {subCategories.map((sub) => (
//                                             <option key={sub.id} value={sub.id}>
//                                                 {sub.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                 </div>
//                                 {errors.sub_category_id && <p className="text-red-500 text-xs mt-1">{errors.sub_category_id}</p>}
//                             </div>
//                         </div>

//                         {/* Price */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Price (USD)
//                             </label>
//                             <div className="relative">
//                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">$</span>
//                                 <input
//                                     name="price"
//                                     type="number"
//                                     min="0"
//                                     step="0.01"
//                                     value={formData.price}
//                                     onChange={handleChange}
//                                     placeholder="0.00"
//                                     className={`w-full px-3.5 py-2.5 pl-7 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-indigo-300 ${
//                                         errors.price
//                                             ? "border-red-400 focus:border-red-400"
//                                             : "border-gray-200 focus:border-indigo-400"
//                                     } bg-white placeholder-gray-400`}
//                                 />
//                             </div>
//                             {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
//                         </div>

//                         {/* Description - Rich Text Editor */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Description <span className="text-red-400 ml-0.5">*</span>
//                             </label>
//                             <div className="quill-wrapper">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={formData.description}
//                                     onChange={(value) => handleRichTextChange("description", value)}
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="Describe this trek in detail..."
//                                 />
//                             </div>
//                             {errors.description && (
//                                 <p className="text-red-500 text-xs mt-1">{errors.description}</p>
//                             )}
//                         </div>

//                         {/* Includes Section */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Includes
//                             </label>
//                             <div className="quill-small">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={formData.includes}
//                                     onChange={(value) => handleRichTextChange("includes", value)}
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="What's included in this trek..."
//                                 />
//                             </div>
//                             {errors.includes && <p className="text-red-500 text-xs mt-1">{errors.includes}</p>}
//                         </div>

//                         {/* Excludes Section */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Excludes
//                             </label>
//                             <div className="quill-small">
//                                 <ReactQuill
//                                     theme="snow"
//                                     value={formData.excludes}
//                                     onChange={(value) => handleRichTextChange("excludes", value)}
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     placeholder="What's excluded from this trek..."
//                                 />
//                             </div>
//                             {errors.excludes && <p className="text-red-500 text-xs mt-1">{errors.excludes}</p>}
//                         </div>

//                         {/* ── Images ── */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Images
//                             </label>

//                             {/* Existing images (edit mode) */}
//                             {existingImages.length > 0 && (
//                                 <div className="mb-3">
//                                     <p className="text-xs text-gray-400 mb-2">Current images</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {existingImages.map((img) => (
//                                             <img
//                                                 key={img.id}
//                                                 src={`/storage/${img.image}`}
//                                                 alt="existing"
//                                                 className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* New image previews */}
//                             {previewUrls.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mb-3">
//                                     {previewUrls.map((url, i) => (
//                                         <div key={i} className="relative group">
//                                             <img
//                                                 src={url}
//                                                 alt={`preview-${i}`}
//                                                 className="w-16 h-16 object-cover rounded-lg border border-indigo-200"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeNewImage(i)}
//                                                 className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
//                                             >
//                                                 <X size={11} />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Upload button */}
//                             <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-sm text-gray-500 w-fit">
//                                 <ImagePlus size={17} className="text-indigo-400" />
//                                 <span>
//                                     {isEditing ? "Add more images" : "Upload images"}
//                                 </span>
//                                 <input
//                                     type="file"
//                                     accept="image/jpg,image/jpeg,image/png,image/webp"
//                                     multiple
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                 />
//                             </label>
//                             {errors["images.0"] && (
//                                 <p className="text-red-500 text-xs mt-1">{errors["images.0"]}</p>
//                             )}
//                         </div>

//                         {/* ── Itinerary Builder with Rich Text Editor ── */}
//                         <div>
//                             <div className="flex items-center justify-between mb-3">
//                                 <label className="block text-sm font-semibold text-gray-700">
//                                     Itinerary
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={addItineraryRow}
//                                     className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
//                                 >
//                                     <Plus size={13} />
//                                     Add Day
//                                 </button>
//                             </div>

//                             {itineraries.length === 0 ? (
//                                 <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-xl">
//                                     No itinerary added yet. Click "Add Day" to start.
//                                 </p>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {itineraries.map((item, index) => (
//                                         <div
//                                             key={index}
//                                             className="border border-gray-200 rounded-lg p-4 relative"
//                                         >
//                                             <div className="flex justify-end mb-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeItineraryRow(index)}
//                                                     className="text-red-400 hover:text-red-600 transition"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>

//                                             {/* Day label and Title input on same row */}
//                                             <div className="flex items-center gap-3 mb-4">
//                                                 <span className="font-semibold text-indigo-600 text-sm whitespace-nowrap">
//                                                     Day {item.day}:
//                                                 </span>
//                                                 <div className="flex-1">
//                                                     <input
//                                                         type="text"
//                                                         value={item.title}
//                                                         onChange={(e) =>
//                                                             handleItineraryChange(
//                                                                 index,
//                                                                 "title",
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                         required
//                                                         placeholder="Day title (e.g. Fly to Lukla)"
//                                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                     />
//                                                 </div>
//                                             </div>
//                                             {errors[`itinerary_title_${index}`] && (
//                                                 <p className="text-red-500 text-xs mb-2 -mt-2">
//                                                     {errors[`itinerary_title_${index}`]}
//                                                 </p>
//                                             )}

//                                             {/* Description - Rich Text Editor */}
//                                             <div className="quill-itinerary">
//                                                 <ReactQuill
//                                                     theme="snow"
//                                                     value={item.description}
//                                                     onChange={(value) =>
//                                                         handleItineraryChange(
//                                                             index,
//                                                             "description",
//                                                             value
//                                                         )
//                                                     }
//                                                     modules={quillModules}
//                                                     formats={quillFormats}
//                                                     placeholder="Describe what happens this day..."
//                                                 />
//                                             </div>
//                                             {errors[`itinerary_desc_${index}`] && (
//                                                 <p className="text-red-500 text-xs mt-1">
//                                                     {errors[`itinerary_desc_${index}`]}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </form>

//                     {/* ── Footer ── */}
//                     <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
//                         <button
//                             type="button"
//                             onClick={closeModal}
//                             disabled={submitting}
//                             className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             onClick={handleSubmit}
//                             disabled={submitting}
//                             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <Loader2 size={15} className="animate-spin" />
//                                     <span>{isEditing ? "Updating…" : "Creating…"}</span>
//                                 </>
//                             ) : (
//                                 <span>{isEditing ? "Update Trekking" : "Create Trekking"}</span>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddTrekkingForm;