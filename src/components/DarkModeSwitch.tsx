import React from "react";
import { useTheme } from "../context/ThemeContext";

const DarkModeSwitch: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      role="switch"
      aria-checked={darkMode}
      aria-label="Toggle dark mode"
    >
      <span
        className={`${
          darkMode ? "translate-x-6 bg-indigo-600" : "translate-x-1 bg-gray-300"
        } inline-block w-4 h-4 transform rounded-full transition`}
      />
      <span className="sr-only">Toggle dark mode</span>
    </button>
  );
};

export default DarkModeSwitch;
