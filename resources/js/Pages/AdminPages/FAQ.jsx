import AddFAQForm from "@/AddComponents/AddFAQForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import EditFAQForm from "@/EditComponents/EditFAQForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Pencil, Trash2, X, Edit } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";

const FAQ = () => {
    const [allFaq, setAllFaq] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch FAQs
    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const response = await axios.get(route("ourfaqs.index"));
                const data = response.data?.data ?? response.data;
                setAllFaq(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };
        fetchFaq();
    }, [reloadTrigger]);

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
        setDeletingId(id);
        try {
            await axios.delete(route("ourfaqs.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeletingId(null);
        }
    };

    // Edit
    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setShowEditForm(true);
    };

    // Update (called from edit form)
    const handleUpdate = async (formData, id) => {
        const response = await axios.post(
            route("ourfaqs.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Helper: resolve association label
    const getAssociation = (faq) => {
        if (faq.tour) return { label: "Tour", name: faq.tour.name ?? faq.tour.title };
        if (faq.trekking) return { label: "Trekking", name: faq.trekking.name ?? faq.trekking.title };
        if (faq.activity) return { label: "Activity", name: faq.activity.name ?? faq.activity.title };
        return null;
    };

    // Open modal with FAQ details
    const openModal = (faq) => {
        setSelectedFaq(faq);
    };

    // Close modal
    const closeModal = () => {
        setSelectedFaq(null);
    };

    // Define columns for MyTable
    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: "index",
                Cell: ({ row }) => <span className="text-gray-400 font-mono">{row.index + 1}</span>,
            },
            {
                Header: "Question",
                accessor: "question",
                Cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => openModal(row.original)}
                        className="text-left w-full group"
                    >
                        <span className="font-medium text-gray-800 group-hover:text-indigo-600 group-hover:underline transition-colors line-clamp-2 leading-snug">
                            {row.original.question}
                        </span>
                    </button>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ row }) => {
                    const category = row.original.category;
                    return category ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            {category.name}
                        </span>
                    ) : (
                        <span className="text-gray-300">—</span>
                    );
                },
            },
            {
                Header: "Associated With",
                accessor: "association",
                Cell: ({ row }) => {
                    const association = getAssociation(row.original);
                    return association ? (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                                {association.label}
                            </span>
                            <span className="text-gray-700 font-medium text-sm leading-tight">
                                {association.name}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-300">—</span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(row.original.id)}
                            disabled={deletingId === row.original.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ),
            },
        ],
        [deletingId]
    );

    // Prepare data for the table
    const tableData = useMemo(() => allFaq, [allFaq]);

    return (
        <AdminWrapper>
            {/* Page header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        FAQ Management
                    </h1>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* FAQ Table using MyTable component */}
            {/* {allFaq.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg font-medium">No FAQs yet</p>
                    <p className="text-sm mt-1">Click "Create" to add your first FAQ.</p>
                </div>
            ) : (
                <MyTable columns={columns} data={tableData} />
            )} */}

             <MyTable columns={columns} data={tableData} />

            {/* Answer Modal/Popup */}
            {selectedFaq && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                            aria-hidden="true"
                            onClick={closeModal}
                        ></div>

                        {/* Center modal */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            {/* Header */}
                            <div className="bg-white px-6 pt-5 pb-4 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-lg font-semibold text-gray-900 break-words" id="modal-title">
                                            {selectedFaq.question}
                                        </h3>
                                        {/* Category badge */}
                                        {selectedFaq.category && (
                                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                {selectedFaq.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body - Answer */}
                            <div className="bg-white px-6 py-5">
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Answer
                                    </span>
                                </div>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedFaq.answer}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Form Modal */}
            <AddFAQForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            {/* Edit Form Modal */}
            <EditFAQForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingFaq={editingFaq}
                setEditingFaq={setEditingFaq}
                handleUpdate={handleUpdate}
                setReloadTrigger={setReloadTrigger}
            />
        </AdminWrapper>
    );
};

export default FAQ;



// import AddFAQForm from "@/AddComponents/AddFAQForm";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Plus, Pencil, Trash2, X } from "lucide-react";
// import React, { useEffect, useState, useMemo, useCallback } from "react";

// const FAQ = () => {
//     const [allFaq, setAllFaq] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingFaq, setEditingFaq] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedFaq, setSelectedFaq] = useState(null);
//     const [deletingId, setDeletingId] = useState(null);

//     // Fetch FAQs
//     useEffect(() => {
//         const fetchFaq = async () => {
//             try {
//                 const response = await axios.get(route("ourfaqs.index"));
//                 const data = response.data?.data ?? response.data;
//                 setAllFaq(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };
//         fetchFaq();
//     }, [reloadTrigger]);

//     // Delete
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
//         setDeletingId(id);
//         try {
//             await axios.delete(route("ourfaqs.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     // Edit
//     const handleEdit = (faq) => {
//         setEditingFaq(faq);
//     };

//     // Update (called from form)
//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourfaqs.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     // Helper: resolve association label
//     const getAssociation = (faq) => {
//         if (faq.tour) return { label: "Tour", name: faq.tour.name ?? faq.tour.title };
//         if (faq.trekking) return { label: "Trekking", name: faq.trekking.name ?? faq.trekking.title };
//         if (faq.activity) return { label: "Activity", name: faq.activity.name ?? faq.activity.title };
//         return null;
//     };

//     // Open modal with FAQ details
//     const openModal = (faq) => {
//         setSelectedFaq(faq);
//     };

//     // Close modal
//     const closeModal = () => {
//         setSelectedFaq(null);
//     };

//     // Define columns for MyTable
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "#",
//                 accessor: "index",
//                 Cell: ({ row }) => <span className="text-gray-400 font-mono">{row.index + 1}</span>,
//             },
//             {
//                 Header: "Question",
//                 accessor: "question",
//                 Cell: ({ row }) => (
//                     <button
//                         type="button"
//                         onClick={() => openModal(row.original)}
//                         className="text-left w-full group"
//                     >
//                         <span className="font-medium text-gray-800 group-hover:text-indigo-600 group-hover:underline transition-colors line-clamp-2 leading-snug">
//                             {row.original.question}
//                         </span>
//                     </button>
//                 ),
//             },
//             {
//                 Header: "Category",
//                 accessor: "category",
//                 Cell: ({ row }) => {
//                     const category = row.original.category;
//                     return category ? (
//                         <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
//                             {category.name}
//                         </span>
//                     ) : (
//                         <span className="text-gray-300">—</span>
//                     );
//                 },
//             },
//             {
//                 Header: "Associated With",
//                 accessor: "association",
//                 Cell: ({ row }) => {
//                     const association = getAssociation(row.original);
//                     return association ? (
//                         <div className="flex flex-col gap-0.5">
//                             <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
//                                 {association.label}
//                             </span>
//                             <span className="text-gray-700 font-medium text-sm leading-tight">
//                                 {association.name}
//                             </span>
//                         </div>
//                     ) : (
//                         <span className="text-gray-300">—</span>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             type="button"
//                             onClick={() => handleEdit(row.original)}
//                             className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                             title="Edit"
//                         >
//                             <Pencil size={15} />
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => handleDelete(row.original.id)}
//                             disabled={deletingId === row.original.id}
//                             className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
//                             title="Delete"
//                         >
//                             <Trash2 size={15} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [deletingId]
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => allFaq, [allFaq]);

