import fs from 'fs';
import path from 'path';
import { db } from './index';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  console.log('Running migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`  Running: ${file}`);
    await db.query(sql);
    console.log(`  Done: ${file}`);
  }

  console.log('All migrations complete.');
  await db.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});