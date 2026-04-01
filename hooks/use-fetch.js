"use client";

import { useState } from "react";

export default function useFetch(fn) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (params) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fn(params); // 🔥 IMPORTANT: no wrapping
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
    fn: execute,
  };
}
