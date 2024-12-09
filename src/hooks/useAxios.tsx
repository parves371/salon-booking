import { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";

interface AxiosResponseData<T> {
  data: T;
  status: number;
}

const useAxios = <T,>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: object | null = null
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: AxiosResponseData<T>;

      switch (method) {
        case "POST":
          response = await axiosInstance.post(url, body);
          break;
        case "PUT":
          response = await axiosInstance.put(url, body);
          break;
        case "DELETE":
          response = await axiosInstance.delete(url);
          break;
        case "GET":
        default:
          response = await axiosInstance.get(url);
          break;
      }

      setData(response.data);
    } catch (err: any) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call the API once the hook is used
  useEffect(() => {
    fetchData();
  }, [url, method, body]);

  return { loading, error, data, fetchData };
};

export default useAxios;
