import { Song, NewSong } from '../types';

class TabDB {
  private readonly dbName = 'TabDB';
  private readonly version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('tabs')) {
          const store = db.createObjectStore('tabs', {
            keyPath: 'id'
          });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('artist', 'artist', { unique: false });
          store.createIndex('lastPlayed', 'lastPlayed', { unique: false });
        }
      };
    });
  }

  async getAllTabs(): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('tabs', 'readonly');
      const store = transaction.objectStore('tabs');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result.map(tab => ({
          ...tab,
          lastPlayed: new Date(tab.lastPlayed)
        })));
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async addTab(newTab: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('tabs', 'readwrite');
      const store = transaction.objectStore('tabs');
      const request = store.add(newTab);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateTab(tab: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('tabs', 'readwrite');
      const store = transaction.objectStore('tabs');
      const request = store.put(tab);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteTab(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('tabs', 'readwrite');
      const store = transaction.objectStore('tabs');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updatePracticeTime(id: string, sessionDuration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction('tabs', 'readwrite');
      const store = transaction.objectStore('tabs');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const tab = getRequest.result;
        if (tab) {
          tab.totalPracticeTime = (tab.totalPracticeTime || 0) + sessionDuration;
          tab.lastPlayed = new Date();
          const updateRequest = store.put(tab);
          
          updateRequest.onsuccess = () => {
            resolve();
          };

          updateRequest.onerror = () => {
            reject(updateRequest.error);
          };
        } else {
          reject(new Error('Tab not found'));
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  }
}

export const tabDB = new TabDB();
