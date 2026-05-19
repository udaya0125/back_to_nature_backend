import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Mountain, ImageOff, Edit } from "lucide-react";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import AddTrekkingForm from "@/AddComponents/AddTrekkingForm";
import EditTrekkingForm from "@/EditComponents/EditTrekkingForm";
import MyTable from "@/MyTable/MyTable";

const Trekking = () => {
    const [allTrekking, setAllTrekking] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTrekking, setEditingTrekking] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tableRefreshKey, setTableRefreshKey] = useState(0);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const fetchTrekking = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("ourtrekkings.index"));
            setAllTrekking(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error fetching trekking:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategory = useCallback(async () => {
        try {
            const response = await axios.get(
                route("categorywithsubcategory.indexWithSubCategory"),
            );
            setAllCategory(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setAllCategory([]);
        }
    }, []);

    // Fetch trekking + categories on mount / reload
    useEffect(() => {
        fetchTrekking();
        fetchCategory();
    }, [reloadTrigger, fetchTrekking, fetchCategory]);

    // Delete handler
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this trekking?")) return;
        try {
            await axios.delete(route("ourtrekkings.destroy", { id }));
            await fetchTrekking();
            setTableRefreshKey((prev) => prev + 1);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error deleting trekking:", error);
        }
    };

    // Edit handler
    const handleEdit = (trekking) => {
        setEditingTrekking(trekking);
        setShowEditForm(true);
    };

    // Update handler
    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourtrekkings.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        await fetchTrekking();
        setTableRefreshKey((prev) => prev + 1);
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Define columns for react-table
    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => (
                    <span className="text-gray-400 font-medium">
                        {row.index + 1}
                    </span>
                ),
            },
            {
                Header: "Image",
                accessor: "images",
                Cell: ({ value }) =>
                    value && value.length > 0 ? (
                        <img
                            src={`${imgurl}/${value[0].image}`}
                            alt="Trek"
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageOff size={16} className="text-gray-400" />
                        </div>
                    ),
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ row, value }) => (
                    <div>
                        <div className="font-semibold text-gray-800">
                            {value}
                        </div>
                        {row.original.images &&
                            row.original.images.length > 1 && (
                                <span className="text-xs text-gray-400">
                                    +{row.original.images.length - 1} more photo
                                    {row.original.images.length > 2 ? "s" : ""}
                                </span>
                            )}
                    </div>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ value }) => (
                    <span className="text-gray-600">
                        {value?.name || (
                            <span className="text-gray-300 italic">—</span>
                        )}
                    </span>
                ),
            },
            {
                Header: "Price",
                accessor: "price",
                Cell: ({ value }) =>
                    value ? (
                        <span className="font-medium text-green-600">
                            ${Number(value).toLocaleString()}
                        </span>
                    ) : (
                        <span className="text-gray-300 italic">—</span>
                    ),
            },
            {
                Header: "Days",
                accessor: "itineraries",
                Cell: ({ value }) =>
                    value && value.length > 0 ? (
                        <span className="text-indigo-600 font-medium text-xs">
                            {value.length} day{value.length > 1 ? "s" : ""}
                        </span>
                    ) : (
                        <span className="text-gray-300 italic text-xs">
                            No itinerary
                        </span>
                    ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                Trekking Management
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 font-medium"
                    >
                        <Plus size={18} />
                        <span>Add Trekking</span>
                    </button>
                </div>

                {/* Table */}

                <MyTable
                    key={tableRefreshKey}
                    columns={columns}
                    data={allTrekking}
                />

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
