import { execaCommand } from 'execa'
import 'dotenv/config'

export async function setup() {
	const databaseUrl = process.env.DATABASE_URL

	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set')
	}

	await execaCommand(
		'npx prisma migrate reset --force --skip-seed --skip-generate',
		{
			stdio: 'inherit',
			env: {
				...process.env,
				DATABASE_URL: databaseUrl,
			},
		},
	)
}
