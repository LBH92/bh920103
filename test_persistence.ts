import { userAiVaultService } from './server/userAiVaultService';
import { adminDb } from './server/firebaseAdmin';

async function testPersistenceAndSecurity() {
  const UID_1 = 'test-user-1';
  const UID_2 = 'test-user-2';
  // Use a mockable approach to test persistence without triggering real API validation
  // during this integration test phase.
  console.log('--- Starting Integration Test ---');

  // 1. Cleanup
  await adminDb.collection('userGeminiKeys').doc(UID_1).delete();
  await adminDb.collection('userGeminiKeys').doc(UID_2).delete();
  console.log('Cleanup complete.');

  // 2. Direct Firestore Insert (bypass API validation for persistence test)
  console.log('Simulating key registration via Firestore for UID_1...');
  await adminDb.collection('userGeminiKeys').doc(UID_1).set({
    uid: UID_1,
    encryptedKey: 'mock-ciphertext',
    iv: 'mock-iv',
    authTag: 'mock-authTag',
    keyMasked: 'AIza...890',
    model: 'gemini-3.8-flash',
    connectedAt: new Date().toISOString(),
    callCount: 0
  });

  // 3. Persistence Test
  const status = await userAiVaultService.getConnectionStatus(UID_1);
  console.log('Status retrieved for UID_1:', status.connected ? 'Connected' : 'Not Connected');
  if (!status.connected) throw new Error('Persistence failed: Status not connected');

  // 4. Isolation Test
  const status2 = await userAiVaultService.getConnectionStatus(UID_2);
  console.log('Status for UID_2:', status2.connected ? 'Connected' : 'Not Connected');
  if (status2.connected) throw new Error('Isolation failed: UID_2 accessed UID_1 key');

  // 5. Cleanup
  await adminDb.collection('userGeminiKeys').doc(UID_1).delete();
  console.log('--- Integration Test Passed ---');
}

testPersistenceAndSecurity().catch(console.error);
