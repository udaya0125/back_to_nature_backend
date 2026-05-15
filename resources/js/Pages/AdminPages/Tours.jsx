// import AddToursForm from "@/AddComponents/AddToursForm";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Tours = () => {
//     const [allTour, setAllTour] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTour, setEditingTour] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the tour data
//     useEffect(() => {
//         const fetchTour = async () => {
//             try {
//                 const response = await axios.get(route("ourtours.index"));
//                 setAllTour(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchTour();
//     }, [reloadTrigger]);

//     // For delete the tour
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourtours.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (tour) => {
//         setEditingTour(tour);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtours.update", { id }),
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
//             console.log("Error updating tour", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//                 <AdminWrapper>
//                     <div className="mb-8 flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                                 Tour Management
//                             </h1>
//                         </div>
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     <AddToursForm
//                         showForm={showForm}
//                         setShowForm={setShowForm}
//                         setReloadTrigger={setReloadTrigger}
//                         editingTour={editingTour}
//                         setEditingTour={setEditingTour}
//                         handleUpdate={handleUpdate}
//                     />
//                 </AdminWrapper>
//         </>
//     );
// };

// export default Tours;

// import AddToursForm from "@/AddComponents/AddToursForm";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Tours = () => {
//     const [allTour, setAllTour] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingTour, setEditingTour] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchTour = async () => {
//             try {
//                 const response = await axios.get(route("ourtours.index"));
//                 setAllTour(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching tours:", error);
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

//         fetchTour();
//         fetchCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this tour?")) return;
//         try {
//             await axios.delete(route("ourtours.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Error deleting tour:", error);
//         }
//     };

//     const handleEdit = (tour) => {
//         setEditingTour(tour);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourtours.update", { id }),
//             formData
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-6 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Tour Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allTour.length} tour{allTour.length !== 1 ? "s" : ""} total
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition text-sm font-medium"
//                 >
//                     <Plus size={16} />
//                     Create Tour
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-200 text-left">
//                                 <th className="px-4 py-3 font-semibold text-gray-600 w-12">#</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600 w-16">Image</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600">Title</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600 text-center">Days</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600 text-center">Images</th>
//                                 <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {allTour.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
//                                         No tours found. Click{" "}
//                                         <span className="font-medium text-indigo-500">
//                                             Create Tour
//                                         </span>{" "}
//                                         to add one.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 allTour.map((tour, index) => (
//                                     <tr
//                                         key={tour.id}
//                                         className="hover:bg-gray-50 transition-colors"
//                                     >
//                                         {/* Row number */}
//                                         <td className="px-4 py-3 text-gray-400 font-mono text-xs">
//                                             {index + 1}
//                                         </td>

//                                         {/* Thumbnail */}
//                                         <td className="px-4 py-3">
//                                             {tour.images?.[0] ? (
//                                                 <img
//                                                     src={`/storage/${tour.images[0].image}`}
//                                                     alt={tour.title}
//                                                     className="w-10 h-10 rounded-lg object-cover border border-gray-200"
//                                                 />
//                                             ) : (
//                                                 <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//                                                     <ImageOff size={14} className="text-gray-400" />
//                                                 </div>
//                                             )}
//                                         </td>

//                                         {/* Title + slug */}
//                                         <td className="px-4 py-3">
//                                             <p className="font-medium text-gray-800 leading-tight">
//                                                 {tour.title}
//                                             </p>
//                                         </td>

//                                         {/* Category badge */}
//                                         <td className="px-4 py-3">
//                                             {tour.category?.name ? (
//                                                 <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 whitespace-nowrap">
//                                                     {tour.category.name}
//                                                 </span>
//                                             ) : (
//                                                 <span className="text-gray-400 text-xs">—</span>
//                                             )}
//                                         </td>

//                                         {/* Days */}
//                                         <td className="px-4 py-3 text-center">
//                                             <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//                                                 {tour.itineraries?.length || 0}d
//                                             </span>
//                                         </td>

//                                         {/* Image count */}
//                                         <td className="px-4 py-3 text-center text-gray-500 text-xs">
//                                             {tour.images?.length || 0}
//                                         </td>

//                                         {/* Actions */}
//                                         <td className="px-4 py-3">
//                                             <div className="flex items-center justify-end gap-1">
//                                                 <button
//                                                     onClick={() => handleEdit(tour)}
//                                                     className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
//                                                     title="Edit"
//                                                 >
//                                                     <Pencil size={15} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(tour.id)}
//                                                     className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <Trash2 size={15} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <AddToursForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingTour={editingTour}
//                 setEditingTour={setEditingTour}
//                 handleUpdate={handleUpdate}
//                 allCategory={allCategory}
//             />
//         </AdminWrapper>
//     );
// };

// export default Tours;

import AddToursForm from "@/AddComponents/AddToursForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import EditToursForm from "@/EditComponents/EditToursForm";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import React, { useEffect, useState } from "react";

const Tours = () => {
    const [allTour, setAllTour] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await axios.get(route("ourtours.index"));
                setAllTour(response.data.data || []);
            } catch (error) {
                console.error("Error fetching tours:", error);
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

        fetchTour();
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this tour?")) return;
        try {
            await axios.delete(route("ourtours.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting tour:", error);
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourtours.update", { id }),
            formData
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Tour Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {allTour.length} tour{allTour.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    Create Tour
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-600 w-12">#</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-16">Image</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Title</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Days</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Images</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allTour.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                        No tours found. Click{" "}
                                        <span className="font-medium text-indigo-500">
                                            Create Tour
                                        </span>{" "}
                                        to add one.
                                    </td>
                                </tr>
                            ) : (
                                allTour.map((tour, index) => (
                                    <tr
                                        key={tour.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Row number */}
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                                            {index + 1}
                                        </td>

                                        {/* Thumbnail */}
                                        <td className="px-4 py-3">
                                            {tour.images?.[0] ? (
                                                <img
                                                    src={`/storage/${tour.images[0].image}`}
                                                    alt={tour.title}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <ImageOff size={14} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Title + slug */}
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800 leading-tight">
                                                {tour.title}
                                            </p>
                                        </td>

                                        {/* Category badge */}
                                        <td className="px-4 py-3">
                                            {tour.category?.name ? (
                                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 whitespace-nowrap">
                                                    {tour.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Days */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                                                {tour.itineraries?.length || 0}d
                                            </span>
                                        </td>

                                        {/* Image count */}
                                        <td className="px-4 py-3 text-center text-gray-500 text-xs">
                                            {tour.images?.length || 0}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(tour)}
                                                    className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tour.id)}
                                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddToursForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                allCategory={allCategory}
            />

            <EditToursForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                editingTour={editingTour}
                setEditingTour={setEditingTour}
                handleUpdate={handleUpdate}
                allCategory={allCategory}
            />
        </AdminWrapper>
    );
};

export default Tours;