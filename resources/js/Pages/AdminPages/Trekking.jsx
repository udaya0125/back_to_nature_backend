// import AddTrekkingForm from '@/AddComponents/AddTrekkingForm';
// import AdminWrapper from '@/AdminComponents/AdminWrapper'
// import React from 'react'

// const Trekking = () => {
//     const [allTrekking, setAllTrekking] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTrekking, setEditingTrekking] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the trekking data
//     useEffect(() => {
//         const fetchTrekking = async () => {
//             try {
//                 const response = await axios.get(route("ourtrekking.index"));
//                 setAllTrekking(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//          const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("categorywithsubcategory.indexWithSubCategory")
//                 );
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//                 setAllCategory([]);
//             }
//         };
//         fetchCategory();

//         fetchTrekking();
//     }, [reloadTrigger]);

//     // For delete the trekking
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourtrekking.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handle edit
//     const handleEdit = (trekking) => {
//         setEditingTrekking(trekking);
//     };

//     // Handle update after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtrekking.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating trekking", error);
//             throw error;
//         }
//     };
//   return (
//     <>
//     <AdminWrapper>
//         <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Trekking Management
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 <AddTrekkingForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingTrekking={editingTrekking}
//                     setEditingTrekking={setEditingTrekking}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//     </AdminWrapper>    
//     </>
//   )
// }

// export default Trekking


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Mountain, ChevronDown, ChevronUp, ImageOff } from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddTrekkingForm from "@/AddComponents/AddTrekkingForm";
import EditTrekkingForm from "@/EditComponents/EditTrekkingForm";

