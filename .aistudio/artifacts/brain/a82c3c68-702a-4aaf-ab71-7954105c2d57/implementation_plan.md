# Comprehensive Stabilization and Enhancement Plan: Byeongdol Investment

This plan outlines the two-track approach to audit, stabilize, and enhance the Byeongdol Investment platform.

## User Review & Critical Decisions

> [!IMPORTANT]
> The stabilization (Track A) must be verified through regression testing before advancing through the enhancement (Track B) milestones.

- **Track A (Stabilization) Focus**: Security, Auth, Data Accuracy, Admin Stability.
- **Track B (Enhancement) Focus**: Core Trading, Community, Gamification, Operational Automation.
- **Verification Rule**: No new feature in Track B can be marked as complete unless the security/stability preconditions in Track A (related to that feature) are verified.

## 1. Overview & Core Concept

- **What It Does**: Transforms the platform into a high-performance, secure, and intuitive investment hub.
- **Goal**: Resolve technical debt (security, stability, performance) while incrementally introducing requested high-value features.

## 2. User Experience & Visual Design

- **Aesthetic Direction**: Minimal, clean, professional investment dashboard.
- **Consistency**: Enforce 60-30-10 color budget. Standardize all metadata to clean, unboxed text (zero-pill discipline).
- **Responsive**: PC (1440px), Tablet, Mobile support via Tailwind.

## 3. Key Product Decisions & Trade-Offs

- **Decision: Phased Stabilization**: Audit each module before applying fixes.
- **Decision: Firestore Logging**: Admin logs must remain persistent to guarantee auditing integrity.
- **Trade-off**: Feature velocity may be slower in early stages to prioritize security and performance stability.

## 4. Technical Architecture & Data Strategy

```text
┌──────────────────────┐
│  Client (React/Vite) │
└──────────┬───────────┘
           │ (REST / SSE)
┌──────────▼───────────┐
│   Express Backend    │ (server.ts)
└────┬────────────┬────┘
     │            │
┌────▼────┐ ┌─────▼─────┐
│ Firebase│ │ MarketAPI │ (Kiwoom/Upbit/Crypto)
└─────────┘ └───────────┘
```

### Milestones & Roadmap

1. **Phase 1: Critical Stabilization** (Track A: Security/Auth)
2. **Phase 2: Data & Performance** (Track A: Performance/Accuracy)
3. **Phase 3: UI/UX & Admin Panel** (Track A: UI/UX, AdminStability)
4. **Phase 4: Core Service Enhancement** (Track B: Market Services)
5. **Phase 5: Community & Gamification** (Track B: Community, Games)
6. **Phase 6: Infrastructure & Automation** (Track B: Operational Infra)

### Audit & Verification Methodology
For each area:
1. **Analyze**: Current state, identify gaps against requirements.
2. **List**: Create issue tickets in project tracking.
3. **Fix**: Apply minimal, surgical code changes.
4. **Regress**: Full regression test of affected module + dependent modules.
5. **Report**: Verify status.
