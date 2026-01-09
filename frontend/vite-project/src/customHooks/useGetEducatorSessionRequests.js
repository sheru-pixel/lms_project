import { useEffect, useState } from "react";

const useGetEducatorSessionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/session/educator/requests",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRequests(data.data);
        } else {
          setError(data.message || "Failed to fetch requests");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return { requests, loading, error, setRequests };
};

export default useGetEducatorSessionRequests;
