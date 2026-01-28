import React, { useState } from 'react';
import { addInventoryItem } from '../lib/firestore';
import { Droplet, MapPin, Plus, Save } from 'lucide-react';

export default function TestAdminPage() {
    const [bloodType, setBloodType] = useState('A+');
    const [location, setLocation] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    const handleAddInventory = async (e) => {
        e.preventDefault();
        try {
            // Using a dummy hospital ID for testing
            await addInventoryItem('test-hospital-id', bloodType, location, quantity);
            setMessage(`Success! Added ${quantity} unit(s) of ${bloodType} in ${location}`);
            setLocation('');
            setQuantity(1);

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Hospital Admin (Test)</h1>
                    <p className="text-slate-500 mt-2">Add blood inventory to trigger notifications.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-center text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleAddInventory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none appearance-none bg-slate-50"
                                value={bloodType}
                                onChange={(e) => setBloodType(e.target.value)}
                            >
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <Droplet className="absolute left-3 top-3.5 h-5 w-5 text-brand-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="e.g. New York"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (Units)</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <Plus className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <Save className="h-5 w-5" />
                        Add to Inventory
                    </button>
                </form>
            </div>
        </div>
    );
}
