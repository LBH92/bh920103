import React from 'react';
import { StockListView } from '../stocks/StockListView';
import { SideChatPanel } from '../chat/SideChatPanel';
import { HistoricalSimulatorContent } from './HistoricalSimulatorContent';

export const HistoricalSimulatorView: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <div className="w-80 border-r dark:border-slate-800 overflow-y-auto">
                <StockListView />
            </div>
            <div className="flex-1 overflow-y-auto">
                <HistoricalSimulatorContent symbol={''} stockName={''} market={'KOSPI'} initialCandles={[]} />
            </div>
            <div className="w-[340px] border-l dark:border-slate-800">
                <SideChatPanel />
            </div>
        </div>
    );
};