//     return (
//         <AdminWrapper>
//             {/* Page header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         FAQ Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allFaq.length} FAQ{allFaq.length !== 1 ? "s" : ""} total
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* FAQ Table using MyTable component */}
//             {allFaq.length === 0 ? (
//                 <div className="text-center py-20 text-gray-400">
//                     <p className="text-lg font-medium">No FAQs yet</p>
//                     <p className="text-sm mt-1">Click "Create" to add your first FAQ.</p>
//                 </div>
//             ) : (
//                 <MyTable columns={columns} data={tableData} />
//             )}

//             {/* Answer Modal/Popup */}
//             {selectedFaq && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//                     <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//                         {/* Background overlay */}
//                         <div 
//                             className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
//                             aria-hidden="true"
//                             onClick={closeModal}
//                         ></div>

//                         {/* Center modal */}
//                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             {/* Header */}
//                             <div className="bg-white px-6 pt-5 pb-4 border-b border-gray-200">
//                                 <div className="flex justify-between items-start">
//                                     <div className="flex-1 pr-4">
//                                         <h3 className="text-lg font-semibold text-gray-900 break-words" id="modal-title">
//                                             {selectedFaq.question}
//                                         </h3>
//                                         {/* Category badge */}
//                                         {selectedFaq.category && (
//                                             <span className="inline-flex items-center mt-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
//                                                 {selectedFaq.category.name}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={closeModal}
//                                         className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
//                                     >
//                                         <X size={20} />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Body - Answer */}
//                             <div className="bg-white px-6 py-5">
//                                 <div className="mb-2">
//                                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                                         Answer
//                                     </span>
//                                 </div>
//                                 <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                                     {selectedFaq.answer}
//                                 </div>
//                             </div>

//                             {/* Footer */}
//                             <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Form Modal */}
//             <AddFAQForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingFaq={editingFaq}
//                 setEditingFaq={setEditingFaq}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default FAQ;