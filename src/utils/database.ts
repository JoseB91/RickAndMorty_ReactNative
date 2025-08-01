import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as Crypto from 'expo-crypto';

const DATABASE_NAME = 'rick_and_morty.db';
const DATABASE_VERSION = '1.0';

export const getSQLiteDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }

  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${sqliteDir}/${DATABASE_NAME}`;
  
  // Open or create the database
  const db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION);
  
  // Initialize the database schema if needed
  await initDatabase(db);
  
  return db;
};

const initDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        // Create cache table for query persistence
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS query_cache (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL,
            timestamp INTEGER NOT NULL
          )`,
          [],
          () => {
            // Create indexes
            tx.executeSql(
              'CREATE INDEX IF NOT EXISTS idx_timestamp ON query_cache (timestamp)'
            );
          },
          (_, error) => {
            console.error('Error creating query_cache table:', error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error initializing database:', error);
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

// Helper function to generate cache key from query key
export const generateCacheKey = (queryKey: any[]): string => {
  const keyString = JSON.stringify(queryKey);
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, keyString);
};
