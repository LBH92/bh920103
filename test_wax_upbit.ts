import { cryptoMasterService } from './server/cryptoMasterService';

async function testWaxInUpbit() {
  // @ts-ignore
  await cryptoMasterService.syncAllMarkets();
  // @ts-ignore
  const allCoins = cryptoMasterService.allCoins;
  const waxCoins = allCoins.filter(c => c.exchange === 'UPBIT' && (c.name.toLowerCase().includes('왁스') || c.nameEn.toLowerCase().includes('wax')));
  console.log('Wax coins found in Upbit:', JSON.stringify(waxCoins, null, 2));
}

testWaxInUpbit();
