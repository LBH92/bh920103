
import { matchHangulSearch } from './src/utils/hangul';

const name = '엔비디아';
const query = '엔비디아';
console.log(`Match: ${matchHangulSearch(name, query)}`);
console.log(`Match partial: ${matchHangulSearch(name, '엔비')}`);
