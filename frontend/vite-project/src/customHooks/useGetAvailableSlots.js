import { useEffect, useState } from "react";

const useGetAvailableSlots = (courseId) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      console.log("No courseId provided");
      setLoading(false);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `http://localhost:3000/api/availability/course/${courseId}`;
        console.log("Fetching slots from:", url);
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available slots response:", data);
        if (response.ok) {
          console.log("Slots fetched successfully:", data.data);
          setSlots(data.data || []);
        } else {
          console.log("Error response from API:", data.message);
          setError(data.message || "Failed to fetch slots");
          setSlots([]);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError(err.message);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [courseId]);

  return { slots, loading, error };
};

export default useGetAvailableSlots;
