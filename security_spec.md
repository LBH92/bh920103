# Security Specification: Gomoku Real-time Online Matches

## Data Invariants
1. A match cannot be created without two valid players.
2. The board state must be valid and immutable outside of allowed turns.
3. Turn updates must follow the turn-based protocol (black then white).
4. Match status must transition monotonically: `waiting` -> `playing` -> `finished`.
5. Once a status is `finished`, it cannot be updated.

## The "Dirty Dozen" Payloads (Examples)
1. Creating a match with an invalid opponent ID.
2. Updating opponent's pieces on the board.
3. Updating board state when it's not the user's turn.
4. Setting status to `finished` with no winner defined.
5. Setting status to `finished` and then trying to add a move.
6. Spoofing player ID to match another user.
7. Injecting non-string values into the board state.
8. Modifying opponent's rating or wins/losses.
9. Initiating a match with one's own UID as both players.
10. Modifying match `createdAt` timestamp.
11. Attempting a move on a `finished` match.
12. Attempting to update `rating` field directly as a user.

## Validation Helpers for Rules
```javascript
function isValidGomokuMove(board, newBoard, player) {
  // Logic to ensure only ONE piece added and it's valid for the turn
}
```
*(Note: Since Firestore Rules cannot do complex Gomoku logic, we validate turn and finality.)*
