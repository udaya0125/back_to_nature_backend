import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import AddActivitiesForm from "@/AddComponents/AddActivitiesForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import EditActivitiesForm from "@/EditComponents/EditActivitiesForm";

const Activities = () => {
    const [allActivities, setAllActivities] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(route("ouractivities.index"));
                setAllActivities(response.data.data || []);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        const fetchCategory = async () => {
            try {
                const response = await axios.get(
                    route("categorywithsubcategory.indexWithSubCategory")
                );
                setAllCategory(response.data.data || []);
                // Extract all subcategories from categories
                const subCategories = [];
                response.data.data.forEach(category => {
                    if (category.sub_categories && category.sub_categories.length > 0) {
                        subCategories.push(...category.sub_categories);
                    }
                });
                setAllSubCategory(subCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setAllCategory([]);
                setAllSubCategory([]);
            }
        };

        fetchActivities();
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            await axios.delete(route("ouractivities.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ouractivities.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Helper function to get category name by ID
    const getCategoryName = (categoryId) => {
        const category = allCategory.find(cat => cat.id === categoryId);
        return category ? category.name : "Unknown Category";
    };

    // Helper function to get subcategory name by ID
    const getSubCategoryName = (subCategoryId) => {
        if (!subCategoryId) return "—";
        const subCategory = allSubCategory.find(sub => sub.id === subCategoryId);
        return subCategory ? subCategory.name : "Unknown Subcategory";
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
             {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Category",
                accessor: "category_id",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{getCategoryName(value)}</span>
                ),
            },
            {
                Header: "Sub Category",
                accessor: "sub_category_id",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{getSubCategoryName(value)}</span>
                ),
            },
            {
                Header: "Images",
                accessor: "images",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value?.length ?? 0}</span>
                ),
            },
            {
                Header: "Itineraries",
                accessor: "itineraries",
                Cell: ({ value }) => (
                    <span className="text-gray-600">{value?.length ?? 0} days</span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex  gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                            Delete
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        [allCategory, allSubCategory] // Re-create when categories or subcategories change
    );

    // Prepare data for the table
    const tableData = useMemo(() => {
        return allActivities.map((activity) => ({
            ...activity,
        }));
    }, [allActivities]);

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Activity Management
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingActivity(null);
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Activities Table using MyTable */}
            {/* {allActivities.length === 0 ? (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="px-6 py-8 text-center text-gray-400">
                        No activities found.
                    </div>
                </div>
            ) : (
                <MyTable columns={columns} data={tableData} />
            )} */}
             <MyTable columns={columns} data={tableData} />

            <AddActivitiesForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                allCategory={allCategory}
            />

            <EditActivitiesForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                editingActivity={editingActivity}
                setEditingActivity={setEditingActivity}
                handleUpdate={handleUpdate}
                allCategory={allCategory}
            />
        </AdminWrapper>
    );
};

export default Activities;
