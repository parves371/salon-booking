export const getFromLocalStorage = <T>(key: string): T | null => {
  // Check if we're on the client side
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  }
  return null;
};

export const setToLocalStorage = <T>(key: string, data: T): void => {
  // Check if we're on the client side
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
