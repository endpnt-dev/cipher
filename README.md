# Cipher API

A comprehensive cryptographic API providing hashing, HMAC, encoding, password management, JWT operations, and secure random generation.

## Features

- **Hashing**: SHA-1, SHA-256, SHA-512, SHA-3, MD5
- **HMAC**: Hash-based Message Authentication Codes
- **Encoding**: Base64, Base64URL, Hex encoding/decoding
- **UUIDs**: Generate v1, v4, and v7 UUIDs
- **Random**: Secure random bytes and strings
- **Password**: Bcrypt hashing and verification
- **JWT**: Sign, verify, and decode JSON Web Tokens

## Rate Limits

- **Free**: 100 requests/month
- **Starter**: 5,000 requests/month
- **Pro**: 25,000 requests/month
- **Enterprise**: 100,000 requests/month

## Security

This API is designed with security as the top priority:
- Never logs sensitive inputs or outputs
- Uses constant-time comparison for verification
- Rejects insecure algorithms (e.g., JWT none algorithm)
- Implements proper input size limits
- Uses bcryptjs (pure JS) for cross-platform compatibility

## Quick Start

```bash
npm install
npm run dev
```

## API Documentation

Visit `/docs` for complete API documentation with interactive examples.
