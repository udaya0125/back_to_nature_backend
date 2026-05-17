import AddSubCategoryForm from "@/AddComponents/AddSubCategoryForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import EditSubCategoryForm from "@/EditComponents/EditSubCategoryForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";

const SubCategory = () => {
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allCategory, setAllCategory] = useState([]);

    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(
                    route("oursubcategories.index")
                );
                setAllSubCategories(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("categorywithsubcategory.indexWithSubCategory"));
                setAllCategory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching category:", error);
                setAllCategory([]);
            }
        };

        fetchSubCategory();
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subcategory?"))
            return;
        try {
            await axios.delete(
                route("oursubcategories.destroy", { id: id })
            );
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("oursubcategories.update", { id }),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating subcategory", error);
            throw error;
        }
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "S.No.",
                accessor: "index",
                Cell: ({ row }) => <span>{row.index + 1}</span>,
                width: 50,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ value }) => (
                    <span className="text-gray-500">
                        {value?.name || "—"}
                    </span>
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
                            className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        [allSubCategories]
    );

    // Prepare data for the table
    const tableData = useMemo(() => {
        return allSubCategories.map((subCat, index) => ({
            ...subCat,
            index: index,
        }));
    }, [allSubCategories]);

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        SubCategory Management
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingSubCategory(null);
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* SubCategories Table using MyTable */}
            {/* {allSubCategories.length === 0 ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="px-6 py-8 text-center text-gray-400">
                        No subcategories found.
                    </div>
                </div>
            ) : (
                <MyTable columns={columns} data={tableData} />
            )} */}
            <MyTable columns={columns} data={tableData} />

            <AddSubCategoryForm
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                showForm={showAddForm}
                allCategory={allCategory}
            />

            <EditSubCategoryForm
                editingSubCategory={editingSubCategory}
                setEditingSubCategory={setEditingSubCategory}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                showForm={showEditForm}
                handleUpdate={handleUpdate}
                allCategory={allCategory}
            />
        </AdminWrapper>
    );
};

export default SubCategory;
