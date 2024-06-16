import DatabaseService from './dbService';

class KeyValueStore {
  private dbPromise = DatabaseService.getDbInstance();

  // 设置键值对
  public async set(key: string, value: string): Promise<void> {
    const db = await this.dbPromise;
    try {
      await db.execute('REPLACE INTO key_value (key, value) VALUES (?, ?)', [key, value]);
    } catch (error) {
      console.error(`Error setting value for key "${key}":`, error);
      throw error; // 抛出异常以便外部处理
    }
  }

  // 获取键的值
  public async get(key: string): Promise<string | null> {
    const db = await this.dbPromise;
    try {
      const result = await db.select<{ value: string }[]>('SELECT value FROM key_value WHERE key = ?', [key]);
      return result.length > 0 ? result[0].value : null;
    } catch (error) {
      console.error(`Error getting value for key "${key}":`, error);
      throw error; // 抛出异常以便外部处理
    }
  }

  // 删除键值对
  public async delete(key: string): Promise<void> {
    const db = await this.dbPromise;
    try {
      await db.execute('DELETE FROM key_value WHERE key = ?', [key]);
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
      throw error; // 抛出异常以便外部处理
    }
  }

  // 获取所有键值对
  public async getAll(): Promise<{ key: string; value: string }[]> {
    const db = await this.dbPromise;
    try {
      const result = await db.select<{ key: string; value: string }[]>('SELECT key, value FROM key_value');
      return result;
    } catch (error) {
      console.error("Error getting all key-value pairs:", error);
      throw error; // 抛出异常以便外部处理
    }
  }
}

export default KeyValueStore;
