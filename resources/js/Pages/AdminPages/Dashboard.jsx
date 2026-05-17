import AdminWrapper from "@/AdminComponents/AdminWrapper";
import { Link } from "@inertiajs/react";
import { Image, Newspaper, UserCog } from "lucide-react";
import React from "react";

const Dashboard = () => {
    const cards = [
        {
            title: "Category",
            breadcrumb: "Category",
            icon: Image,
            link: "/category",
        },
        {
            title: "Sub Category",
            breadcrumb: "Sub Category",
            icon: Newspaper,
            link: "/sub-category",
        },
        {
            title: "Tour",
            breadcrumb: "Tour",
            icon: Newspaper,
            link: "/tours",
        },
        {
            title: "Trekking",
            breadcrumb: "Trekking",
            icon: Newspaper,
            link: "/trekking",
        },
        {
            title: "Activities",
            breadcrumb: "Activities",
            icon: Newspaper,
            link: "/activities",
        },
        {
            title: "User Management",
            breadcrumb: "User Management",
            icon: UserCog,
            link: "/user-management",
        },
    ];
    return (
        <>
            <AdminWrapper>
                <div className="">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                        Dashboard
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <Link
                                    key={index}
                                    href={card.link}
                                    className="block"
                                >
                                    <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                        {/* Card Top Breadcrumb */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xl font-semibold text-gray-800">
                                                Home
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                | {card.breadcrumb}{" "}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                                <Icon className="w-7 h-7 text-gray-700" />
                                            </div>

                                            <h3 className="text-lg font-medium text-gray-800">
                                                {card.title}{" "}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}{" "}
                    </div>
                </div>
            </AdminWrapper>
        </>
    );
};

export default Dashboard;
