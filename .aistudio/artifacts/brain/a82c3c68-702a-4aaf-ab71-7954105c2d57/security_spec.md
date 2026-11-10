# Security Specification: Byeongdol Investment (Phase 1)

This document outlines the security invariants and hardening plan for the Firestore implementation.

## 1. Data Invariants
- **Identity Integrity**: All user-owned documents (e.g., `watchlists`, `virtualHoldings`, `gameHistory`) MUST be tied to the `uid` of the authenticated user.
- **Relational Integrity**: Access to resources must be verified against the authenticated user's ID.
- **Admin Isolation**: Only designated administrator UIDs (or emails verified via auth lookup) can perform system-wide management actions.

## 2. The "Dirty Dozen" Payloads (Examples to Test)
1. **Identity Spoofing**: Attempt to update another user's `virtualHoldings` by changing the `uid` field.
2. **Admin Privilege Escalation**: Attempt to write to `adminSettings` as a standard user.
3. **Ghost Field Injection**: Add `role: "admin"` to a `user` document creation.
4. **Invalid ID Injection**: Pass a 2KB string as a `documentId` for a `get` request.
5. **PII Leak**: Attempt to read another user's `users/{userId}/private` data.
6. **Terminal State Modification**: Attempt to update a `gameHistory` that is already marked `status: "finished"`.
7. **Orphaned Record Creation**: Create a `watchlist` entry without a valid owner `uid`.
8. **Timestamp Tampering**: Set `createdAt` to a future date.
9. **Invalid Schema Update**: Attempt to update a `stock` document with a non-numeric `price` field.
10. **Chat Restriction Bypass**: Attempt to send a message as a user who has an entry in `chatRestrictions`.
11. **Bulk Operation Abuse**: Attempt a `list` query on `chatMessages` without restricting by `roomId`.
12. **Self-Assigned Role**: During user registration, set `role` to `admin` in the payload.

## 3. Security Analysis of Existing Rules
- **Issues Found**:
    - Missing `isValidId()` in several collections.
    - Blanket `allow read` on collections that may contain user-specific or sensitive data.
    - `isAdmin()` function relies on client-token emails, which can be spoofed if `email_verified` is not checked.
    - Schema validation helpers (`isValid[Entity]`) are largely absent, relying on simple field checks.
