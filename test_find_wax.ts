import { cryptoMasterService } from './server/cryptoMasterService';

async function testFindWax() {
  // @ts-ignore
  const allCoins = cryptoMasterService.allCoins;
  const waxCoins = allCoins.filter(c => c.name.toLowerCase().includes('wax') || c.baseAsset.toLowerCase().includes('wax'));
  console.log('Wax coins found:', JSON.stringify(waxCoins, null, 2));
}

testFindWax();
