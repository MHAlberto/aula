const DB_NAME = 'aula-attendance';
const VERSION = 1;
const STORES = ['classes', 'students', 'periods', 'sessions', 'attendance', 'logs', 'settings'];

const request = (req) => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

export const db = {
  open() {
    if (this.connection) return Promise.resolve(this.connection);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const database = req.result;
        STORES.forEach((name) => {
          if (!database.objectStoreNames.contains(name)) {
            const store = database.createObjectStore(name, { keyPath: 'id' });
            if (name === 'students') store.createIndex('classId', 'classId');
            if (name === 'periods') store.createIndex('studentId', 'studentId');
            if (name === 'sessions') store.createIndex('classId', 'classId');
            if (name === 'attendance') { store.createIndex('sessionId', 'sessionId'); store.createIndex('studentId', 'studentId'); }
            if (name === 'logs') store.createIndex('createdAt', 'createdAt');
          }
        });
      };
      req.onsuccess = () => { this.connection = req.result; this.connection.onclose = () => { this.connection = null; }; resolve(this.connection); };
      req.onerror = () => reject(req.error);
    });
  },
  async all(storeName) { const database = await this.open(); return request(database.transaction(storeName, 'readonly').objectStore(storeName).getAll()); },
  async get(storeName, id) { const database = await this.open(); return request(database.transaction(storeName, 'readonly').objectStore(storeName).get(id)); },
  async put(storeName, value) { const database = await this.open(); return request(database.transaction(storeName, 'readwrite').objectStore(storeName).put(value)); },
  async remove(storeName, id) { const database = await this.open(); return request(database.transaction(storeName, 'readwrite').objectStore(storeName).delete(id)); },
  async clear(storeName) { const database = await this.open(); return request(database.transaction(storeName, 'readwrite').objectStore(storeName).clear()); },
  async replaceAll(data) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(STORES, 'readwrite');
      STORES.forEach((name) => { const store = tx.objectStore(name); store.clear(); (data[name] || []).forEach(item => store.put(item)); });
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
  },
  async dump() { const result = {}; for (const store of STORES) result[store] = await this.all(store); return result; }
};

export const STORES_LIST = STORES;
