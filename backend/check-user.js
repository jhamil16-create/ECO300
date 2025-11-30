require('dotenv').config();
const { Client } = require('pg');

async function checkUser() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('✓ Connected to database\n');

        // Check if user exists
        const result = await client.query(
            'SELECT id, username, password FROM "Usuario" WHERE username = $1',
            ['admin@test.com']
        );

        if (result.rows.length === 0) {
            console.log('❌ User admin@test.com NOT FOUND in database!');
            console.log('\nRecreating user...');

            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash('123456', 10);

            const insertResult = await client.query(
                'INSERT INTO "Usuario" (username, password, "createdAt") VALUES ($1, $2, NOW()) RETURNING id, username',
                ['admin@test.com', passwordHash]
            );

            console.log('✓ User created:');
            console.log('  ID:', insertResult.rows[0].id);
            console.log('  Username:', insertResult.rows[0].username);
        } else {
            console.log('✓ User found in database:');
            console.log('  ID:', result.rows[0].id);
            console.log('  Username:', result.rows[0].username);
            console.log('  Password hash:', result.rows[0].password.substring(0, 20) + '...');
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const userResult = await client.query(
            'SELECT password FROM "Usuario" WHERE username = $1',
            ['admin@test.com']
        );

        const isValid = await bcrypt.compare('123456', userResult.rows[0].password);
        console.log('\n🔐 Password verification:');
        console.log('  Password "123456" is', isValid ? '✓ VALID' : '❌ INVALID');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkUser();
