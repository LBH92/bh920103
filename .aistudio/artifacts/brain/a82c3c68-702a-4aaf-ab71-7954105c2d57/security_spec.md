# Security Specification: Advertisement Management

## 1. Overview
The Stock Insight project requires an administrative panel for managing advertisements and a corresponding user-facing rolling advertisement display.

## 2. Data Model
Collection: `advertisements`

### Schema (`Advertisement` Interface):
- `id`: string
- `name`: string
- `advertiser`: string
- `type`: 'image' | 'text'
- `location`: 'top_banner' | 'sidebar' | 'content_card'
- `imageUrl`: string (optional)
- `textTitle`: string (optional)
- `textDescription`: string (optional)
- `ctaText`: string (optional)
- `url`: string
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `priority`: number
- `intervalMs`: number (optional)
- `isActive`: boolean
- `createdAt`: string

## 3. Security Requirements
- **Read Access**:
    - Anyone (public) can read active advertisements (`isActive == true`) for display purposes.
    - Admins can read all advertisements.
- **Write Access**:
    - Only users with `admin` or `superadmin` role (verified via Firestore `auth.uid` check against a secure mapping, or custom claim if available) can create, update, or delete advertisements.

## 4. Access Control Logic (Firestore Rules)
```
match /advertisements/{adId} {
  allow read: if resource.data.isActive == true || isAdmin();
  allow write: if isAdmin();
}
```
*Note: `isAdmin()` helper function must be defined based on user profile roles in the `users` collection or custom auth claims.*
