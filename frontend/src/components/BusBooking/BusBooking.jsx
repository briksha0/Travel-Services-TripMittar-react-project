import React, { useState } from "react";
import { MapPin, ArrowUpDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../CabBooking/useBookingStore";
import LocationSearch from "../Map/LocationSearch";

const BusBooking = () => {
  const { pickup, drop, setPickup, setDrop } = useBookingStore();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSwap = () => {
    if (!pickup && !drop) return;
    setPickup(drop);
    setDrop(pickup);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setError("");

    if (!pickup || !drop || !date) {
      setError("⚠️ Please select pickup, drop, and travel date");
      return;
    }

    setLoading(true);
    navigate("/buses/list", { state: { pickup, drop, date } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg backdrop-blur-md bg-white/80 dark:bg-gray-800/80
                      rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          🚌 Bus Booking
        </h1>

        {/* Error Message */}
        {error && (
          <p className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </p>
        )}

        {/* Pickup */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Pickup Location
          </label>
          <div className="flex text-white items-center gap-2 border border-gray-300 dark:border-gray-600
                          rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400">
            <MapPin className="text-blue-600" />
            <LocationSearch
              placeholder="Enter Pickup Location"
              defaultValue={pickup?.name || ""}
              onSelect={(place) => setPickup(place)}
            />
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg
                       hover:bg-blue-600 transform hover:scale-105 active:scale-95 transition"
            aria-label="Swap pickup and drop"
          >
            <ArrowUpDown size={20} />
          </button>
        </div>

        {/* Drop */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Drop Location
          </label>
          <div className="flex text-white items-center gap-2 border border-gray-300 dark:border-gray-600
                          rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-400">
            <MapPin className="text-green-600" />
            <LocationSearch
              placeholder="Enter Drop Location"
              defaultValue={drop?.name || ""}
              onSelect={(place) => setDrop(place)}
            />
          </div>
        </div>

        {/* Travel Date */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-white border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3
                       focus:ring-2 focus:ring-blue-400 bg-transparent"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Book/Search Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2
                     bg-gradient-to-r from-blue-500 to-blue-700
                     text-white py-3 rounded-xl shadow-lg
                     hover:from-blue-600 hover:to-blue-800
                     active:scale-95 transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "🚍 Search Buses"}
        </button>
      </div>
    </div>
  );
};

export default BusBooking;
