import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Filter, Phone, Droplet, AlertCircle, Bell, Trash2 } from 'lucide-react';
import { searchDonors, addToWatchlist, getWatchlist } from '../lib/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SeekerSearchPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Watchlist state
  const [watchlist, setWatchlist] = useState([]);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  const loadWatchlist = useCallback(async () => {
    if (!currentUser) return;
    try {
      const list = await getWatchlist(currentUser.uid);
      setWatchlist(list);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadWatchlist();
    }
  }, [currentUser, loadWatchlist]);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchDonors(bloodType, location);
      setDonors(results);
    } catch (error) {
      console.error("Error searching:", error);
    }
    setLoading(false);
  };

  const handleNotifyMe = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!bloodType) {
      alert("Please select a blood type first.");
      return;
    }

    setAddingToWatchlist(true);
    try {
      await addToWatchlist(currentUser.uid, bloodType, location);
      await loadWatchlist();
      alert(`You will be notified when ${bloodType} becomes available${location ? ` in ${location}` : ''}.`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist. Please try again.");
    }
    setAddingToWatchlist(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Find Blood Donors</h1>
          <p className="mt-2 text-slate-600">Search for available donors nearby in case of emergency.</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
              <div className="relative">
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none appearance-none bg-slate-50"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                >
                  <option value="">Select Blood Type</option>
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

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Location (City)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. New York"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none bg-slate-50"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl shadow-md shadow-brand-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? '...' : (
                  <>
                    <Search className="h-5 w-5" />
                    Search
                  </>
                )}
              </button>
              <button
                onClick={handleNotifyMe}
                disabled={addingToWatchlist}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                title="Notify me when this blood type becomes available"
              >
                <Bell className="h-5 w-5" />
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-500" />
              My Watchlist
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-slate-800">{item.bloodType}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {item.location || 'Any Location'}
                    </p>
                  </div>
                  {/* Future: Add delete button */}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {hasSearched ? `Found ${donors.length} Donors` : 'Recent Donors'}
          </h2>

          {hasSearched && donors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No donors found matching your criteria.</p>
              <p className="text-slate-400 text-sm mt-1">Try expanding your search area or checking all blood types.</p>
            </div>
          ) : (
            donors.map(donor => (
              <div key={donor.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:border-brand-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 text-brand-600 font-bold text-xl h-14 w-14 rounded-full flex items-center justify-center border-2 border-red-100">
                    {donor.donorProfile.bloodType}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{donor.email.split('@')[0]}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1 gap-4">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {donor.donorProfile.city}</span>
                    </div>
                  </div>
                </div>

                <a href={`tel:${donor.donorProfile.phone}`} className="w-full md:w-auto px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Phone className="h-4 w-4" />
                  Contact Donor
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
