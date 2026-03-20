import React, { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";

const AiVoiceCalls = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = () => {
            fetch("http://localhost:5000/api/ai/voice-calls")
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setCalls(data);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching AI voice calls", error);
                    setLoading(false);
                });
        };

        fetchCalls();
        const intervalId = setInterval(fetchCalls, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId);
    }, []);

    const getStatusBadgeColor = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-100 text-emerald-800";
            case "failed":
                return "bg-rose-100 text-rose-800";
            case "no-answer":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    if (loading) {
        return <div className="p-4">Loading Voice Calls...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow mt-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <PhoneCall size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">AI Voice Calls</h3>
                        <p className="text-sm text-gray-500">History of automated AI phone calls to severely overdue customers.</p>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transcript</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {calls.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center justify-center text-sm text-gray-500">
                                    No recent voice calls found.
                                </td>
                            </tr>
                        ) : (
                            calls.map((call) => (
                                <tr key={call._id || Math.random()}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(call.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {call.customerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(call.callStatus)}`}>
                                            {call.callStatus ? call.callStatus.charAt(0).toUpperCase() + call.callStatus.slice(1) : ""}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate" title={call.transcript}>
                                        {call.transcript}
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

export default AiVoiceCalls;
