import { cryptoMasterService } from './server/cryptoMasterService';

async function testCryptoSearch() {
  console.log('Testing Crypto search for "비트코인"...');
  const cryptoResults = await cryptoMasterService.search('비트코인', { limit: 10 });
  console.log('Crypto Results:', JSON.stringify(cryptoResults, null, 2));

  console.log('Testing Crypto search for "wax"...');
  const waxResults = await cryptoMasterService.search('wax', { limit: 10 });
  console.log('WAX Results:', JSON.stringify(waxResults, null, 2));
}

testCryptoSearch();
