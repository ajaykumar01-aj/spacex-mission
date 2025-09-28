import React from "react";
import { Launch } from "../hooks/useFetchLaunches";
import { useFavorites } from "../context/FavoritesContext";

interface LaunchCardProps {
  launch: Launch;
  onClick: () => void;
}

const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onClick }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(launch.id);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer relative border-2 border-indigo-100 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-700 p-6"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(launch.id);
        }}
        aria-label={favorite ? "Remove favorite" : "Add to favorites"}
        className={`absolute top-4 right-4 focus:outline-none ${
          favorite ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"
        } hover:text-yellow-500 transition`}
      >
        ★
      </button>
      <div className="flex items-center space-x-6">
        {launch.links.patch.small ? (
          <img
            src={launch.links.patch.small}
            alt={`${launch.name} patch`}
            className="w-20 h-20 rounded-lg shadow-lg bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-700 dark:to-purple-900"
          />
        ) : (
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-700 rounded-lg flex items-center justify-center text-indigo-400 dark:text-indigo-300">
            No Image
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-200">
            {launch.name}
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400 font-semibold mt-1">
            Date: {new Date(launch.date_utc).toLocaleDateString()}
          </p>
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mt-1">
            Rocket: {launch.rocketName || "Unknown"}
          </p>
          <p
            className={`text-sm font-semibold mt-1 ${
              launch.success === null
                ? "text-gray-500 dark:text-gray-400"
                : launch.success
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            Status:{" "}
            {launch.success === null
              ? "Unknown"
              : launch.success
              ? "Success"
              : "Failure"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaunchCard;
