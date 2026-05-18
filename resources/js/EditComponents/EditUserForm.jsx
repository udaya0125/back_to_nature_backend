// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import { User, Mail, X } from "lucide-react";
// import axios from "axios";

// const EditUserForm = ({ showForm, setShowForm, editingUser, onClose, onUserUpdated }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const roles = [
//         { value: "admin", label: "Admin" },
//         { value: "user", label: "User" },
//     ];

//     const {
//         control,
//         handleSubmit,
//         watch,
//         reset,
//         register,
//         setValue,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             role: null,
//             image: null,
//         },
//     });

//     const watchedImage = watch("image");

//     useEffect(() => {
//         if (editingUser) {
//             setValue("name", editingUser.name);
//             setValue("email", editingUser.email);
//             setValue("role", roles.find(r => r.value === editingUser.role) || null);
//             if (editingUser.image) {
//                 setImagePreview(`${imgurl}/${editingUser.image}`);
//             }
//         }
//     }, [editingUser, setValue, imgurl]);

//     useEffect(() => {
//         if (!watchedImage || watchedImage.length === 0) {
//             return;
//         }

//         const file = watchedImage[0];
//         setImageFile(file);

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             setImagePreview(e.target.result);
//         };
//         reader.readAsDataURL(file);
//     }, [watchedImage]);

//     const removeImage = () => {
//         setValue("image", null);
//         setImageFile(null);
//         if (editingUser.image) {
//             setImagePreview(`${imgurl}/${editingUser.image}`);
//         } else {
//             setImagePreview(null);
//         }
//     };

//     const onSubmit = async (data) => {
//         setSubmitting(true);

//         try {
//             const formData = new FormData();
//             formData.append("name", data.name);
//             formData.append("email", data.email);
            
//             if (data.role) {
//                 formData.append("role", data.role.value);
//             }
            
//             if (imageFile) {
//                 formData.append("image", imageFile);
//             }

//             // Update existing user
//             formData.append("_method", "PUT");
//             await axios.post(route("ouruser.update", { id: editingUser.id }), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             onUserUpdated();

//             // Reset form
//             reset();
//             setImagePreview(null);
//             setImageFile(null);
//         } catch (error) {
//             console.error("Error updating user:", error);
//             alert("Error updating user. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleCancel = () => {
//         reset();
//         setImagePreview(null);
//         setImageFile(null);
//         onClose();
//     };

//     if (!showForm || !editingUser) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         Edit User
//                     </h2>
//                     <button
//                         onClick={handleCancel}
//                         className="text-gray-500 hover:text-gray-700 transition-colors"
//                         type="button"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                     {/* Name Input */}
//                     <div>
//                         <label
//                             htmlFor="name"
//                             className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                             Full Name *
//                         </label>
//                         <div className="relative">
//                             <User
//                                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                 size={20}
//                             />
//                             <input
//                                 type="text"
//                                 id="name"
//                                 {...register("name", { required: "Name is required" })}
//                                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                                     errors.name
//                                         ? "border-red-500"
//                                         : "border-gray-300"
//                                 }`}
//                                 placeholder="Enter full name"
//                             />
//                         </div>
//                         {errors.name && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.name.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Email Input */}
//                     <div>
//                         <label
//                             htmlFor="email"
//                             className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                             Email Address *
//                         </label>
//                         <div className="relative">
//                             <Mail
//                                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                 size={20}
//                             />
//                             <input
//                                 type="email"
//                                 id="email"
//                                 {...register("email", { 
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^\S+@\S+$/i,
//                                         message: "Invalid email address"
//                                     }
//                                 })}
//                                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                                     errors.email
//                                         ? "border-red-500"
//                                         : "border-gray-300"
//                                 }`}
//                                 placeholder="Enter email address"
//                             />
//                         </div>
//                         {errors.email && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.email.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Role Selection with React Select */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Role *
//                         </label>
//                         <Controller
//                             name="role"
//                             control={control}
//                             rules={{ required: "Role is required" }}
//                             render={({ field }) => (
//                                 <Select
//                                     {...field}
//                                     options={roles}
//                                     className="react-select-container"
//                                     classNamePrefix="react-select"
//                                     placeholder="Select role..."
//                                     isSearchable={false}
//                                     styles={{
//                                         control: (base, state) => ({
//                                             ...base,
//                                             borderColor: state.isFocused
//                                                 ? "#3b82f6"
//                                                 : errors.role
//                                                 ? "#ef4444"
//                                                 : "#d1d5db",
//                                             boxShadow: state.isFocused
//                                                 ? "0 0 0 1px #3b82f6"
//                                                 : "none",
//                                             "&:hover": {
//                                                 borderColor: state.isFocused
//                                                     ? "#3b82f6"
//                                                     : errors.role
//                                                     ? "#ef4444"
//                                                     : "#d1d5db",
//                                             },
//                                             minHeight: "50px"
//                                         }),
//                                     }}
//                                 />
//                             )}
//                         />
//                         {errors.role && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.role.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
//                             Profile Image
//                         </label>
//                         <input
//                             type="file"
//                             id="image"
//                             accept="image/*"
//                             {...register("image")}
//                             className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                         {imagePreview && (
//                             <div className="mt-2">
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="w-20 h-20 object-cover rounded border"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={removeImage}
//                                     className="mt-2 text-sm text-red-600 hover:text-red-800"
//                                 >
//                                     Remove image
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={submitting}
//                         className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
//                             submitting
//                                 ? "bg-gray-400 cursor-not-allowed"
//                                 : "bg-blue-600 hover:blue-700 active:bg-blue-800"
//                         }`}
//                     >
//                         {submitting ? "Updating..." : "Update User"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditUserForm;