const Trekking = () => {
    const [allTrekking, setAllTrekking] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTrekking, setEditingTrekking] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Fetch trekking + categories on mount / reload
    useEffect(() => {
        const fetchTrekking = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourtrekkings.index"));
                setAllTrekking(response.data.data || response.data || []);
            } catch (error) {
                console.error("Error fetching trekking:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory")
                );
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setAllCategory([]);
            }
        };

        fetchTrekking();
        fetchCategory();
    }, [reloadTrigger]);

    // Delete handler
    const handleDelete = async (id) => {
        try {
            await axios.delete(route("ourtrekkings.destroy", { id }));
            setDeleteConfirm(null);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting trekking:", error);
        }
    };

    // Edit handler — opens edit form with existing data pre-filled
    const handleEdit = (trekking) => {
        setEditingTrekking(trekking);
        setShowEditForm(true);
    };

    // Update handler passed down to the edit form
    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourtrekkings.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Toggle expanded itinerary row
    const toggleExpand = (id) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    return (
        <AdminWrapper>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Mountain size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                Trekking Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {allTrekking.length} trek{allTrekking.length !== 1 ? "s" : ""} listed
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 font-medium"
                    >
                        <Plus size={18} />
                        <span>Add Trekking</span>
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-sm">Loading treks…</span>
                        </div>
                    ) : allTrekking.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                            <Mountain size={40} className="text-gray-300" />
                            <p className="font-medium text-gray-500">No trekking records found</p>
                            <p className="text-sm">Click "Add Trekking" to create your first entry.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 w-10">#</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 w-16">Image</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600">Title</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Price</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Days</th>
                                        <th className="px-5 py-3.5 font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {allTrekking.map((trek, index) => (
                                        <React.Fragment key={trek.id}>
                                            <tr className="hover:bg-gray-50/60 transition-colors">
                                                <td className="px-5 py-4 text-gray-400 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {trek.images && trek.images.length > 0 ? (
                                                        <img
                                                            src={`/storage/${trek.images[0].image}`}
                                                            alt={trek.title}
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <ImageOff size={16} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-gray-800">
                                                        {trek.title}
                                                    </div>
                                                    {trek.images && trek.images.length > 1 && (
                                                        <span className="text-xs text-gray-400">
                                                            +{trek.images.length - 1} more photo{trek.images.length > 2 ? "s" : ""}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell text-gray-600">
                                                    {trek.category?.name || (
                                                        <span className="text-gray-300 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 hidden lg:table-cell text-gray-600">
                                                    {trek.price ? (
                                                        <span className="font-medium text-green-600">
                                                            ${Number(trek.price).toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 hidden lg:table-cell">
                                                    {trek.itineraries && trek.itineraries.length > 0 ? (
                                                        <button
                                                            onClick={() => toggleExpand(trek.id)}
                                                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                                                        >
                                                            {trek.itineraries.length} day{trek.itineraries.length > 1 ? "s" : ""}
                                                            {expandedRow === trek.id ? (
                                                                <ChevronUp size={13} />
                                                            ) : (
                                                                <ChevronDown size={13} />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-300 italic text-xs">No itinerary</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(trek)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(trek.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Itinerary Row */}
                                            {expandedRow === trek.id && trek.itineraries?.length > 0 && (
                                                <tr>
                                                    <td colSpan={7} className="bg-indigo-50/50 px-8 py-4 border-t border-indigo-100">
                                                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">
                                                            Itinerary
                                                        </p>
                                                        <div className="space-y-2">
                                                            {trek.itineraries.map((item) => (
                                                                <div key={item.id} className="flex gap-4 text-sm">
                                                                    <span className="font-semibold text-indigo-600 min-w-[60px]">
                                                                        Day {item.day}
                                                                    </span>
                                                                    <span className="font-medium text-gray-700">
                                                                        {item.title}
                                                                    </span>
                                                                    <span className="text-gray-500 hidden lg:block">
                                                                        — {item.description}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">
                                Are you sure you want to delete this trekking record? This will also remove all associated images and itineraries. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium text-sm"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Form */}
                <AddTrekkingForm
                    showForm={showAddForm}
                    setShowForm={setShowAddForm}
                    setReloadTrigger={setReloadTrigger}
                    allCategory={allCategory}
                />

                {/* Edit Form */}
                <EditTrekkingForm
                    showForm={showEditForm}
                    setShowForm={setShowEditForm}
                    setReloadTrigger={setReloadTrigger}
                    editingTrekking={editingTrekking}
                    setEditingTrekking={setEditingTrekking}
                    handleUpdate={handleUpdate}
                    allCategory={allCategory}
                />
            </div>
        </AdminWrapper>
    );
};

export default Trekking;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Mountain, ChevronDown, ChevronUp, ImageOff } from "lucide-react";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import AddTrekkingForm from "@/AddComponents/AddTrekkingForm";

// const Trekking = () => {
//     const [allTrekking, setAllTrekking] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTrekking, setEditingTrekking] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [expandedRow, setExpandedRow] = useState(null);
//     const [deleteConfirm, setDeleteConfirm] = useState(null); // id of trekking to confirm delete

//     // Fetch trekking + categories on mount / reload
//     useEffect(() => {
//         const fetchTrekking = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourtrekkings.index"));
//                 // Backend returns { success, data }
//                 setAllTrekking(response.data.data || response.data || []);
//             } catch (error) {
//                 console.error("Error fetching trekking:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("categorywithsubcategory.indexWithSubCategory")
//                 );
//                 setAllCategory(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//                 setAllCategory([]);
//             }
//         };

//         fetchTrekking();
//         fetchCategory();
//     }, [reloadTrigger]);

//     // Delete handler
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(route("ourtrekkings.destroy", { id }));
//             setDeleteConfirm(null);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Error deleting trekking:", error);
//         }
//     };

//     // Edit handler — opens form with existing data pre-filled
//     const handleEdit = (trekking) => {
//         setEditingTrekking(trekking);
//         setShowForm(true);
//     };

//     // Update handler passed down to the form
//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourtrekkings.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     // Toggle expanded itinerary row
//     const toggleExpand = (id) => {
//         setExpandedRow((prev) => (prev === id ? null : id));
//     };

//     return (
//         <AdminWrapper>
//             <div className="min-h-screen bg-gray-50 p-6">
//                 {/* Header */}
//                 <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-indigo-100 rounded-lg">
//                             <Mountain size={24} className="text-indigo-600" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                                 Trekking Management
//                             </h1>
//                             <p className="text-sm text-gray-500 mt-0.5">
//                                 {allTrekking.length} trek{allTrekking.length !== 1 ? "s" : ""} listed
//                             </p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingTrekking(null);
//                             setShowForm(true);
//                         }}
//                         className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 font-medium"
//                     >
//                         <Plus size={18} />
//                         <span>Add Trekking</span>
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                     {loading ? (
//                         <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
//                             <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//                             <span className="text-sm">Loading treks…</span>
//                         </div>
//                     ) : allTrekking.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
//                             <Mountain size={40} className="text-gray-300" />
//                             <p className="font-medium text-gray-500">No trekking records found</p>
//                             <p className="text-sm">Click "Add Trekking" to create your first entry.</p>
//                         </div>
//                     ) : (
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm text-left">
//                                 <thead className="bg-gray-50 border-b border-gray-100">
//                                     <tr>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 w-10">#</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 w-16">Image</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600">Title</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Price</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Days</th>
//                                         <th className="px-5 py-3.5 font-semibold text-gray-600 text-right">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {allTrekking.map((trek, index) => (
//                                         <React.Fragment key={trek.id}>
//                                             <tr className="hover:bg-gray-50/60 transition-colors">
//                                                 {/* Index */}
//                                                 <td className="px-5 py-4 text-gray-400 font-medium">
//                                                     {index + 1}
//                                                 </td>

//                                                 {/* Thumbnail */}
//                                                 <td className="px-5 py-4">
//                                                     {trek.images && trek.images.length > 0 ? (
//                                                         <img
//                                                             src={`/storage/${trek.images[0].image}`}
//                                                             alt={trek.title}
//                                                             className="w-12 h-12 object-cover rounded-lg border border-gray-100"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
//                                                             <ImageOff size={16} className="text-gray-400" />
//                                                         </div>
//                                                     )}
//                                                 </td>

//                                                 {/* Title */}
//                                                 <td className="px-5 py-4">
//                                                     <div className="font-semibold text-gray-800">
//                                                         {trek.title}
//                                                     </div>
//                                                     {trek.images && trek.images.length > 1 && (
//                                                         <span className="text-xs text-gray-400">
//                                                             +{trek.images.length - 1} more photo{trek.images.length > 2 ? "s" : ""}
//                                                         </span>
//                                                     )}
//                                                 </td>

//                                                 {/* Category */}
//                                                 <td className="px-5 py-4 hidden md:table-cell text-gray-600">
//                                                     {trek.category?.name || (
//                                                         <span className="text-gray-300 italic">—</span>
//                                                     )}
//                                                 </td>

//                                                 {/* Price */}
//                                                 <td className="px-5 py-4 hidden lg:table-cell text-gray-600">
//                                                     {trek.price ? (
//                                                         <span className="font-medium text-green-600">
//                                                             ${Number(trek.price).toLocaleString()}
//                                                         </span>
//                                                     ) : (
//                                                         <span className="text-gray-300 italic">—</span>
//                                                     )}
//                                                 </td>

//                                                 {/* Itinerary count */}
//                                                 <td className="px-5 py-4 hidden lg:table-cell">
//                                                     {trek.itineraries && trek.itineraries.length > 0 ? (
//                                                         <button
//                                                             onClick={() => toggleExpand(trek.id)}
//                                                             className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
//                                                         >
//                                                             {trek.itineraries.length} day{trek.itineraries.length > 1 ? "s" : ""}
//                                                             {expandedRow === trek.id ? (
//                                                                 <ChevronUp size={13} />
//                                                             ) : (
//                                                                 <ChevronDown size={13} />
//                                                             )}
//                                                         </button>
//                                                     ) : (
//                                                         <span className="text-gray-300 italic text-xs">No itinerary</span>
//                                                     )}
//                                                 </td>

//                                                 {/* Actions */}
//                                                 <td className="px-5 py-4">
//                                                     <div className="flex items-center justify-end gap-2">
//                                                         <button
//                                                             onClick={() => handleEdit(trek)}
//                                                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                                                             title="Edit"
//                                                         >
//                                                             <Pencil size={15} />
//                                                         </button>
//                                                         <button
//                                                             onClick={() => setDeleteConfirm(trek.id)}
//                                                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                                                             title="Delete"
//                                                         >
//                                                             <Trash2 size={15} />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>

//                                             {/* Expanded Itinerary Row */}
//                                             {expandedRow === trek.id && trek.itineraries?.length > 0 && (
//                                                 <tr>
//                                                     <td colSpan={7} className="bg-indigo-50/50 px-8 py-4 border-t border-indigo-100">
//                                                         <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">
//                                                             Itinerary
//                                                         </p>
//                                                         <div className="space-y-2">
//                                                             {trek.itineraries.map((item) => (
//                                                                 <div key={item.id} className="flex gap-4 text-sm">
//                                                                     <span className="font-semibold text-indigo-600 min-w-[60px]">
//                                                                         Day {item.day}
//                                                                     </span>
//                                                                     <span className="font-medium text-gray-700">
//                                                                         {item.title}
//                                                                     </span>
//                                                                     <span className="text-gray-500 hidden lg:block">
//                                                                         — {item.description}
//                                                                     </span>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>

//                 {/* Delete Confirmation Modal */}
//                 {deleteConfirm && (
//                     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
//                             <div className="flex items-center gap-3 mb-3">
//                                 <div className="p-2 bg-red-100 rounded-full">
//                                     <Trash2 size={20} className="text-red-500" />
//                                 </div>
//                                 <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
//                             </div>
//                             <p className="text-gray-500 text-sm mb-6">
//                                 Are you sure you want to delete this trekking record? This will also remove all associated images and itineraries. This action cannot be undone.
//                             </p>
//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={() => setDeleteConfirm(null)}
//                                     className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(deleteConfirm)}
//                                     className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium text-sm"
//                                 >
//                                     Yes, Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Add / Edit Form */}
//                 <AddTrekkingForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingTrekking={editingTrekking}
//                     setEditingTrekking={setEditingTrekking}
//                     handleUpdate={handleUpdate}
//                     allCategory={allCategory}
//                 />
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Trekking;