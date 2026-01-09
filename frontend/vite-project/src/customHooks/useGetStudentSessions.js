import { useEffect, useState } from "react";

const useGetStudentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/session/my-requests",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSessions(data.data);
        } else {
          setError(data.message || "Failed to fetch sessions");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, loading, error, setSessions };
};

export default useGetStudentSessions;
