# 🔐 Security Policy

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## 🚨 Reporting a Vulnerability

The Night God Tarot team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them by emailing **security@nightgodtarot.com** or through GitHub's private vulnerability reporting:

1. Go to the repository's Security tab
2. Click "Report a vulnerability" 
3. Fill out the advisory form

### What to Include

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Acknowledge receipt**: Within 48 hours
- **Initial assessment**: Within 1 week  
- **Status update**: Every 2 weeks until resolved
- **Resolution**: Target 30-90 days depending on complexity

## 🔒 Security Measures

### API Key Protection
- All sensitive API keys are stored as GitHub secrets
- Environment variables are never committed to the repository
- Production builds use encrypted secret management

### Content Security Policy
- Strict CSP headers prevent XSS attacks
- All external resources are whitelisted
- Inline scripts and styles are prohibited

### Authentication & Authorization
- JWT tokens with secure signing algorithms
- Rate limiting to prevent brute force attacks
- Session management with secure cookies

### Data Protection
- All user data is encrypted at rest and in transit
- HTTPS enforced for all communications
- Regular security audits and dependency updates

## 🚀 Security Features

- **Automated Dependency Scanning**: Dependabot monitors for vulnerabilities
- **Code Scanning**: GitHub CodeQL analyzes code for security issues  
- **Secret Scanning**: Prevents accidental exposure of API keys
- **Branch Protection**: Requires reviews and status checks

## 📋 Security Checklist

- [x] API keys stored as GitHub secrets
- [x] HTTPS enforced everywhere
- [x] Content Security Policy implemented
- [x] Dependency scanning enabled
- [x] Code scanning enabled
- [x] Secret scanning enabled
- [x] Branch protection rules configured

## 🎭 Tarot-Specific Security

As a spiritual application handling personal readings:
- Reading data is ephemeral and not stored permanently
- User privacy is paramount - no tracking beyond basic analytics
- AI models are sandboxed and cannot access sensitive data
- All divination results are generated locally when possible

---

*"In the realm of digital divination, security is the foundation upon which trust is built."*