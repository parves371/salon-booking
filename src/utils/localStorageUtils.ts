// Utility function to get data from localStorage
export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  }
  return null;
};

  
  // Utility function to set data to localStorage
  export const setToLocalStorage = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  