# Verifiable Giveaway Winner Selection — ChaCha20 Algorithm

## Overview

This document describes a transparent and verifiable algorithm for selecting winners in a giveaway. The core principle is **determinism with public auditability**: given the same inputs, anyone can independently reproduce the result and confirm it was not manipulated.

---

## Seed Format

The seed is derived by hashing a canonical input string that combines all public, immutable parameters of the giveaway.

### Canonical Seed Input String

```
{post_id}|{post_date_iso}|{comment_count}|{giveaway_date_iso}|{participants_hash}|{winner_number}|{attempt}
```

| Field | Description |
|---|---|
| `post_id` | Unique identifier of the giveaway post |
| `post_date_iso` | Publication date of the post in ISO 8601 UTC format (`2025-02-01T12:00:00Z`) |
| `comment_count` | Total number of participating comments at the time of closing registration |
| `giveaway_date_iso` | Scheduled date and time of the draw in ISO 8601 UTC format |
| `participants_hash` | SHA-256 hash of the canonical participants list (see below) |
| `winner_number` | Sequential number of the winner being selected (1, 2, 3 …) |
| `attempt` | Draw attempt number for this winner slot, starting at 1. Incremented if the selected participant is disqualified and a re-draw is required. |

### Seed Derivation

The canonical input string is hashed with **SHA-256**, producing a 256-bit (32-byte) value. This value is used directly as the ChaCha20 key.

```
seed = SHA-256(seed_input_string)
```

---

## Data Preparation

### Participants List

Before the draw, a canonical list of participants must be fixed and published. This list must follow a strictly defined, reproducible ordering — for example, sorted by comment ID ascending (chronological order of participation).

Each entry in the list should contain the minimum set of data required to uniquely identify the participant: a user ID or comment ID. The list is serialized as a plain newline-separated string of identifiers with no trailing whitespace or blank lines.

### Participants Hash

The SHA-256 hash is computed over the canonical serialized participants list. This hash is **published before the draw takes place**, serving as a public commitment that the list will not be altered afterwards. Because `participants_hash` is embedded directly in the seed input string, any modification to the list — including reordering, adding, or removing entries — will produce a completely different seed and therefore a different winner. This makes post-draw manipulation detectable.

### Publication Commitment

Prior to conducting the draw, the following must be publicly posted:

- The complete canonical seed input string
- The `participants_hash` with the full serialized participants list it was derived from
- The draw date and all other seed components

This allows any third party to independently verify the integrity of all inputs before the result is announced.

---

## Winner Selection

### Algorithm

ChaCha20 is used as a **deterministic stream cipher operating as a PRNG**. Given an identical key (the seed) and a fixed nonce, it always produces the same keystream.

The selection process works as follows:

1. Compute the seed as described above.
2. Initialize ChaCha20 with the 256-bit seed as the key and a **fixed, publicly known zero nonce** (12 or 16 bytes of zeros, depending on the variant). Because the nonce does not need to provide uniqueness here — the seed already encodes all unique parameters — a constant nonce is appropriate and simplifies reproducibility.
3. Read the first 8 bytes of the ChaCha20 keystream and interpret them as a 64-bit unsigned integer.
4. Compute the winner index as that integer modulo N, where N is the total number of participants.
5. Look up the participant at that index in the canonical list.

The slight modulo bias introduced when N is not a power of two is negligible for giveaway purposes (with realistic participant counts the bias is less than one in a billion). If strict uniformity is required, rejection sampling can be applied: discard outputs where the value falls in the biased range and take the next 8-byte chunk.

### Multiple Winners

For each additional winner slot, the `winner_number` field in the seed input is incremented (1, 2, 3 …), a new seed is computed, and the algorithm is run independently. This ensures each winner is selected with a fully independent random process. If a selected participant was already picked in a previous slot, the `attempt` counter is incremented, a new seed is derived, and the selection is repeated.

---

## Verification

Anyone who knows the following can independently verify the result:

- The complete seed input string (all six fields)
- The canonical participants list (to recompute `participants_hash` and look up the winner by index)

### Verification Steps

1. Recompute `participants_hash` by serializing the participants list in the canonical order and hashing it with SHA-256. Confirm it matches the published value.
2. Reconstruct the canonical seed input string using all published fields including the recomputed `participants_hash`.
3. Hash the seed input string with SHA-256 to obtain the 256-bit seed.
4. Initialize ChaCha20 with this seed as the key and the fixed zero nonce.
5. Read the first 8 bytes of the keystream, interpret as a 64-bit unsigned integer, apply modulo N.
6. Look up the resulting index in the canonical participants list. The result must match the announced winner.

If any single input field differs — list order, comment count, date, attempt number — the derived seed will be entirely different and will not reproduce the claimed result. This is the primary tamper-evidence property of the scheme.

---

## Public Record

After the draw, the following should be published as a permanent record:

- All seed input fields (post ID, dates, comment count, winner number, attempt)
- The `participants_hash` and the full participants list
- The derived `seed` (SHA-256 hex string)
- The algorithm name and nonce value
- The winner index and winner identifier

This record enables any participant or observer to fully reproduce and audit the draw independently.
