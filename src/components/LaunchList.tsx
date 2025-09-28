import React from "react";
import { Launch } from "../hooks/useFetchLaunches";
import LaunchCard from "./LaunchCard";

interface LaunchListProps {
  launches: Launch[];
  onLaunchSelect: (launch: Launch) => void;
}

const LaunchList: React.FC<LaunchListProps> = ({ launches, onLaunchSelect }) => {
  if (!launches.length) {
    return <p>No launches available.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {launches.map((launch) => (
        <LaunchCard
          key={launch.id}
          launch={launch}
          onClick={() => onLaunchSelect(launch)}
        />
      ))}
    </div>
  );
};

export default LaunchList;
