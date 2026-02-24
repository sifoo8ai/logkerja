# QA Checklist - LogKerja System Integrity Audit (T6.0)

## 1. Role Access (Security & RLS)
- [x] **RLS Enforcement**: Table `documents`, `document_actions`, `document_attachments` have proper Row Level Security policies preventing viewing documents beyond ownership or assignment limits. Admin enjoys global view access.
- [x] **Route Protection Bypass**: Application dashboard limits data visibility to standard role queries, reinforced by RLS backend queries to prevent unauthorized data spoofing.

## 2. Document Transitions (State Machine)
- [x] **Invalid Transitions Fallback**: `transition_document` RPC enforces strict from-to statuses (e.g. Reject without note throws an error). It runs completely within PostgreSQL bounded context.
- [x] **Role Specific Status Updates**: Verifier can only execute actions during `PENDING_VERIFIER`. Approvers restricted to `PENDING_APPROVER`.
- [x] **Auto-Finalize Capability**: Approving docs where `verifier_id` == `approver_id` skips `PENDING_APPROVER` to `LULUS` automatically.
- [x] **ON_HOLD restrictions**: Validated that `ON_HOLD` is strictly accessible by users with `ADMIN` role from `LULUS` state.
- [x] **RESUBMIT restrictions**: Validated that RESUBMIT is restricted to `PENYEMAK` only and re-routes active status back to `PENDING_VERIFIER`.

## 3. Edge Function Wrappers Interface
- [x] **No Extraneous Direct Database Writes**: Assessed source client feature modules (`penyemakApi.ts`, `pengesahApi.ts`, `pelulusApi.ts`, `adminApi.ts`). Transitions correctly utilize Deno Edge Wrappers (`documents_transition`). No instances of `.update()` or `.insert()` targeting the `documents` table for authorization purposes.
- [x] **Exception for Admin Updates**: Allowed explicit manual updates for document category editing (`adminApi.ts` line 37) bounded by application logic limiting status to `REJECTED` or `ON_HOLD`. Addressed edge cases involving admin explicit `.update()` on the `documents` table by adjusting RLS policies in `0004_logkerja_admin_update.sql`.

## 4. Realtime Leakage Control
- [x] **Scoped Subscriptions Validated**: Subscriptions initialized in the component layer correctly scope payload filters (`verifier_id=eq.<user>`, `approver_id=eq.<user>`).
- [x] **Fixed Schema Discrepancy**: Corrected runtime bugs in components (`PengesahDashboard.tsx`, `PelulusDashboard.tsx`) filtering on non-existent `assigned_verifier` column instead of the actual `verifier_id`/`approver_id` SQL defined column structure. Leakage risks were evaluated and addressed.

## 5. Attachments Integrity
- [x] **Unauthorized Access Blocked**: Viewing attachments utilizes the `attachments_signed_url` edge function bounding view access strictly toward signed tokens.
- [x] **Secure Upload Stream**: `attachments_upload_init` initializes uploads, preventing brute forcing of storage buckets. Registrations use the separate `attachments_register` endpoints.

## 6. Admin Governance Limitations
- [x] **Admin Approval Restraints**: RPC `transition_document` inherently stops Admins from manipulating Verifier/Approver flows unless explicitly authenticated with assigned dual roles.
- [x] **Cascading Integrity on Deletions**: Verified hard-delete executions cascade natively wiping `document_actions` and `document_attachments`. Object storage deletes mapped as optional Phase 2 updates.

## Audit Findings Summary
- Fixed critical column mismatches on `pengesahApi.ts`, `pelulusApi.ts`, and component hooks avoiding crash-on-call for realtime events due to missing table columns (`assigned_verifier` -> `verifier_id`).
- Patched local RLS policy allowing generic `update` for ADMIN role on `documents` table. Note: Prior implementation strictly prevented *any* user edits post-insertion inside RLS.
