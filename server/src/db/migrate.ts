import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { ensureDataDir, getDbPath, getSqlite } from './index'

dotenv.config()

const dbPath = getDbPath()
ensureDataDir(dbPath)

console.log('Running migrations manually...')

// Manually apply the init migration due to multi-statement issues with better-sqlite3 + drizzle migrate
try {
	const sqlite = getSqlite()
	const migrationPath = path.join(process.cwd(), 'drizzle', '0000_init.sql')

	if (fs.existsSync(migrationPath)) {
		console.log(`Applying migration: ${migrationPath}`)
		const sql = fs.readFileSync(migrationPath, 'utf-8')
		sqlite.exec(sql)
		console.log('Migrations applied successfully.')
	} else {
		console.error(`Migration file not found at: ${migrationPath}`)
		process.exit(1)
	}
} catch (error) {
	console.error('Migration failed:', error)
	// If the error is "table already exists", we can probably ignore it for now or handle it gracefully
	if (error instanceof Error && error.message.includes('already exists')) {
		console.log('Tables already exist, skipping...')
	} else {
		process.exit(1)
	}
}
