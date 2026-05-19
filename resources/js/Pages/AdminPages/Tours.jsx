import AddToursForm from "@/AddComponents/AddToursForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import EditToursForm from "@/EditComponents/EditToursForm";
import { Plus, Pencil, Trash2, ImageOff, Edit } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import MyTable from "@/MyTable/MyTable";

const Tours = () => {
    const [allTour, setAllTour] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tableRefreshKey, setTableRefreshKey] = useState(0);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const fetchTour = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("ourtours.index"));
            setAllTour(response.data.data || []);
        } catch (error) {
            console.error("Error fetching tours:", error);
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

    useEffect(() => {
        fetchTour();
        fetchCategory();
    }, [reloadTrigger, fetchTour, fetchCategory]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this tour?")) return;
        try {
            await axios.delete(route("ourtours.destroy", { id }));
            await fetchTour();
            setTableRefreshKey((prev) => prev + 1);
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
            formData,
        );
        await fetchTour();
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
                    <span className="text-gray-400 font-mono text-xs">
                        {row.index + 1}
                    </span>
                ),
            },
            {
                Header: "Image",
                accessor: "images",
                Cell: ({ value }) =>
                    value?.[0] ? (
                        <img
                            src={`${imgurl}/${value[0].image}`}
                            alt="Tour"
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageOff size={14} className="text-gray-400" />
                        </div>
                    ),
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <p className="font-medium text-gray-800 leading-tight">
                        {value}
                    </p>
                ),
            },
            {
                Header: "Category",
                accessor: "category",
                Cell: ({ value }) =>
                    value?.name ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 whitespace-nowrap">
                            {value.name}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-xs">—</span>
                    ),
            },
            {
                Header: "Days",
                accessor: "itineraries",
                Cell: ({ value }) => (
                    <div className="text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                            {value?.length || 0}d
                        </span>
                    </div>
                ),
            },
            // {
            //     Header: "Images",
            //     accessor: "images",
            //     Cell: ({ value }) => (
            //         <div className="text-center text-gray-500 text-xs">
            //             {value?.length || 0}
            //         </div>
            //     ),
            // },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex  gap-1">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                        >
                            <Edit size={15} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
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
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Tour Management
                    </h1>
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

            <MyTable
                key={tableRefreshKey}
                columns={columns}
                data={allTour}
            />

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
