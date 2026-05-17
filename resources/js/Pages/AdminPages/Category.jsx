// import AddCategoryForm from "@/AddComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 // Controller returns { success, data } so we need response.data.data
//                 setAllCategory(response.data.data);
//             } catch (error) {
//                 console.error("Fetching error:", error);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(route("ourcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error:", error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Update error:", error);
//             throw error;
//         }
//     };

//     // Define columns for the table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "S.No.",
//                 accessor: "index",
//                 Cell: ({ row }) => <span>{row.index + 1}</span>,
//                 width: 80,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => (
//                     <span className="font-medium text-gray-800">{value}</span>
//                 ),
//             },
//             {
//                 Header: "Created At",
//                 accessor: "created_at",
//                 Cell: ({ value }) => (
//                     <span className="text-gray-500 text-sm">
//                         {value ? new Date(value).toLocaleDateString() : "N/A"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                             title="Edit"
//                         >
//                             <Pencil size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//                 disableSortBy: true,
//             },
//         ],
//         [] // No dependencies needed as handleEdit and handleDelete are stable
//     );

//     // Prepare data for the table
//     const tableData = useMemo(() => {
//         return allCategory.map((category, index) => ({
//             ...category,
//             index: index,
//         }));
//     }, [allCategory]);

//     return (
//         <AdminWrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Category Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingCategory(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Category Table using MyTable */}
//             {allCategory.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow overflow-hidden">
//                     <div className="px-6 py-8 text-center text-gray-400">
//                         No categories found.
//                     </div>
//                 </div>
//             ) : (
//                 <MyTable columns={columns} data={tableData} />
//             )}

//             <AddCategoryForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCategory={editingCategory}
//                 setEditingCategory={setEditingCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Category;

import AddCategoryForm from "@/AddComponents/AddCategoryForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import EditCategoryForm from "@/EditComponents/EditCategoryForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const Category = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.data);
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(route("ourcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowEditForm(true);
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "S.No.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
                width: 80,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-gray-500 text-sm">
                        {value ? new Date(value).toLocaleDateString() : "N/A"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        []
    );

    // Prepare data for the table
    const tableData = useMemo(() => {
        return allCategory.map((category, index) => ({
            ...category,
            index: index,
        }));
    }, [allCategory]);

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    Category Management
                </h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Category Table using MyTable */}
            {/* {allCategory.length === 0 ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="px-6 py-8 text-center text-gray-400">
                        No categories found.
                    </div>
                </div>
            ) : (
                <MyTable columns={columns} data={tableData} />
            )} */}
              <MyTable columns={columns} data={tableData} />

            <AddCategoryForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            <EditCategoryForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
            />
        </AdminWrapper>
    );
};

export default Category;


// import AddCategoryForm from "@/AddComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminComponents/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the category data
//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchCategory();
//     }, [reloadTrigger]);

//     // For delete the category
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourcategories.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (category) => {
//         setEditingCategory(category);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
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
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Category Management
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

//                 <AddCategoryForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingCategory={editingCategory}
//                     setEditingCategory={setEditingCategory}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default Category;
