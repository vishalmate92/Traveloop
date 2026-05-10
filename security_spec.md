# Security Specification for Traveloop

## 1. Data Invariants
- A Trip must have an `ownerId` matching the creator's UID.
- A Trip's `startDate` must be <= `endDate`.
- Users can only read trips they own or that are shared with them (or public).
- Only the owner can delete a trip.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to create a trip with an `ownerId` that doesn't match the authenticated user.
2. **Unauthorized Read**: Attempt to read a private trip belonging to another user.
3. **Unauthorized Update**: Attempt to update another user's trip.
4. **Unauthorized Delete**: Attempt to delete another user's trip.
5. **Shadow Fields**: Creating a trip with extra fields like `isSystemAdmin: true`.
6. **Type Mismatch**: Sending a string for a budget total.
7. **Size Attack**: Sending an extremely long string for the `title`.
8. **ID Poisoning**: Using a 1MB string as the `tripId`.
9. **Role Escalation**: Attempting to add self to `sharedWith` of someone else's trip.
10. **State Corruption**: Changing `ownerId` during an update.
11. **PII Leak**: Accessing user emails if they were stored in a collection with blanket reads.
12. **No Auth Write**: Attempting to create a trip without being signed in.

## 3. Test Runner (Mock)
A test suite will verify all these fail.
