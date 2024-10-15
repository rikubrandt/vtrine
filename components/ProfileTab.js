import { useEffect, useState } from "react";
import fetchDisplays from "../lib/fetchDisplays";
import MapDisplay from "./Map";
import Timeline from "./Timeline";
import AllComponent from "./AllComponent";

const ProfileTab = ({ userId, posts }) => {
    const [activeTab, setActiveTab] = useState("Timeline");

    const renderActiveTab = () => {
        switch (activeTab) {
            case "Map":
                return <MapDisplay displays={posts} />;
            case "Timeline":
                return (
                    <div className="timeline-wrapper">
                        <Timeline displays={posts} />
                    </div>
                );
            case "All":
                return <AllComponent displays={posts} />;
            default:
                return null;
        }
    };

    return (
        <div className="profile-page container mx-auto p-4">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li className="mr-2">
                        <button
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                                activeTab === "Map"
                                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`}
                            onClick={() => setActiveTab("Map")}
                        >
                            🗺️ Map
                        </button>
                    </li>
                    <li className="mr-2">
                        <button
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                                activeTab === "Timeline"
                                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`}
                            onClick={() => setActiveTab("Timeline")}
                        >
                            📅 Timeline
                        </button>
                    </li>
                    <li className="mr-2">
                        <button
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                                activeTab === "All"
                                    ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`}
                            onClick={() => setActiveTab("All")}
                        >
                            🏞️ All
                        </button>
                    </li>
                </ul>
            </div>
            <div className="tab-content">{renderActiveTab()}</div>
        </div>
    );
};

export default ProfileTab;
