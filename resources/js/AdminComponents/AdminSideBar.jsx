import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    X,
    Menu,
    LayoutDashboard,
    UserCog,
    Folder,
    FolderTree,
    Map,
    Mountain,
    Footprints,
    ClipboardList,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];
    const [openDropdown, setOpenDropdown] = useState(null);

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path;
    };

    const isPageActive = () => {
        return [
            "our-teams",
            "gallery",
            "events",
            "partners",
            "inscriptions",
        ].includes(currentPath);
    };

    const isUsersActive = () => {
        return [
            "users",
            "user-management",
            "activity-log",
            "activities",
        ].includes(currentPath);
    };

    const toggleDropdown = (dropdownName) => {
        if (openDropdown === dropdownName) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdownName);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    bg-white border-gray-200
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between p-4 border-b h-16 ${isCollapsed ? "px-3" : ""}`}
                >
                    {/* {!isCollapsed && (
                        <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
                            Nepal Inscription
                        </div>
                    )} */}

                    {!isCollapsed && (
                        <div className="flex items-center gap-2 flex-1 pr-10">
                            <img
                                src="/images/logo.png"
                                alt="logo"
                                className="w-28 object-cover"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-1">
                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            <Menu className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={onMobileToggle}
                            className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div
                    className={`p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] ${isCollapsed ? "px-2" : "px-3"}`}
                >
                    {/* Dashboard Link */}
                    <Link
                        href="/"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Dashboard" : ""}
                    >
                        <LayoutDashboard
                            className={`w-5 h-5 ${isActive("/") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Dashboard
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Dashboard
                            </div>
                        )}
                    </Link>

                    {/* Category Link */}
                    <Link
                        href="/category"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Category" : ""}
                    >
                        <Folder
                            className={`w-5 h-5 ${isActive("/category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Category
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Category
                            </div>
                        )}
                    </Link>

                    {/* Sub Category Link */}
                    <Link
                        href="/sub-category"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/sub-category") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Sub Category" : ""}
                    >
                        <FolderTree
                            className={`w-5 h-5 ${isActive("/sub-category") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Sub Category
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Sub Category
                            </div>
                        )}
                    </Link>

                    {/* Tour Link */}
                    <Link
                        href="/tours"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/tours") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Tour" : ""}
                    >
                        <Map
                            className={`w-5 h-5 ${isActive("/tours") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Tours
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Tours
                            </div>
                        )}
                    </Link>

                    {/* Trekking Link */}
                    <Link
                        href="/trekking"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/trekking") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Trekking" : ""}
                    >
                        <Mountain
                            className={`w-5 h-5 ${isActive("/trekking") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Trekking
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Trekking
                            </div>
                        )}
                    </Link>

                    {/* Activities Link */}
                    <Link
                        href="/activities"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/activities") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Activities" : ""}
                    >
                        <Footprints
                            className={`w-5 h-5 ${isActive("/activities") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Activities
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Activities
                            </div>
                        )}
                    </Link>


                    {/* FQA Link */}
                    <Link
                        href="/faqs"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/faqs") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "FAQ" : ""}
                    >
                        <Footprints
                            className={`w-5 h-5 ${isActive("/faqs") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                FAQ
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                FAQ
                            </div>
                        )}
                    </Link>
                    {/* Activity Logs Link */}
                    <Link
                        href="/activity-logs"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/activity-logs") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "Activity Logs" : ""}
                    >
                        <ClipboardList
                            className={`w-5 h-5 ${isActive("/activity-logs") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                Activity Logs
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Activity Logs
                            </div>
                        )}
                    </Link>

                    {/* User Management Link */}
                    <Link
                        href="/user-management"
                        className={`
                            flex items-center rounded-lg transition-colors duration-200 group relative
                            ${isCollapsed ? "p-3 justify-center" : "p-3"}
                            ${isActive("/user-management") ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                        `}
                        title={isCollapsed ? "User Management" : ""}
                    >
                        <UserCog
                            className={`w-5 h-5 ${isActive("/user-management") ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 font-medium whitespace-nowrap">
                                User Management
                            </span>
                        )}

                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 text-sm bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                User Management
                            </div>
                        )}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
