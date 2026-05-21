// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import { User, Mail, Lock, Eye, EyeOff, X } from "lucide-react";
// import axios from "axios";

// const AddUserForm = ({ showForm, setShowForm, onClose, onUserAdded }) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [imageFile, setImageFile] = useState(null);

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
//             password: "",
//             role: null,
//             image: null,
//         },
//     });

//     const watchedImage = watch("image");

//     useEffect(() => {
//         if (!watchedImage || watchedImage.length === 0) {
//             setImagePreview(null);
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
//         setImagePreview(null);
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

//             if (data.password) {
//                 formData.append("password", data.password);
//             }

//             if (imageFile) {
//                 formData.append("image", imageFile);
//             }

//             // Create new user
//             await axios.post(route("ouruser.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             onUserAdded();

//             // Reset form
//             reset();
//             setImagePreview(null);
//             setImageFile(null);
//         } catch (error) {
//             console.error("Error saving user:", error);
//             alert("Error saving user. Please try again.");
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

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         Add New User
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
//                                 {...register("name", {
//                                     required: "Name is required",
//                                 })}
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
//                                         message: "Invalid email address",
//                                     },
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

//                     {/* Password Input */}
//                     <div>
//                         <label
//                             htmlFor="password"
//                             className="block text-sm font-medium text-gray-700 mb-2"
//                         >
//                             Password *
//                         </label>
//                         <div className="relative">
//                             <Lock
//                                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                 size={20}
//                             />
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="password"
//                                 {...register("password", {
//                                     required: "Password is required",
//                                     minLength: {
//                                         value: 6,
//                                         message:
//                                             "Password must be at least 6 characters",
//                                     },
//                                 })}
//                                 className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                                     errors.password
//                                         ? "border-red-500"
//                                         : "border-gray-300"
//                                 }`}
//                                 placeholder="Enter password"
//                                 autoComplete="new-password"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                             >
//                                 {showPassword ? (
//                                     <EyeOff size={20} />
//                                 ) : (
//                                     <Eye size={20} />
//                                 )}
//                             </button>
//                         </div>
//                         {errors.password && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {errors.password.message}
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
//                                                   ? "#ef4444"
//                                                   : "#d1d5db",
//                                             boxShadow: state.isFocused
//                                                 ? "0 0 0 1px #3b82f6"
//                                                 : "none",
//                                             "&:hover": {
//                                                 borderColor: state.isFocused
//                                                     ? "#3b82f6"
//                                                     : errors.role
//                                                       ? "#ef4444"
//                                                       : "#d1d5db",
//                                             },
//                                             minHeight: "50px",
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
//                         <label
//                             htmlFor="image"
//                             className="block text-sm font-medium text-gray-700 mb-2"
//                         >
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
//                                 : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
//                         }`}
//                     >
//                         {submitting ? "Registering..." : "Register User"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;



