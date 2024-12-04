
export const getFromLocalStorage = <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  return null;
};

  
  // Utility function to set data to localStorage
  export const setToLocalStorage = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  