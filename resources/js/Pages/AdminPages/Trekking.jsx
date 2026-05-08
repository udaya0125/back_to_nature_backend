import AddTrekkingForm from '@/AddComponents/AddTrekkingForm';
import AdminWrapper from '@/AdminComponents/AdminWrapper'
import React from 'react'

const Trekking = () => {
    const [allTrekking, setAllTrekking] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTrekking, setEditingTrekking] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the trekking data
    useEffect(() => {
        const fetchTrekking = async () => {
            try {
                const response = await axios.get(route("ourtrekking.index"));
                setAllTrekking(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchTrekking();
    }, [reloadTrigger]);

    // For delete the trekking
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourtrekking.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handle edit
    const handleEdit = (trekking) => {
        setEditingTrekking(trekking);
    };

    // Handle update after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtrekking.update", { id }),
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
            console.log("Error updating trekking", error);
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
                            Trekking Management
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

                <AddTrekkingForm
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingTrekking={editingTrekking}
                    setEditingTrekking={setEditingTrekking}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
    </AdminWrapper>    
    </>
  )
}

export default Trekking
