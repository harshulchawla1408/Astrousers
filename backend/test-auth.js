import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API = 'http://localhost:5000/api/users';
const TOKEN = process.env.CLERK_TEST_TOKEN; // Supply a valid Clerk JWT for testing

async function call(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; } catch { return { status: res.status, data: text }; }
}

async function run() {
  if (!TOKEN) {
    console.error('Set CLERK_TEST_TOKEN in env to run this test.');
    process.exit(1);
  }

  console.log('🧪 Auth E2E Test Starting...');

  // Sync user (create if not exists)
  let r = await call('POST', '/sync', {});
  console.log('Sync:', r.status, !!r.data?.success);

  // Get profile
  r = await call('GET', '/me');
  console.log('Profile:', r.status, r.data?.user?.clerkId, r.data?.user?.wallet);

  // Update profile
  r = await call('PATCH', '/me', { name: 'Test User From Script' });
  console.log('Update profile:', r.status, r.data?.user?.name);

  // Update wallet (increment by 5)
  r = await call('PATCH', '/wallet', { amount: 5, operation: 'increment' });
  console.log('Wallet increment:', r.status, r.data?.wallet);

  console.log('✅ Auth E2E Test Completed');
}

run();


