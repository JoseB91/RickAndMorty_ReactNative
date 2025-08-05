import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as Crypto from 'expo-crypto';

// Define types for better type safety
type SQLResultSet = {
  insertId?: number;
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
  rowsAffected: number;
};

type SQLTransaction = {
  executeSql: (
    sql: string,
    args?: any[],
    success?: (tx: SQLTransaction, result: SQLResultSet) => void,
    error?: (tx: SQLTransaction, error: any) => boolean | void
  ) => void;
};

const DATABASE_NAME = 'rick_and_morty.db';
const DATABASE_VERSION = '1.0';

export const getSQLiteDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }

  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${sqliteDir}/${DATABASE_NAME}`;
  
  // Open or create the database using openDatabaseSync with the correct path
  const db = SQLite.openDatabaseSync(dbPath);
  
  // Initialize the database schema if needed
  await initDatabase(db);
  
  return db;
};

// Extend the SQLiteDatabase type to include the transaction method
interface SQLiteDatabaseWithTransaction extends SQLite.SQLiteDatabase {
  transaction: (
    callback: (tx: SQLTransaction) => void,
    error?: (error: any) => void,
    success?: () => void
  ) => void;
}

const initDatabase = (db: SQLite.SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Cast to our extended type to include the transaction method
    (db as unknown as SQLiteDatabaseWithTransaction).transaction(
      (tx) => {
        // Create cache table for query persistence
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS query_cache (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL,
            timestamp INTEGER NOT NULL
          )`,
          [],
          (_, result) => {
            // Create index after table is created
            tx.executeSql(
              'CREATE INDEX IF NOT EXISTS idx_timestamp ON query_cache (timestamp)',
              [],
              (_, result) => {
                // Successfully created index
                resolve();
              },
              (_, error) => {
                console.error('Error creating index:', error);
                reject(error);
                return false;
              }
            );
          },
          (_, error) => {
            console.error('Error creating query_cache table:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      },
      () => {
        // Transaction completed successfully
        resolve();
      }
    );
  });
};

// Helper function to generate cache key from query key
export const generateCacheKey = async (queryKey: any[]): Promise<string> => {
  const keyString = JSON.stringify(queryKey);
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, keyString);
};
