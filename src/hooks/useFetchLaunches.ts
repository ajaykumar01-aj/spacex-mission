import { useState, useEffect } from "react";

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  rocket: string; // rocket id
  rocketName?: string;
  links: {
    patch: { small: string | null };
    webcast: string | null;
    wikipedia: string | null;
  };
  details: string | null;
}

export const useFetchLaunches = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [launchesRes, rocketsRes] = await Promise.all([
          fetch("https://api.spacexdata.com/v4/launches"),
          fetch("https://api.spacexdata.com/v4/rockets"),
        ]);

        if (!launchesRes.ok || !rocketsRes.ok) {
          throw new Error("Failed to fetch data from SpaceX API");
        }
        const launchesData = await launchesRes.json();
        const rocketsData = await rocketsRes.json();

        const rocketMap: Record<string, string> = {};
        rocketsData.forEach((rocket: { id: string; name: string }) => {
          rocketMap[rocket.id] = rocket.name;
        });

        const launchesWithRocketName = launchesData.map((launch: Launch) => ({
          ...launch,
          rocketName: rocketMap[launch.rocket],
        }));

        setLaunches(launchesWithRocketName);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { launches, loading, error };
};

