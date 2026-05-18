import axios from "axios";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EMPTY_QA = { question: "", answer: "" };

// Custom styles for react-select to match the design
const customSelectStyles = {
    control: (base, { isDisabled, isFocused }) => ({
        ...base,
        backgroundColor: isDisabled ? "#f9fafb" : "white",
        borderColor: isFocused ? "#6366f1" : "#e5e7eb",
        borderWidth: "1px",
        borderRadius: "0.5rem",
        padding: "0.125rem 0",
        boxShadow: isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
        "&:hover": {
            borderColor: isFocused ? "#6366f1" : "#d1d5db",
        },
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? "#6366f1"
            : isFocused
            ? "#eef2ff"
            : "white",
        color: isSelected ? "white" : "#374151",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "#6366f1",
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: "#9ca3af",
        fontSize: "0.875rem",
    }),
    singleValue: (base) => ({
        ...base,
        color: "#374151",
        fontSize: "0.875rem",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "#9ca3af",
        "&:hover": {
            color: "#6b7280",
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: "#e5e7eb",
    }),
    loadingIndicator: (base) => ({
        ...base,
        color: "#6366f1",
    }),
};

// Quill modules configuration
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

const AddFAQForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);

    // Step 1: Category
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Step 2: Item (tour / trekking / activity) filtered by category
    const [itemId, setItemId] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // The resolved category type (derived from category name)
    const [categoryType, setCategoryType] = useState(""); // "tour" | "trekking" | "activity" | ""

    // Multiple Q&A pairs
    const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);

    // Fetch categories once on mount
    useEffect(() => {
        setLoadingCategories(true);
        axios
            .get(route("ourcategories.index"))
            .then((res) => {
                const data = res.data?.data ?? res.data;
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(console.error)
            .finally(() => setLoadingCategories(false));
    }, []);

    // When category changes → determine type → fetch matching items
    useEffect(() => {
        setItemId(null);
        setItems([]);
        setCategoryType("");

        if (!categoryId) return;

        const selected = categories.find((c) => String(c.id) === String(categoryId));
        if (!selected) return;

        // Derive type from category name (case-insensitive)
        const nameLower = selected.name.toLowerCase();
        let type = "";
        if (nameLower.includes("tour")) type = "tour";
        else if (nameLower.includes("trek")) type = "trekking";
        else if (nameLower.includes("activ")) type = "activity";

        setCategoryType(type);

        if (!type) return;

        // Fetch items of this type, filtered by category_id on the backend
        setLoadingItems(true);
        const routeMap = {
            tour: "ourtours.index",
            trekking: "ourtrekkings.index",
            activity: "ouractivities.index",
        };

        axios
            .get(route(routeMap[type]))
            .then((res) => {
                const data = res.data?.data ?? res.data;
                const all = Array.isArray(data) ? data : [];
                // Filter by category_id if the items have that field
                const filtered = all.filter(
                    (item) =>
                        !item.category_id || String(item.category_id) === String(categoryId),
                );
                setItems(filtered.length > 0 ? filtered : all);
            })
            .catch(console.error)
            .finally(() => setLoadingItems(false));
    }, [categoryId, categories]);

    const resetForm = () => {
        setCategoryId(null);
        setItemId(null);
        setItems([]);
        setCategoryType("");
        setQaList([{ ...EMPTY_QA }]);
    };

    // Q&A handlers
    const handleQaChange = (index, field, value) => {
        setQaList((prev) =>
            prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
        );
    };
    const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
    const removeQa = (index) =>
        setQaList((prev) => prev.filter((_, i) => i !== index));

    // Build shared payload
    const buildBasePayload = () => {
        const payload = {};
        if (categoryId) payload.category_id = categoryId;
        if (categoryType === "tour" && itemId) payload.tour_id = itemId;
        if (categoryType === "trekking" && itemId) payload.trekking_id = itemId;
        if (categoryType === "activity" && itemId) payload.activity_id = itemId;
        return payload;
    };

    const handleCreate = async (entries) => {
        const base = buildBasePayload();
        await Promise.all(
            entries.map((qa) => {
                const formData = new FormData();
                Object.entries({ ...base, ...qa }).forEach(([k, v]) =>
                    formData.append(k, v)
                );
                return axios.post(route("ourfaqs.store"), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            })
        );
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validQa = qaList.filter(
            (qa) => qa.question.trim() && qa.answer.trim()
        );
        if (validQa.length === 0) return;

        try {
            setSubmitting(true);
            await handleCreate(validQa);
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Error data:", err.response?.data);
            console.log("Validation errors:", err.response?.data?.errors);
            console.log("Message:", err.response?.data?.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        resetForm();
    };

    const validCount = qaList.filter((q) => q.question.trim()).length;

    // Format options for react-select
    const categoryOptions = categories.map((cat) => ({
        value: String(cat.id),
        label: cat.name ?? cat.title,
    }));

    const itemOptions = items.map((item) => ({
        value: String(item.id),
        label: item.name ?? item.title,
    }));

    const selectedCategoryOption = categoryOptions.find(
        (opt) => opt.value === categoryId
    );
    const selectedItemOption = itemOptions.find((opt) => opt.value === itemId);

    if (!showForm) return null;

    return (
        <>
            <style>
                {`
                .quill-faq-answer .ql-container {
                    min-height: 120px;
                    max-height: 250px;
                    overflow-y: auto;
                    font-size: 14px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }

                .quill-faq-answer .ql-editor {
                    min-height: 120px;
                }

                .quill-faq-answer .ql-toolbar.ql-snow {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    border-color: #e5e7eb;
                }

                .quill-faq-answer .ql-container.ql-snow {
                    border-color: #e5e7eb;
                }

                .quill-faq-answer .ql-toolbar.ql-snow + .ql-container.ql-snow {
                    border-top: none;
                }
                `}
            </style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[92vh]">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add New FAQ
                            </h2>
                            {qaList.length > 1 && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {qaList.length} Q&amp;A pairs — all will share
                                    the same association
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col flex-1 overflow-hidden"
                    >
                        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                            {/* Category and Item in same row - flex layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Step 1: Category - React Select */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Category <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Select
                                        options={categoryOptions}
                                        value={selectedCategoryOption}
                                        onChange={(option) =>
                                            setCategoryId(option?.value || null)
                                        }
                                        placeholder={
                                            loadingCategories ? "Loading..." : "Select a category"
                                        }
                                        isDisabled={loadingCategories}
                                        isLoading={loadingCategories}
                                        styles={customSelectStyles}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                    />
                                </div>

                                {/* Step 2: Specific item — appears after category is chosen */}
                                {categoryId && (
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            {categoryType
                                                ? `Select ${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)}`
                                                : "Select Item"}
                                        </label>
                                        <Select
                                            options={itemOptions}
                                            value={selectedItemOption}
                                            onChange={(option) =>
                                                setItemId(option?.value || null)
                                            }
                                            placeholder={
                                                loadingItems
                                                    ? "Loading..."
                                                    : categoryType
                                                    ? `Select a ${categoryType}`
                                                    : "Select an item"
                                            }
                                            isDisabled={!categoryType || loadingItems}
                                            isLoading={loadingItems}
                                            styles={customSelectStyles}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            isClearable
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Warning if category name doesn't map to a known type */}
                            {categoryId && !loadingItems && !categoryType && (
                                <p className="text-xs text-amber-500 flex items-center gap-1.5">
                                    <span>⚠</span>
                                    Category name doesn't match Tour, Trekking, or
                                    Activity — only category will be saved.
                                </p>
                            )}

                            {/* Q&A block */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Questions &amp; Answers
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addQa}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        <Plus size={13} />
                                        Add another
                                    </button>
                                </div>

                                {qaList.map((qa, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
                                    >
                                        {qaList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQa(index)}
                                                className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}

                                        {qaList.length > 1 && (
                                            <p className="text-xs font-semibold text-gray-400">
                                                FAQ #{index + 1}
                                            </p>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Question{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={qa.question}
                                                onChange={(e) =>
                                                    handleQaChange(
                                                        index,
                                                        "question",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                placeholder="e.g. What is included in the package?"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Answer{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="quill-faq-answer">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={qa.answer}
                                                    onChange={(value) =>
                                                        handleQaChange(
                                                            index,
                                                            "answer",
                                                            value
                                                        )
                                                    }
                                                    modules={quillModules}
                                                    formats={quillFormats}
                                                    placeholder="Write a clear, helpful answer..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addQa}
                                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={15} />
                                    Add another Q&amp;A
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[120px] justify-center"
                            >
                                {submitting && (
                                    <Loader2 size={15} className="animate-spin" />
                                )}
                                {submitting
                                    ? "Saving..."
                                    : validCount > 1
                                    ? `Save ${validCount} FAQs`
                                    : "Save FAQ"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddFAQForm;



// import axios from "axios";
// import { X, Plus, Trash2, Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EMPTY_QA = { question: "", answer: "" };

// // Custom styles for react-select to match the design
// const customSelectStyles = {
//     control: (base, { isDisabled, isFocused }) => ({
//         ...base,
//         backgroundColor: isDisabled ? "#f9fafb" : "white",
//         borderColor: isFocused ? "#6366f1" : "#e5e7eb",
//         borderWidth: "1px",
//         borderRadius: "0.5rem",
//         padding: "0.125rem 0",
//         boxShadow: isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
//         "&:hover": {
//             borderColor: isFocused ? "#6366f1" : "#d1d5db",
//         },
//     }),
//     option: (base, { isFocused, isSelected }) => ({
//         ...base,
//         backgroundColor: isSelected
//             ? "#6366f1"
//             : isFocused
//             ? "#eef2ff"
//             : "white",
//         color: isSelected ? "white" : "#374151",
//         cursor: "pointer",
//         "&:active": {
//             backgroundColor: "#6366f1",
//         },
//     }),
//     placeholder: (base) => ({
//         ...base,
//         color: "#9ca3af",
//         fontSize: "0.875rem",
//     }),
//     singleValue: (base) => ({
//         ...base,
//         color: "#374151",
//         fontSize: "0.875rem",
//     }),
//     dropdownIndicator: (base) => ({
//         ...base,
//         color: "#9ca3af",
//         "&:hover": {
//             color: "#6b7280",
//         },
//     }),
//     indicatorSeparator: (base) => ({
//         ...base,
//         backgroundColor: "#e5e7eb",
//     }),
//     loadingIndicator: (base) => ({
//         ...base,
//         color: "#6366f1",
//     }),
// };

// // Quill modules configuration
// const quillModules = {
//     toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "clean"],
//         ["blockquote", "code-block"],
//     ],
// };

// const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "indent",
//     "align",
//     "link",
//     "blockquote",
//     "code-block",
// ];

// const AddFAQForm = ({
//     showForm,
//     setShowForm,
//     editingFaq,
//     setEditingFaq,
//     handleUpdate,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);

//     // Step 1: Category
//     const [categoryId, setCategoryId] = useState(null);
//     const [categories, setCategories] = useState([]);
//     const [loadingCategories, setLoadingCategories] = useState(false);

//     // Step 2: Item (tour / trekking / activity) filtered by category
//     const [itemId, setItemId] = useState(null);
//     const [items, setItems] = useState([]);
//     const [loadingItems, setLoadingItems] = useState(false);

//     // The resolved category type (derived from category name)
//     const [categoryType, setCategoryType] = useState(""); // "tour" | "trekking" | "activity" | ""

//     // Multiple Q&A pairs
//     const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);

//     // Fetch categories once on mount
//     useEffect(() => {
//         setLoadingCategories(true);
//         axios
//             .get(route("ourcategories.index"))
//             .then((res) => {
//                 const data = res.data?.data ?? res.data;
//                 setCategories(Array.isArray(data) ? data : []);
//             })
//             .catch(console.error)
//             .finally(() => setLoadingCategories(false));
//     }, []);

//     // When category changes → determine type → fetch matching items
//     useEffect(() => {
//         setItemId(null);
//         setItems([]);
//         setCategoryType("");

//         if (!categoryId) return;

//         const selected = categories.find((c) => String(c.id) === String(categoryId));
//         if (!selected) return;

//         // Derive type from category name (case-insensitive)
//         const nameLower = selected.name.toLowerCase();
//         let type = "";
//         if (nameLower.includes("tour")) type = "tour";
//         else if (nameLower.includes("trek")) type = "trekking";
//         else if (nameLower.includes("activ")) type = "activity";

//         setCategoryType(type);

//         if (!type) return;

//         // Fetch items of this type, filtered by category_id on the backend
//         setLoadingItems(true);
//         const routeMap = {
//             tour: "ourtours.index",
//             trekking: "ourtrekkings.index",
//             activity: "ouractivities.index",
//         };

//         axios
//             .get(route(routeMap[type]))
//             .then((res) => {
//                 const data = res.data?.data ?? res.data;
//                 const all = Array.isArray(data) ? data : [];
//                 // Filter by category_id if the items have that field
//                 const filtered = all.filter(
//                     (item) =>
//                         !item.category_id || String(item.category_id) === String(categoryId),
//                 );
//                 setItems(filtered.length > 0 ? filtered : all);
//             })
//             .catch(console.error)
//             .finally(() => setLoadingItems(false));
//     }, [categoryId, categories]);

//     // Populate when editing
//     useEffect(() => {
//         if (editingFaq) {
//             setCategoryId(editingFaq.category_id ? String(editingFaq.category_id) : null);
//             setQaList([
//                 {
//                     question: editingFaq.question ?? "",
//                     answer: editingFaq.answer ?? "",
//                 },
//             ]);

//             // item id from whichever association exists
//             if (editingFaq.tour_id) setItemId(String(editingFaq.tour_id));
//             else if (editingFaq.trekking_id) setItemId(String(editingFaq.trekking_id));
//             else if (editingFaq.activity_id) setItemId(String(editingFaq.activity_id));
//             else setItemId(null);

//             setShowForm(true);
//         } else {
//             resetForm();
//         }
//     }, [editingFaq]);

//     const resetForm = () => {
//         setCategoryId(null);
//         setItemId(null);
//         setItems([]);
//         setCategoryType("");
//         setQaList([{ ...EMPTY_QA }]);
//     };

//     // Q&A handlers
//     const handleQaChange = (index, field, value) => {
//         setQaList((prev) =>
//             prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
//         );
//     };
//     const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
//     const removeQa = (index) =>
//         setQaList((prev) => prev.filter((_, i) => i !== index));

//     // Build shared payload
//     const buildBasePayload = () => {
//         const payload = {};
//         if (categoryId) payload.category_id = categoryId;
//         if (categoryType === "tour" && itemId) payload.tour_id = itemId;
//         if (categoryType === "trekking" && itemId) payload.trekking_id = itemId;
//         if (categoryType === "activity" && itemId) payload.activity_id = itemId;
//         return payload;
//     };

//     const handleCreate = async (entries) => {
//         const base = buildBasePayload();
//         await Promise.all(
//             entries.map((qa) => {
//                 const formData = new FormData();
//                 Object.entries({ ...base, ...qa }).forEach(([k, v]) =>
//                     formData.append(k, v)
//                 );
//                 return axios.post(route("ourfaqs.store"), formData, {
//                     headers: { "Content-Type": "multipart/form-data" },
//                 });
//             })
//         );
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validQa = qaList.filter(
//             (qa) => qa.question.trim() && qa.answer.trim()
//         );
//         if (validQa.length === 0) return;

//         try {
//             setSubmitting(true);
//             if (editingFaq) {
//                 const formData = new FormData();
//                 Object.entries({
//                     ...buildBasePayload(),
//                     ...validQa[0],
//                 }).forEach(([k, v]) => formData.append(k, v));
//                 formData.append("_method", "PUT");
//                 await handleUpdate(formData, editingFaq.id);
//             } else {
//                 await handleCreate(validQa);
//             }
//             resetForm();
//             setShowForm(false);
//             setEditingFaq(null);
//         } catch (err) {
//             console.log("Status:", err.response?.status);
//             console.log("Error data:", err.response?.data);
//             console.log("Validation errors:", err.response?.data?.errors);
//             console.log("Message:", err.response?.data?.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingFaq(null);
//         resetForm();
//     };

//     const isEditing = Boolean(editingFaq);
//     const validCount = qaList.filter((q) => q.question.trim()).length;

//     // Format options for react-select
//     const categoryOptions = categories.map((cat) => ({
//         value: String(cat.id),
//         label: cat.name ?? cat.title,
//     }));

//     const itemOptions = items.map((item) => ({
//         value: String(item.id),
//         label: item.name ?? item.title,
//     }));

//     const selectedCategoryOption = categoryOptions.find(
//         (opt) => opt.value === categoryId
//     );
//     const selectedItemOption = itemOptions.find((opt) => opt.value === itemId);

//     if (!showForm) return null;

//     return (
//         <>
//             <style>
//                 {`
//                 .quill-faq-answer .ql-container {
//                     min-height: 120px;
//                     max-height: 250px;
//                     overflow-y: auto;
//                     font-size: 14px;
//                     border-bottom-left-radius: 8px;
//                     border-bottom-right-radius: 8px;
//                 }

//                 .quill-faq-answer .ql-editor {
//                     min-height: 120px;
//                 }

//                 .quill-faq-answer .ql-toolbar.ql-snow {
//                     border-top-left-radius: 8px;
//                     border-top-right-radius: 8px;
//                     border-color: #e5e7eb;
//                 }

//                 .quill-faq-answer .ql-container.ql-snow {
//                     border-color: #e5e7eb;
//                 }

//                 .quill-faq-answer .ql-toolbar.ql-snow + .ql-container.ql-snow {
//                     border-top: none;
//                 }
//                 `}
//             </style>

//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[92vh]">
//                     {/* Header */}
//                     <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 {isEditing ? "Edit FAQ" : "Add New FAQ"}
//                             </h2>
//                             {!isEditing && qaList.length > 1 && (
//                                 <p className="text-xs text-gray-400 mt-0.5">
//                                     {qaList.length} Q&amp;A pairs — all will share
//                                     the same association
//                                 </p>
//                             )}
//                         </div>
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit}
//                         className="flex flex-col flex-1 overflow-hidden"
//                     >
//                         <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
//                             {/* Category and Item in same row - flex layout */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Step 1: Category - React Select */}
//                                 <div className="space-y-1.5">
//                                     <label className="block text-sm font-semibold text-gray-700">
//                                         Category <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <Select
//                                         options={categoryOptions}
//                                         value={selectedCategoryOption}
//                                         onChange={(option) =>
//                                             setCategoryId(option?.value || null)
//                                         }
//                                         placeholder={
//                                             loadingCategories ? "Loading..." : "Select a category"
//                                         }
//                                         isDisabled={loadingCategories}
//                                         isLoading={loadingCategories}
//                                         styles={customSelectStyles}
//                                         className="react-select-container"
//                                         classNamePrefix="react-select"
//                                         isClearable
//                                     />
//                                 </div>

//                                 {/* Step 2: Specific item — appears after category is chosen */}
//                                 {categoryId && (
//                                     <div className="space-y-1.5">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             {categoryType
//                                                 ? `Select ${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)}`
//                                                 : "Select Item"}
//                                         </label>
//                                         <Select
//                                             options={itemOptions}
//                                             value={selectedItemOption}
//                                             onChange={(option) =>
//                                                 setItemId(option?.value || null)
//                                             }
//                                             placeholder={
//                                                 loadingItems
//                                                     ? "Loading..."
//                                                     : categoryType
//                                                     ? `Select a ${categoryType}`
//                                                     : "Select an item"
//                                             }
//                                             isDisabled={!categoryType || loadingItems}
//                                             isLoading={loadingItems}
//                                             styles={customSelectStyles}
//                                             className="react-select-container"
//                                             classNamePrefix="react-select"
//                                             isClearable
//                                         />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Warning if category name doesn't map to a known type */}
//                             {categoryId && !loadingItems && !categoryType && (
//                                 <p className="text-xs text-amber-500 flex items-center gap-1.5">
//                                     <span>⚠</span>
//                                     Category name doesn't match Tour, Trekking, or
//                                     Activity — only category will be saved.
//                                 </p>
//                             )}

//                             {/* Q&A block */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                         Questions &amp; Answers
//                                     </p>
//                                     {!isEditing && (
//                                         <button
//                                             type="button"
//                                             onClick={addQa}
//                                             className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
//                                         >
//                                             <Plus size={13} />
//                                             Add another
//                                         </button>
//                                     )}
//                                 </div>

//                                 {qaList.map((qa, index) => (
//                                     <div
//                                         key={index}
//                                         className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
//                                     >
//                                         {!isEditing && qaList.length > 1 && (
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeQa(index)}
//                                                 className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                                                 title="Remove"
//                                             >
//                                                 <Trash2 size={14} />
//                                             </button>
//                                         )}

//                                         {qaList.length > 1 && (
//                                             <p className="text-xs font-semibold text-gray-400">
//                                                 FAQ #{index + 1}
//                                             </p>
//                                         )}

//                                         <div className="space-y-1.5">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Question{" "}
//                                                 <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={qa.question}
//                                                 onChange={(e) =>
//                                                     handleQaChange(
//                                                         index,
//                                                         "question",
//                                                         e.target.value
//                                                     )
//                                                 }
//                                                 required
//                                                 placeholder="e.g. What is included in the package?"
//                                                 className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
//                                             />
//                                         </div>

//                                         <div className="space-y-1.5">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Answer{" "}
//                                                 <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="quill-faq-answer">
//                                                 <ReactQuill
//                                                     theme="snow"
//                                                     value={qa.answer}
//                                                     onChange={(value) =>
//                                                         handleQaChange(
//                                                             index,
//                                                             "answer",
//                                                             value
//                                                         )
//                                                     }
//                                                     modules={quillModules}
//                                                     formats={quillFormats}
//                                                     placeholder="Write a clear, helpful answer..."
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}

//                                 {!isEditing && (
//                                     <button
//                                         type="button"
//                                         onClick={addQa}
//                                         className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
//                                     >
//                                         <Plus size={15} />
//                                         Add another Q&amp;A
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Footer */}
//                         <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[120px] justify-center"
//                             >
//                                 {submitting && (
//                                     <Loader2 size={15} className="animate-spin" />
//                                 )}
//                                 {submitting
//                                     ? isEditing
//                                         ? "Updating..."
//                                         : "Saving..."
//                                     : isEditing
//                                     ? "Update FAQ"
//                                     : validCount > 1
//                                     ? `Save ${validCount} FAQs`
//                                     : "Save FAQ"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddFAQForm;