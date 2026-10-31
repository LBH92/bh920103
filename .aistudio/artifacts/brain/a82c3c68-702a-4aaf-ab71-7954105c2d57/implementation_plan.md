# Implementation Plan: Historical Investment Profit Simulator

## Goal
Implement a historical investment profit simulator in the Stock Insight project that allows users to simulate lump-sum and recurring investments using historical stock data, including MDD and CAGR calculation, and corporate action adjustment (where feasible).

## 1. Simulation Engine Enhancement
- Extend `src/services/historicalSimulationService.ts`:
  - Add support for recurring investments (e.g., monthly contribution).
  - Implement MDD (Maximum Drawdown) calculation based on historical candle data.
  - Implement Annualized Return (CAGR) calculation.
  - Add logic to handle corporate action adjustments (if candles are adjusted, use them directly; otherwise, note the limitation).
  - Ensure decoupled execution (no modification to actual `portfolioService` balances).

## 2. Frontend Implementation
- Create a new UI component for the Simulator:
  - Input form: Stock symbol search, Investment amount, Type (Lump-sum / Recurring), Date range (Start/End).
  - Results display: Summary cards (Total Invested, Final Value, Profit, CAGR), MDD chart, and growth line chart.
  - Use existing charting components where applicable.

## 3. Verification & Testing
- Validate calculations against known historical examples.
- Ensure MDD and CAGR are correctly computed.
- Verify simulation results do not affect actual account balances.

## 4. Constraints & Rules
- Reuse existing service layers (`historicalSimulationService`, `stockRepository`).
- Maintain existing UI design and data principles.
- No look-ahead bias in simulation.
- Clear distinction between historical reality and simulation estimates.