import axios from "axios";
import { X, Eye, EyeOff, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddUserForm = ({ setReloadTrigger, setShowForm, onUserAdded }) => {
    const [submitting, setSubmitting] = useState(false);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        image: null,
        phone_number: "",
        password: "",
        password_confirmation: "",
        role: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Lock body scroll when form mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    // Clean up object URLs when imagePreview changes
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Validate image size
    const validateImageSize = (file) => {
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.size > maxSizeInBytes) {
            alert(`${file.name} exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            return false;
        }
        return true;
    };

    // Validate passwords
    const validatePasswords = () => {
        if (userForm.password !== userForm.password_confirmation) {
            setPasswordError("Passwords do not match");
            return false;
        }
        if (userForm.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return false;
        }
        setPasswordError("");
        return true;
    };

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ouruser.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (onUserAdded) {
                onUserAdded();
            }
            if (setReloadTrigger) {
                setReloadTrigger((prev) => !prev);
            }
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!userForm.name.trim() || !userForm.email.trim()) {
            alert("Name and Email are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userForm.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validate role
        if (!userForm.role) {
            alert("Please select a role");
            return;
        }

        // Validate passwords
        if (!validatePasswords()) {
            return;
        }

        const formData = new FormData();
        
        // Append all form data
        Object.keys(userForm).forEach(key => {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        });

        // Remove password_confirmation from form data
        formData.delete('password_confirmation');

        try {
            setSubmitting(true);
            await handleCreate(formData);

            // Reset form
            setUserForm({
                name: "",
                email: "",
                image: null,
                phone_number: "",
                password: "",
                password_confirmation: "",
                role: "",
            });
            setImagePreview(null);
            setShowForm(false);
            setShowPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.log("Error saving data", error);
            
            let errorMessage = 'Error creating user. Please try again.';
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 422) {
                    errorMessage = 'Validation error. Please check your input.';
                }
            }
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        if (name === "password" || name === "password_confirmation") {
            setPasswordError("");
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!validateImageSize(file)) {
                return;
            }

            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            setUserForm((prev) => ({
                ...prev,
                image: file,
            }));
            
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleClose = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setShowForm(false);
        setImagePreview(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordError("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">Add New User</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-gray-400 text-center">
                                            <Camera className="w-12 h-12 mx-auto mb-2" />
                                            <span className="text-xs block">Add Photo</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 cursor-pointer transition-colors shadow-lg"
                            >
                                <Camera className="w-5 h-5" />
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                name="image"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={submitting}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the camera icon to upload a profile picture (Max 5MB)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={userForm.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={submitting}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={submitting}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={userForm.phone_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={submitting}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={userForm.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={submitting}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        {/* Password with Eye Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userForm.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password with Eye Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={userForm.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {/* Password Error Message */}
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-600">
                                    {passwordError}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                <span>Create User</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;

// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import { User, Mail, Lock, Eye, EyeOff, X, Upload, AlertCircle } from "lucide-react";
// import axios from "axios";

// const AddUserForm = ({ showForm, setShowForm, onClose, onUserAdded }) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);

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
//             password: "",
//             role: null,
//             image: null,
//         },
//     });

//     const watchedImage = watch("image");

//     useEffect(() => {
//         if (!watchedImage || watchedImage.length === 0) {
//             return;
//         }

//         const file = watchedImage[0];
        
//         // Validate file size
//         if (!validateImageSize(file)) {
//             setValue("image", null);
//             return;
//         }
        
//         setImageFile(file);

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             setImagePreview(e.target.result);
//         };
//         reader.readAsDataURL(file);
//     }, [watchedImage]);

//     // ─── Image Validation ───────────────────────────────────────────────────────
//     const validateImageSize = (file) => {
//         const maxSizeInMB = 5;
//         const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
//         if (file.size > maxSizeInBytes) {
//             alert(`${file.name} exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
//             return false;
//         }
//         return true;
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (!files.length) return;

//         const file = files[0];
        
//         if (validateImageSize(file)) {
//             setValue("image", files);
//             setImageFile(file);
            
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImagePreview(e.target.result);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setValue("image", null);
//         }

//         e.target.value = "";
//     };

//     // ─── Drag and drop handlers ─────────────────────────────────────────────
//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
        
//         const files = Array.from(e.dataTransfer.files);
//         const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
//         if (imageFiles.length === 0) {
//             alert("Please drop an image file only (jpg, jpeg, png, webp)");
//             return;
//         }
        
//         const file = imageFiles[0];
        
//         if (validateImageSize(file)) {
//             setValue("image", imageFiles);
//             setImageFile(file);
            
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImagePreview(e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const removeImage = () => {
//         setValue("image", null);
//         setImageFile(null);
//         setImagePreview(null);
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

//             if (data.password) {
//                 formData.append("password", data.password);
//             }

//             if (imageFile) {
//                 formData.append("image", imageFile);
//             }

//             // Create new user
//             await axios.post(route("ouruser.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             onUserAdded();

//             // Reset form
//             reset();
//             setImagePreview(null);
//             setImageFile(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Error saving user:", error);
//             alert("Error saving user. Please try again.");
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

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
//                 {/* Header */}
//                 <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
//                     <h2 className="text-xl font-bold text-gray-900">
//                         Add New User
//                     </h2>
//                     <button
//                         onClick={handleCancel}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
//                         type="button"
//                     >
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Scrollable Body */}
//                 <div className="overflow-y-auto flex-1">
//                     <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
//                         {/* Name Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Full Name <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <User
//                                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={18}
//                                 />
//                                 <input
//                                     type="text"
//                                     {...register("name", {
//                                         required: "Name is required",
//                                     })}
//                                     className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
//                                         errors.name
//                                             ? "border-red-500 focus:border-red-500"
//                                             : "border-gray-300 focus:border-indigo-400"
//                                     }`}
//                                     placeholder="Enter full name"
//                                 />
//                             </div>
//                             {errors.name && (
//                                 <p className="mt-1 text-xs text-red-600">
//                                     {errors.name.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Email Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Email Address <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <Mail
//                                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={18}
//                                 />
//                                 <input
//                                     type="email"
//                                     {...register("email", {
//                                         required: "Email is required",
//                                         pattern: {
//                                             value: /^\S+@\S+$/i,
//                                             message: "Invalid email address",
//                                         },
//                                     })}
//                                     className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
//                                         errors.email
//                                             ? "border-red-500 focus:border-red-500"
//                                             : "border-gray-300 focus:border-indigo-400"
//                                     }`}
//                                     placeholder="Enter email address"
//                                 />
//                             </div>
//                             {errors.email && (
//                                 <p className="mt-1 text-xs text-red-600">
//                                     {errors.email.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Password Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Password <span className="text-red-500">*</span>
//                             </label>
//                             <div className="relative">
//                                 <Lock
//                                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                                     size={18}
//                                 />
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     {...register("password", {
//                                         required: "Password is required",
//                                         minLength: {
//                                             value: 6,
//                                             message: "Password must be at least 6 characters",
//                                         },
//                                     })}
//                                     className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
//                                         errors.password
//                                             ? "border-red-500 focus:border-red-500"
//                                             : "border-gray-300 focus:border-indigo-400"
//                                     }`}
//                                     placeholder="Enter password"
//                                     autoComplete="new-password"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                 >
//                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                                 </button>
//                             </div>
//                             {errors.password && (
//                                 <p className="mt-1 text-xs text-red-600">
//                                     {errors.password.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Role Selection with React Select */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                 Role <span className="text-red-500">*</span>
//                             </label>
//                             <Controller
//                                 name="role"
//                                 control={control}
//                                 rules={{ required: "Role is required" }}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={roles}
//                                         className="react-select-container"
//                                         classNamePrefix="react-select"
//                                         placeholder="Select role..."
//                                         isSearchable={false}
//                                         styles={{
//                                             control: (base, state) => ({
//                                                 ...base,
//                                                 borderColor: state.isFocused
//                                                     ? "#6366f1"
//                                                     : errors.role
//                                                       ? "#ef4444"
//                                                       : "#d1d5db",
//                                                 boxShadow: state.isFocused
//                                                     ? "0 0 0 1px #6366f1"
//                                                     : "none",
//                                                 "&:hover": {
//                                                     borderColor: state.isFocused
//                                                         ? "#6366f1"
//                                                         : errors.role
//                                                           ? "#ef4444"
//                                                           : "#d1d5db",
//                                                 },
//                                                 minHeight: "42px",
//                                                 borderRadius: "0.75rem",
//                                             }),
//                                         }}
//                                     />
//                                 )}
//                             />
//                             {errors.role && (
//                                 <p className="mt-1 text-xs text-red-600">
//                                     {errors.role.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Image Upload - Improved UI Section */}
//                         <div>
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                                     Profile Image
//                                 </label>
//                                 <p className="text-xs text-gray-400 mb-3">
//                                     Maximum file size: 5MB • Supported formats: JPG, JPEG, PNG, WEBP
//                                 </p>
//                             </div>

//                             {/* Image Preview */}
//                             {imagePreview && (
//                                 <div className="mb-4">
//                                     <div className="relative group inline-block">
//                                         <div className="relative aspect-square w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-200">
//                                             <img
//                                                 src={imagePreview}
//                                                 alt="Preview"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                                                 <div className="absolute bottom-0 left-0 right-0 p-2">
//                                                     <p className="text-white text-xs truncate">
//                                                         {imageFile?.name || "Preview"}
//                                                     </p>
//                                                     {imageFile && (
//                                                         <p className="text-white/70 text-xs">
//                                                             {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={removeImage}
//                                             className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all transform hover:scale-105"
//                                         >
//                                             <X size={14} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Upload Area - Drag & Drop */}
//                             <div
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 className={`
//                                     relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
//                                     ${isDragging 
//                                         ? 'border-indigo-500 bg-indigo-50' 
//                                         : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100'
//                                     }
//                                 `}
//                             >
//                                 <input
//                                     type="file"
//                                     accept="image/jpg,image/jpeg,image/png,image/webp"
//                                     onChange={handleImageChange}
//                                     id="image-upload"
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 />
                                
//                                 <div className="text-center">
//                                     <div className={`
//                                         inline-flex p-3 rounded-full mb-3 transition-all
//                                         ${isDragging ? 'bg-indigo-100' : 'bg-white'}
//                                     `}>
//                                         <Upload 
//                                             size={32} 
//                                             className={isDragging ? 'text-indigo-600' : 'text-gray-400'}
//                                         />
//                                     </div>
                                    
//                                     <p className="text-sm font-medium text-gray-700 mb-1">
//                                         {isDragging ? 'Drop your image here' : 'Drag & drop image here'}
//                                     </p>
                                    
//                                     <p className="text-xs text-gray-500 mb-3">
//                                         or click to browse from your computer
//                                     </p>
                                    
//                                     <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
//                                         <AlertCircle size={12} />
//                                         <span>Maximum 5MB per image</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Upload tips */}
//                             {!imagePreview && (
//                                 <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mt-3">
//                                     <AlertCircle size={14} />
//                                     <span>Tip: Upload a clear profile picture for better recognition.</span>
//                                 </div>
//                             )}
//                         </div>
//                     </form>
//                 </div>

//                 {/* Footer - Attached at bottom */}
//                 <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-2xl">
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         disabled={submitting}
//                         className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium text-sm disabled:opacity-50"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         onClick={handleSubmit(onSubmit)}
//                         disabled={submitting}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition font-medium text-sm disabled:opacity-60"
//                     >
//                         {submitting ? (
//                             <>
//                                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                 <span>Registering...</span>
//                             </>
//                         ) : (
//                             <span>Register User</span>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;
