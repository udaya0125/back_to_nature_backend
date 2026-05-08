import React from 'react'

const AddTrekkingForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [trekkingForm, setTrekkingForm] = useState({
        title: "",
        category: "",
        sub_category: "",
        description: "",
        images: null,
        price: "",
        includes: "",
        excludes: "",
        itinerary: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingTrekking) {
            setTrekkingForm({
                ...editingTrekking,
                image: null,
            });
            setShowForm(true);
        } else {
            setTrekkingForm({
                name: "",
            });
        }
    }, [editingTrekking]);

    // Handle Create Trekking
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourtrekkings.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating trekking", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in trekkingForm) {
            if (trekkingForm[key] !== null && trekkingForm[key] !== "") {
                formData.append(key, trekkingForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingTrekking) {
                // Editing existing trekking
                await handleUpdate(formData, editingTrekking.id);
            } else {
                // Creating new trekking
                await handleCreate(formData);
            }
            setTrekkingForm({
                name: "",
            });

            setShowForm(false);
            setEditingTrekking(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setTrekkingForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

     if (!showForm) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Trekking
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
  )
}

export default AddTrekkingForm
