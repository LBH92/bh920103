import { usStockSearchService } from './server/usStockMaster';
import { cryptoMasterService } from './server/cryptoMasterService';

async function testSearch() {
  console.log('Testing US Stock search for "soxl"...');
  const usResults = await usStockSearchService.search('soxl', 10);
  console.log('US Results:', JSON.stringify(usResults, null, 2));

  console.log('Testing Crypto search for "왁스"...');
  const cryptoResults = await cryptoMasterService.search('왁스', { limit: 10 });
  console.log('Crypto Results:', JSON.stringify(cryptoResults, null, 2));
}

testSearch();
