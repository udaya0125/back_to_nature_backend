import AddToursForm from "@/AddComponents/AddToursForm";
import AdminWrapper from "@/AdminComponents/AdminWrapper";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Tours = () => {
    const [allTour, setAllTour] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the tour data
    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await axios.get(route("ourtours.index"));
                setAllTour(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchTour();
    }, [reloadTrigger]);

    // For delete the tour
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourtours.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (tour) => {
        setEditingTour(tour);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtours.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating tour", error);
            throw error;
        }
    };
    return (
        <>
            <AdminWrapper>
                <AdminWrapper>
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                Tour Management
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    <AddToursForm
                        showForm={showForm}
                        setShowForm={setShowForm}
                        setReloadTrigger={setReloadTrigger}
                        editingTour={editingTour}
                        setEditingTour={setEditingTour}
                        handleUpdate={handleUpdate}
                    />
                </AdminWrapper>
            </AdminWrapper>
        </>
    );
};

export default Tours;
