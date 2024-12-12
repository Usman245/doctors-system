import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import axios from "axios";
//import { token } from "../config";
const useFecthData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userToken } = useContext(authContext);
  const { setUserData } = useContext(authContext);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let token = userToken;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        console.log(result);

        if (!res.ok) {
          throw new Error(result.message + "error");
        }

        setData(result.data);
        setUserData(result.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
  };
};

export default useFecthData;
