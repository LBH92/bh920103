import { adService } from './src/services/adService';

export const seedAds = async () => {
    await adService.addAd({
        name: '첫 번째 테스트 광고',
        advertiser: '병돌 투자',
        type: 'image',
        location: 'top_banner',
        url: 'https://google.com',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        priority: 1,
        isActive: true,
    });
    console.log('Ads seeded');
};
