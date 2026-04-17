import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import useDataStore from "../store/useDataStore";

const SearchBar = ({ placeholder, initialValue = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(initialValue || location.state?.query || "");
  const { resetData } = useDataStore();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    resetData();
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`, { 
      state: { query: searchQuery.trim() } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
          className={`px-8 py-4 bg-blue-600 rounded-r-lg transition-colors z-[2] ${
            searchQuery.trim()
              ? "text-white hover:bg-blue-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
