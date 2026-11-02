# Security Specification

## 1. Data Invariants
- A user can only access their own watchlists, alerts, and virtual portfolio data.
- Only an administrator can access adminReports, adminLogs, and systemMetrics.
- Posts can only be deleted by administrators (or authors, if implemented).
- All timestamps must be server-side timestamps.

## 2. Dirty Dozen Payloads
1.  Attempt to create a watchlist entry with another user's UID.
2.  Attempt to update another user's watchlist item.
3.  Attempt to read adminReports as a standard user.
4.  Attempt to inject a 10MB string into a chat message.
5.  Attempt to set `role: 'superadmin'` in user profile update.
6.  Attempt to update `createdAt` field on a post.
7.  Attempt to delete a chat message not owned by the user (and not an admin).
8.  Attempt to read `chatRestrictions` with a non-authenticated user.
9.  Attempt to update `status` of a post via a standard user without authorization.
10. Attempt to inject SQL-like characters in `title` or `content`.
11. Attempt to create an alert with a negative target price.
12. Attempt to create a chat room with an excessively long name.

## 3. Security Audit Plan
- Implement `isValidId` and other hardening helpers in `firestore.rules`.
- Ensure all `allow` rules follow the explicit pillars of security.
- Re-run red team tests after rule updates.
