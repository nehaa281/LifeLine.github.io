import React, { useState, useEffect } from 'react';
import { getDonationCamps } from '../lib/firestore';
import { MapPin, Calendar, User, Phone, Droplet, Clock } from 'lucide-react';

export default function DonationCampsPage() {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCamps();
    }, []);

    const loadCamps = async () => {
        try {
            const data = await getDonationCamps();
            setCamps(data);
        } catch (error) {
            console.error("Error loading camps:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900">Upcoming Donation Camps</h1>
                    <p className="mt-2 text-slate-600">Find a blood donation camp near you and help save lives.</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Loading camps...</p>
                    </div>
                ) : camps.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No upcoming donation camps found.</p>
                        <p className="text-slate-400 text-sm mt-1">Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {camps.map(camp => (
                            <CampCard key={camp.id} camp={camp} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CampCard({ camp }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-brand-50 p-6 border-b border-brand-100">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{camp.campName}</h3>
                <p className="text-sm text-brand-700 font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Organized by {camp.organizerName}
                </p>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Date</p>
                        <p className="text-slate-900 font-medium">{camp.date}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Location</p>
                        <p className="text-slate-900 font-medium">{camp.address}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <Phone className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Contact</p>
                        <p className="text-slate-900 font-medium">{camp.contact}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    View Details
                </button>
            </div>
        </div>
    );
}
