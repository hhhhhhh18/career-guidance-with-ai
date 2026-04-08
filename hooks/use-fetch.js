"use client";

import { useState } from "react";

export default function useFetch(fn) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Use ...args to accept ANY number of arguments and pass them all through
  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fn(...args); // ✅ spread all args to the function
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