import React, { useState, useMemo } from "react";
import { useFetchLaunches, Launch } from "../hooks/useFetchLaunches";
import LaunchList from "../components/LaunchList";
import { useDebounce } from "../hooks/useDebounce";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import DarkModeSwitch from "../components/DarkModeSwitch";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePage: React.FC = () => {
  const { launches, loading, error } = useFetchLaunches();

  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [launchYear, setLaunchYear] = useState("");
  const [onlySuccessful, setOnlySuccessful] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const launchesPerPage = 8;

  const { favorites } = useFavorites();
  const { darkMode } = useTheme();

  const debouncedSearch = useDebounce(searchTerm, 300);
  const years = useMemo(() => {
    const yearSet = new Set<string>();
    launches.forEach((launch) => {
      const year = new Date(launch.date_utc).getFullYear().toString();
      yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [launches]);

  const filteredLaunches = useMemo(() => {
    return launches.filter((launch) => {
      const matchesSearch =
        debouncedSearch === "" ||
        launch.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesYear =
        launchYear === "" ||
        new Date(launch.date_utc).getFullYear().toString() === launchYear;
      const matchesSuccess = !onlySuccessful || launch.success === true;
      const matchesFavorites = !showFavoritesOnly || favorites.has(launch.id);

      return matchesSearch && matchesYear && matchesSuccess && matchesFavorites;
    });
  }, [
    launches,
    debouncedSearch,
    launchYear,
    onlySuccessful,
    showFavoritesOnly,
    favorites,
  ]);

  // Pagination logic
  const indexOfLastLaunch = currentPage * launchesPerPage;
  const indexOfFirstLaunch = indexOfLastLaunch - launchesPerPage;
  const currentLaunches = filteredLaunches.slice(indexOfFirstLaunch, indexOfLastLaunch);

  const totalPages = Math.ceil(filteredLaunches.length / launchesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6 text-gray-900 dark:text-gray-100`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-black text-indigo-700 drop-shadow dark:text-indigo-400">
          SpaceX Mission Explorer
        </h1>
        <DarkModeSwitch />
      </div>

      <div className="mb-8 p-4 rounded-xl bg-indigo-50 shadow flex flex-wrap gap-4 items-center dark:bg-indigo-900">
        <input
          type="text"
          placeholder="Search missions"
          className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full sm:w-auto dark:bg-gray-900 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search missions"
        />
        <select
          className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition dark:bg-gray-900 dark:text-gray-200"
          value={launchYear}
          onChange={(e) => setLaunchYear(e.target.value)}
          aria-label="Filter by launch year"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year} className="dark:bg-gray-900">
              {year}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-900"
            checked={onlySuccessful}
            onChange={(e) => setOnlySuccessful(e.target.checked)}
            aria-label="Show only successful launches"
          />
          <span>Show only successful launches</span>
        </label>
        <label className="inline-flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-900"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            aria-label="Show only favorite launches"
          />
          <span>Show only favorite launches</span>
        </label>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
          ))}
        </div>
      )}
      {error && (
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      )}

      {!loading && !error && (
        <LaunchList launches={currentLaunches} onLaunchSelect={setSelectedLaunch} />
      )}

      {/* Pagination Controls */}
      <nav className="flex justify-center items-center space-x-2 mt-6" aria-label="Pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-indigo-200 dark:bg-indigo-700 disabled:opacity-50"
        >
          Prev
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 rounded ${
              number === currentPage
                ? "bg-indigo-600 text-white"
                : "bg-indigo-200 dark:bg-indigo-700 dark:text-gray-200"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-indigo-200 dark:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </nav>

      {selectedLaunch && (
        <div
          className="fixed inset-0 bg-indigo-800 bg-opacity-80 flex justify-center items-center p-6 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="launch-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-auto max-h-[90vh] border-2 border-indigo-200 dark:border-indigo-600">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => setSelectedLaunch(null)}
              aria-label="Close launch details modal"
            >
              ✕
            </button>
            <h2
              id="launch-title"
              className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-gray-100"
            >
              {selectedLaunch.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Date:</strong> {new Date(selectedLaunch.date_utc).toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Status:</strong> {selectedLaunch.success ? "Success" : "Failure"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedLaunch.details || "No details available."}
            </p>
            {selectedLaunch.links.wikipedia && (
              <a
                href={selectedLaunch.links.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                Wikipedia
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
