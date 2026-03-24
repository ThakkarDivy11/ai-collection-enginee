import React, { useState, useEffect } from "react";

const AiActions = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActions = () => {
            fetch("http://localhost:5000/api/ai/actions")
                .then((res) => res.json())
                .then((data) => {
                    console.log("AI Actions:", data);
                    const actionsArray = Array.isArray(data) ? data : data.data || [];
                    setActions(actionsArray);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching AI actions", error);
                    setLoading(false);
                });
        };

        fetchActions();
        const intervalId = setInterval(fetchActions, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const getActionBadgeColor = (actionType) => {
        if (!actionType) return "bg-gray-100 text-gray-800";
        switch (actionType.toLowerCase()) {
            case "email":
            case "friendly":
                return "bg-blue-100 text-blue-800";
            case "call":
            case "escalate":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusBadgeColor = (status) => {
        if (!status || status === "sent") return "bg-emerald-100 text-emerald-700";
        if (status === "failed") return "bg-rose-100 text-rose-700";
        return "bg-amber-100 text-amber-700";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    };

    if (loading) {
        return <div className="p-4">Loading AI actions...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent AI Actions</h3>
                <p className="text-sm text-gray-500">History of autonomous AI agent interactions about overdue invoices.</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {actions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No recent AI actions found.
                                </td>
                            </tr>
                        ) : (
                            actions.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(item.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.customerName || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{item.amount || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(item.action)}`}>
                                            {item.action ? item.action.charAt(0).toUpperCase() + item.action.slice(1) : "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.actionStatus)}`}>
                                            {item.actionStatus || "sent"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.message}>
                                        {item.message || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AiActions;
