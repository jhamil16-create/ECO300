// Quick script to create admin user in database
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function createAdminUser() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('✓ Connected to database');

        // Hash the password '123456'
        const passwordHash = await bcrypt.hash('123456', 10);
        console.log('✓ Password hashed');

        // Create the usuario table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS "Usuario" (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✓ Usuario table ensured');

        // Insert admin user
        const result = await client.query(
            `INSERT INTO "Usuario" (username, password, "createdAt")
             VALUES ($1, $2, NOW())
             ON CONFLICT (username) DO UPDATE SET password = $2
             RETURNING id, username`,
            ['admin@test.com', passwordHash]
        );

        console.log('✓ Admin user created/updated:');
        console.log(`  ID: ${result.rows[0].id}`);
        console.log(`  Username: ${result.rows[0].username}`);
        console.log('\n✅ You can now login with:');
        console.log('  admin@test.com / 123456');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createAdminUser();
