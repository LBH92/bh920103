import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './src/services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { portfolioService } from './src/services/portfolioService';

async function runTest() {
  console.log('--- Starting Robust Concurrency Test ---');
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  // 1. Authenticate
  let userCred;
  try {
    userCred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
  } catch (e: any) {
    console.error('Auth failed:', e.message);
    return;
  }
  
  const uid = userCred.user.uid;
  console.log('Authenticated UID:', uid);

  // 2. Setup (reset account)
  await portfolioService.resetMockAccount(uid);

  // 3. Concurrent Buy Request (Same key)
  const key = 'test_key_' + Date.now();
  const buyParams = {
    symbol: '005930',
    name: '삼성전자',
    market: 'KOSPI',
    price: 70000,
    quantity: 1,
    idempotencyKey: key,
    quoteTimestamp: Date.now()
  };

  console.log('Running concurrent buy attempts (Same Key)...');
  const attempts = 3;
  const results = await Promise.allSettled(
    Array(attempts).fill(0).map(() => portfolioService.executeMockBuyOrder(uid, buyParams))
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  const failCount = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Successes: ${successCount}, Failures: ${failCount}`);
  
  if (successCount === 1 && failCount === attempts - 1) {
    console.log('PASS: Idempotency worked (only 1 succeeded)');
  } else {
    console.log('FAIL: Idempotency failed');
  }

  // 4. Cleanup
  await deleteDoc(doc(db, 'mockAccounts', uid));
  // Could delete holdings/orders too
  
  console.log('--- Test Finished ---');
}

runTest().catch(console.error);
