# FactoryOS OpenAPI (Draft v0)

This folder contains a draft OpenAPI 3.0.3 spec aligned with the PRD and Architecture.

- File: `factoryos-openapi.yaml`
- Scope: Auth, user/menu, system dept/role, generic table, upload
- Conventions:
  - Use `X-FactoryOS-Context` header with JSON string: {"companyId","userId","roles"}
  - Protect endpoints with `bearerAuth` (JWT). Refresh uses `cookieRefresh`.
  - Real backend must enforce RBAC+ABAC, rate limiting, idempotency, and audit.

Suggested next steps:
- Split per-domain specs and generate a bundle via tooling
- Publish to a docs site and CI-validate with spectral/linters
