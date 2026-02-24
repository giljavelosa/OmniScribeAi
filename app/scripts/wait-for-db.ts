import pg from 'pg';

const { Client } = pg;

async function waitForDatabase() {
  const maxRetries = 30;
  const retryDelay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'omniscribe_test',
      user: 'omniscribe',
      password: 'omniscribe_local_pass',
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      console.log('Database is ready!');
      process.exit(0);
    } catch {
      await client.end().catch(() => {});
      console.log(`Waiting for database... (attempt ${i + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  console.error('Database failed to become ready in time');
  process.exit(1);
}

waitForDatabase();