import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { User, Mail, X, Upload, AlertCircle } from "lucide-react";
import axios from "axios";

const EditUserForm = ({ showForm, setShowForm, editingUser, onClose, onUserUpdated }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const roles = [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
    ];

    const {
        control,
        handleSubmit,
        watch,
        reset,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            role: null,
            image: null,
        },
    });

    const watchedImage = watch("image");

    useEffect(() => {
        if (editingUser) {
            setValue("name", editingUser.name);
            setValue("email", editingUser.email);
            setValue("role", roles.find(r => r.value === editingUser.role) || null);
            if (editingUser.image) {
                setImagePreview(`${imgurl}/${editingUser.image}`);
            } else {
                setImagePreview(null);
            }
        }
    }, [editingUser, setValue, imgurl]);

    useEffect(() => {
        if (!watchedImage || watchedImage.length === 0) {
            return;
        }

        const file = watchedImage[0];
        
        // Validate file size
        if (!validateImageSize(file)) {
            setValue("image", null);
            return;
        }
        
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }, [watchedImage]);

    // ─── Image Validation ───────────────────────────────────────────────────────
    const validateImageSize = (file) => {
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.size > maxSizeInBytes) {
            alert(`${file.name} exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            return false;
        }
        return true;
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const file = files[0];
        
        if (validateImageSize(file)) {
            setValue("image", files);
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setValue("image", null);
        }

        e.target.value = "";
    };

    // ─── Drag and drop handlers ─────────────────────────────────────────────
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert("Please drop an image file only (jpg, jpeg, png, webp)");
            return;
        }
        
        const file = imageFiles[0];
        
        if (validateImageSize(file)) {
            setValue("image", imageFiles);
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setValue("image", null);
        setImageFile(null);
        if (editingUser.image) {
            setImagePreview(`${imgurl}/${editingUser.image}`);
        } else {
            setImagePreview(null);
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            
            if (data.role) {
                formData.append("role", data.role.value);
            }
            
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // Update existing user
            formData.append("_method", "PUT");
            await axios.post(route("ouruser.update", { id: editingUser.id }), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onUserUpdated();

            // Reset form
            reset();
            setImagePreview(null);
            setImageFile(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        setImagePreview(null);
        setImageFile(null);
        onClose();
    };

    if (!showForm || !editingUser) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit User
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                                        errors.name
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-indigo-400"
                                    }`}
                                    placeholder="Enter full name"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                                        errors.email
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:border-indigo-400"
                                    }`}
                                    placeholder="Enter email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Role Selection with React Select */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: "Role is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={roles}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Select role..."
                                        isSearchable={false}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                borderColor: state.isFocused
                                                    ? "#6366f1"
                                                    : errors.role
                                                    ? "#ef4444"
                                                    : "#d1d5db",
                                                boxShadow: state.isFocused
                                                    ? "0 0 0 1px #6366f1"
                                                    : "none",
                                                "&:hover": {
                                                    borderColor: state.isFocused
                                                        ? "#6366f1"
                                                        : errors.role
                                                        ? "#ef4444"
                                                        : "#d1d5db",
                                                },
                                                minHeight: "42px",
                                                borderRadius: "0.75rem",
                                            }),
                                        }}
                                    />
                                )}
                            />
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        {/* Image Upload - Improved UI Section */}
                        <div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Profile Image
                                </label>
                                <p className="text-xs text-gray-400 mb-3">
                                    Maximum file size: 5MB • Supported formats: JPG, JPEG, PNG, WEBP
                                </p>
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4">
                                    <div className="relative group inline-block">
                                        <div className="relative aspect-square w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-200">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                                    <p className="text-white text-xs truncate">
                                                        {imageFile?.name || "Current image"}
                                                    </p>
                                                    {imageFile && (
                                                        <p className="text-white/70 text-xs">
                                                            {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all transform hover:scale-105"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area - Drag & Drop */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`
                                    relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
                                    ${isDragging 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <input
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    id="image-upload"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                
                                <div className="text-center">
                                    <div className={`
                                        inline-flex p-3 rounded-full mb-3 transition-all
                                        ${isDragging ? 'bg-indigo-100' : 'bg-white'}
                                    `}>
                                        <Upload 
                                            size={32} 
                                            className={isDragging ? 'text-indigo-600' : 'text-gray-400'}
                                        />
                                    </div>
                                    
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {isDragging ? 'Drop your image here' : 'Drag & drop image here'}
                                    </p>
                                    
                                    <p className="text-xs text-gray-500 mb-3">
                                        or click to browse from your computer
                                    </p>
                                    
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                        <AlertCircle size={12} />
                                        <span>Maximum 5MB per image</span>
                                    </div>
                                </div>
                            </div>

                            {/* Upload tips */}
                            {!imagePreview && (
                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-3">
                                    <AlertCircle size={14} />
                                    <span>Tip: Upload a clear profile picture for better recognition.</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer - Attached at bottom */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submitting}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <span>Update User</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserForm;