# Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default-Deny Net**: `/{document=**}` forbids all reads and writes unless explicitly matched below.
2. **PII Split Isolation**: User email addresses reside strictly inside `/users/{uid}/private/info`, never in `/users/{uid}` or shared collections. Only the owning UID or verified admin can read/write `/users/{uid}/private/info`.
3. **No Self-Assigned Admin/Director Escalation**: On `/users/{uid}` creation, non-admin users may only choose non-privileged workspace roles (`analyst` or `cooperative`). Only verified admins (via `/admins/{uid}` or verified runtime bootstrap email `Gelasemi@gmail.com`) can hold or assign `director` role. Users cannot mutate `role` on `/users/{uid}` self-updates.
4. **Immutable Ownership & Server Timestamps**: `ownerUid`, `uid`, and `createdAt == request.time` are strictly enforced on create and frozen (`incoming().ownerUid == existing().ownerUid`, `incoming().createdAt == existing().createdAt`) on update; `updatedAt == request.time`.
5. **Terminal State Locking on Cooperative Dossiers**: Once `status` becomes `approved` or `rejected`, non-admin users cannot mutate or delete the dossier. Only `draft` -> `submitted` transitions are permitted by the dossier owner; `submitted` -> `approved`/`rejected` is reserved for verified admins (`isDirectorOrAdmin()`).
6. **Strict List Enforcement**: `allow list` never trusts client queries blindly; non-admins can only list documents where `resource.data.ownerUid == request.auth.uid`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Self-Role Escalation**: Non-admin user creates `/users/{uid}` with `role: "director"`.
2. **Profile Role Tampering**: User updates `/users/{uid}` adding/modifying `role` key.
3. **Ghost Shadow Field**: User writes `/analyses/{id}` with extra `{ isApproved: true }`.
4. **Owner Spoofing**: User creates `/analyses/{id}` with `ownerUid: "victim_uid"`.
5. **Client Timestamp Forgery**: User creates `/chat_logs/{id}` with `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time`.
6. **ID Poisoning**: Write to `/analyses/aaa...200chars` or `/analyses/bad$id`.
7. **PII Cross-Read**: User A attempts `get` on `/users/{userB}/private/info`.
8. **Unverified Email Spoof**: Request where `token.email == "Gelasemi@gmail.com"` but `token.email_verified == false`.
9. **Terminal State Bypass**: Cooperative owner modifies `requestedMUsd` after `status == "approved"`.
10. **Owner Approves Own Dossier**: Cooperative owner updates `status` directly from `"draft"` to `"approved"`.
11. **Oversized Payload DoW**: User writes a 10,000-character `summary` in `/analyses/{id}` (limit 2,500).
12. **Blanket Collection Scrape**: Non-admin executes unscoped `list` on `/cooperative_dossiers` without `ownerUid == auth.uid`.
