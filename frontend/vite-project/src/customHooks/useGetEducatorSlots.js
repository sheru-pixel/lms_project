import { useEffect, useState } from "react";

const useGetEducatorSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "http://localhost:3000/api/availability/educator/slots",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSlots(data.data || []);
        } else {
          console.error("Failed to fetch slots:", data.message);
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
  }, []);

  return { slots, loading, error, setSlots };
};

export default useGetEducatorSlots;
