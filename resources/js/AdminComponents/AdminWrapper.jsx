import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import AdminSideBar from "./AdminSideBar";
import { usePage } from "@inertiajs/react";

const AdminWrapper = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.localStorage.getItem("admin-sidebar-collapsed") === "true";
    });
    const { props } = usePage();
    const user = props?.auth?.user || null;

    const toggleMobile = () => setIsMobileOpen((prev) => !prev);
    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    // Close mobile sidebar on window resize & adjust layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        window.localStorage.setItem(
            "admin-sidebar-collapsed",
            String(isCollapsed)
        );
    }, [isCollapsed]);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavBar onMenuToggle={toggleMobile} />

            <AdminSideBar
                isMobileOpen={isMobileOpen}
                onMobileToggle={toggleMobile}
                user={user}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            <main
                className={`pt-16 min-h-screen  transition-all duration-300 ${
                    isCollapsed ? "lg:ml-16" : "lg:ml-64"
                }`}
            >
                <div className="lg:p-6">{children}</div>
            </main>
        </div>
    );
};

export default AdminWrapper;
