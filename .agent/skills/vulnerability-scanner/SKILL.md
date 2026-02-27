---
name: vulnerability-scanner
description: Advanced vulnerability analysis principles. OWASP 2025, Supply Chain Security, attack surface mapping, risk prioritization.
allowed-tools: Read, Glob, Grep, Bash
---

# Vulnerability Scanner

> Think like an attacker, defend like an expert. 2025 threat landscape awareness.

## 🔧 Runtime Scripts

**Execute for automated validation:**

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/security_scan.py` | Validate security principles applied | `python scripts/security_scan.py <project_path>` |

## 📋 Reference Files

| File | Purpose |
|------|---------|
| [checklists.md](checklists.md) | OWASP Top 10, Auth, API, Data protection checklists |

---

## 1. Security Expert Mindset

### Core Principles

| Principle | Application |
|-----------|-------------|
| **Assume Breach** | Design as if attacker already inside |
| **Zero Trust** | Never trust, always verify |
| **Defense in Depth** | Multiple layers, no single point |
| **Least Privilege** | Minimum required access only |
| **Fail Secure** | On error, deny access |

### Threat Modeling Questions

Before scanning, ask:
1. What are we protecting? (Assets)
2. Who would attack? (Threat actors)
3. How would they attack? (Attack vectors)
4. What's the impact? (Business risk)

---

## 2. OWASP Top 10:2025

### Risk Categories

| Rank | Category | Think About |
|------|----------|-------------|
| **A01** | Broken Access Control | Who can access what? IDOR, SSRF |
| **A02** | Security Misconfiguration | Defaults, headers, exposed services |
| **A03** | Software Supply Chain 🆕 | Dependencies, CI/CD, build integrity |
| **A04** | Cryptographic Failures | Weak crypto, exposed secrets |
| **A05** | Injection | User input → system commands |
| **A06** | Insecure Design | Flawed architecture |
| **A07** | Authentication Failures | Session, credential management |
| **A08** | Integrity Failures | Unsigned updates, tampered data |
| **A09** | Logging & Alerting | Blind spots, no monitoring |
| **A10** | Exceptional Conditions 🆕 | Error handling, fail-open states |

### 2025 Key Changes

```
2021 → 2025 Shifts:
├── SSRF merged into A01 (Access Control)
├── A02 elevated (Cloud/Container configs)
├── A03 NEW: Supply Chain (major focus)
├── A10 NEW: Exceptional Conditions
└── Focus shift: Root causes > Symptoms
```

---

## 3. Supply Chain Security (A03)

### Attack Surface

| Vector | Risk | Question to Ask |
|--------|------|-----------------|
| **Dependencies** | Malicious packages | Do we audit new deps? |
| **Lock files** | Integrity attacks | Are they committed? |
| **Build pipeline** | CI/CD compromise | Who can modify? |
| **Registry** | Typosquatting | Verified sources? |

### Defense Principles

- Verify package integrity (checksums)
- Pin versions, audit updates
- Use private registries for critical deps
- Sign and verify artifacts

---

## 4. Attack Surface Mapping

### What to Map

| Category | Elements |
|----------|----------|
| **Entry Points** | APIs, forms, file uploads |
| **Data Flows** | Input → Process → Output |
| **Trust Boundaries** | Where auth/authz checked |
| **Assets** | Secrets, PII, business data |

### Prioritization Matrix

```
Risk = Likelihood × Impact

High Impact + High Likelihood → CRITICAL
High Impact + Low Likelihood  → HIGH
Low Impact + High Likelihood  → MEDIUM
Low Impact + Low Likelihood   → LOW
```

---

## 5. Risk Prioritization

### CVSS + Context

| Factor | Weight | Question |
|--------|--------|----------|
| **CVSS Score** | Base severity | How severe is the vuln? |
| **EPSS Score** | Exploit likelihood | Is it being exploited? |
| **Asset Value** | Business context | What's at risk? |
| **Exposure** | Attack surface | Internet-facing? |

### Prioritization Decision Tree

```
Is it actively exploited (EPSS >0.5)?
├── YES → CRITICAL: Immediate action
└── NO → Check CVSS
         ├── CVSS ≥9.0 → HIGH
         ├── CVSS 7.0-8.9 → Consider asset value
         └── CVSS <7.0 → Schedule for later
