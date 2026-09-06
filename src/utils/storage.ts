// IndexedDB Operations for offline support
const DB_NAME = 'budget-buddy';
const DB_VERSION = 1;

export const initializeDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' });
      }
    };
  });
};

export const saveToCache = async (
  storeName: string,
  data: any
): Promise<void> => {
  const db = await initializeDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = Array.isArray(data)
      ? data.reduce((req, item) => store.put(item), store.put(data[0]))
      : store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getFromCache = async (
  storeName: string,
  key?: string
): Promise<any> => {
  const db = await initializeDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = key ? store.get(key) : store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const clearCache = async (storeName: string): Promise<void> => {
  const db = await initializeDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Local storage helpers
export const saveUserPreference = (key: string, value: any): void => {
  localStorage.setItem(`budget-buddy-${key}`, JSON.stringify(value));
};

export const getUserPreference = (key: string): any => {
  const value = localStorage.getItem(`budget-buddy-${key}`);
  return value ? JSON.parse(value) : null;
};

export const removeUserPreference = (key: string): void => {
  localStorage.removeItem(`budget-buddy-${key}`);
};

export const clearUserPreferences = (): void => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('budget-buddy-')) {
      localStorage.removeItem(key);
    }
  });
};
