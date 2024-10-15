import { withAuth } from "../components/withAuth";

const Notifications = () => {
    return (
        <div className="py-8 w-full">
            <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="text-center text-gray-500">
                        <p className="text-lg font-semibold">No new notifications</p>
                        <p className="text-sm mt-2">You're all caught up for now.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Notifications);
