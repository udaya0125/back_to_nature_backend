import axios from "axios";
import { Camera, Eye, EyeOff, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const roles = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
];

const selectStyles = (hasError) => ({
    control: (base, state) => ({
        ...base,
        minHeight: "44px",
        borderRadius: "0.75rem",
        borderColor: state.isFocused
            ? "#3b82f6"
            : hasError
              ? "#ef4444"
              : "#d1d5db",
        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
        "&:hover": {
            borderColor: state.isFocused
                ? "#3b82f6"
                : hasError
                  ? "#ef4444"
                  : "#d1d5db",
        },
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: "none",
    }),
});

const AddUserForm = ({ showForm, setShowForm, onClose, onUserAdded }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        register,
        reset,
        setError,
        clearErrors,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: null,
            image: null,
        },
    });

    const watchedImage = watch("image");

    useEffect(() => {
        if (!showForm) {
            return undefined;
        }

        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalWidth = document.body.style.width;

        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = originalWidth;
        };
    }, [showForm]);

    useEffect(() => {
        if (!watchedImage || watchedImage.length === 0) {
            return;
        }

        const file = watchedImage[0];
        if (!file) {
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview((currentPreview) => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview);
            }
            return previewUrl;
        });
    }, [watchedImage]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const closeForm = () => {
        reset();
        setImageFile(null);
        setImagePreview((currentPreview) => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview);
            }
            return null;
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
        clearErrors();
        onClose?.();
        setShowForm(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setValue("image", [file], { shouldValidate: false });
        setImageFile(file);
        setImagePreview((currentPreview) => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview);
            }
            return URL.createObjectURL(file);
        });
        event.target.value = "";
    };

    const onSubmit = async (data) => {
        if (data.password !== data.password_confirmation) {
            setError("password_confirmation", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

        if (data.role) {
            formData.append("role", data.role.value);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            setSubmitting(true);
            await axios.post(route("ouruser.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onUserAdded?.();
            closeForm();
        } catch (error) {
            console.error("Error saving user:", error);
            alert(
                error.response?.data?.message ||
                    "Error saving user. Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white px-6 py-6 shadow-2xl">
                <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b bg-white pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Add New User
                    </h2>
                    <button
                        type="button"
                        onClick={closeForm}
                        className="rounded-full p-2 transition-colors hover:bg-gray-100"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Camera className="mx-auto mb-2 h-12 w-12" />
                                        <span className="block text-xs">
                                            Add Photo
                                        </span>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="add-user-image-upload"
                                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
                            >
                                <Camera className="h-5 w-5" />
                            </label>
                            <input
                                id="add-user-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={submitting}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the camera icon to upload a profile picture
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                disabled={submitting}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message:
                                            "Please enter a valid email address",
                                    },
                                })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                disabled={submitting}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
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
                                        placeholder="Select Role"
                                        isSearchable={false}
                                        styles={selectStyles(!!errors.role)}
                                        isDisabled={submitting}
                                    />
                                )}
                            />
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters long",
                                        },
                                    })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Confirm Password{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("password_confirmation", {
                                        required:
                                            "Password confirmation is required",
                                    })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) => !current,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password_confirmation.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center rounded-full bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                                            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
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