```

---

## 6. Exceptional Conditions (A10 - New)

### Fail-Open vs Fail-Closed

| Scenario | Fail-Open (BAD) | Fail-Closed (GOOD) |
|----------|-----------------|---------------------|
| Auth error | Allow access | Deny access |
| Parsing fails | Accept input | Reject input |
| Timeout | Retry forever | Limit + abort |

### What to Check

- Exception handlers that catch-all and ignore
- Missing error handling on security operations
- Race conditions in auth/authz
- Resource exhaustion scenarios

---

## 7. Scanning Methodology

### Phase-Based Approach

```
1. RECONNAISSANCE
   └── Understand the target
       ├── Technology stack
       ├── Entry points
       └── Data flows

2. DISCOVERY
   └── Identify potential issues
       ├── Configuration review
       ├── Dependency analysis
       └── Code pattern search

3. ANALYSIS
   └── Validate and prioritize
       ├── False positive elimination
       ├── Risk scoring
       └── Attack chain mapping

4. REPORTING
   └── Actionable findings
       ├── Clear reproduction steps
       ├── Business impact
       └── Remediation guidance
```

---

## 8. Code Pattern Analysis

### High-Risk Patterns

| Pattern | Risk | Look For |
|---------|------|----------|
| **String concat in queries** | Injection | `"SELECT * FROM " + user_input` |
| **Dynamic code execution** | RCE | `eval()`, `exec()`, `Function()` |
| **Unsafe deserialization** | RCE | `pickle.loads()`, `unserialize()` |
| **Path manipulation** | Traversal | User input in file paths |
| **Disabled security** | Various | `verify=False`, `--insecure` |

### Secret Patterns

| Type | Indicators |
|------|-----------|
| API Keys | `api_key`, `apikey`, high entropy |
| Tokens | `token`, `bearer`, `jwt` |
| Credentials | `password`, `secret`, `key` |
| Cloud | `AWS_`, `AZURE_`, `GCP_` prefixes |

---

## 9. Cloud Security Considerations

### Shared Responsibility

| Layer | You Own | Provider Owns |
|-------|---------|---------------|
| Data | ✅ | ❌ |
| Application | ✅ | ❌ |
| OS/Runtime | Depends | Depends |
| Infrastructure | ❌ | ✅ |

### Cloud-Specific Checks

- IAM: Least privilege applied?
- Storage: Public buckets?
- Network: Security groups tightened?
- Secrets: Using secrets manager?

---

## 10. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Scan without understanding | Map attack surface first |
| Alert on every CVE | Prioritize by exploitability + asset |
| Ignore false positives | Maintain verified baseline |
| Fix symptoms only | Address root causes |
| Scan once before deploy | Continuous scanning |
| Trust third-party deps blindly | Verify integrity, audit code |

---

## 11. Reporting Principles

### Finding Structure

Each finding should answer:
1. **What?** - Clear vulnerability description
2. **Where?** - Exact location (file, line, endpoint)
3. **Why?** - Root cause explanation
4. **Impact?** - Business consequence
5. **How to fix?** - Specific remediation

### Severity Classification

| Severity | Criteria |
|----------|----------|
| **Critical** | RCE, auth bypass, mass data exposure |
| **High** | Data exposure, privilege escalation |
| **Medium** | Limited scope, requires conditions |
| **Low** | Informational, best practice |

---

> **Remember:** Vulnerability scanning finds issues. Expert thinking prioritizes what matters. Always ask: "What would an attacker do with this?"
