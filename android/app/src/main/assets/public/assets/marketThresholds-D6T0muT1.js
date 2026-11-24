//#region src/utils/marketThresholds.ts
/**
* Market Alert and Screening Thresholds
* 
* Criteria:
* - 급등: +5% 이상
* - 급락: -5% 이하
* - 거래량 급증: 평균 거래량 대비 200% 이상
*/
var MARKET_THRESHOLDS = {
	SURGE_GAIN: 5,
	SURGE_LOSS: -5,
	VOLUME_SURGE: 200
};
function isSurgeGain(changePercent) {
	return changePercent >= MARKET_THRESHOLDS.SURGE_GAIN;
}
function isSurgeLoss(changePercent) {
	return changePercent <= MARKET_THRESHOLDS.SURGE_LOSS;
}
function isVolumeSurge(volumeRatio) {
	return (volumeRatio ?? 0) >= MARKET_THRESHOLDS.VOLUME_SURGE;
}
//#endregion
export { isSurgeLoss as n, isVolumeSurge as r, isSurgeGain as t };
