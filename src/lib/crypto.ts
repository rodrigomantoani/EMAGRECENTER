/**
 * AES-GCM Encryption for Checkout Data
 *
 * Uses Web Crypto API for secure encryption/decryption.
 * The checkout page needs the same CHECKOUT_SECRET to decrypt.
 */

// Shared secret key (must be same on checkout page)
// In production, use environment variable
const CHECKOUT_SECRET = process.env.NEXT_PUBLIC_CHECKOUT_SECRET || 'emagrecenter-checkout-2024-secret-key';

/**
 * Derives an AES key from a password string
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Use a fixed salt for deterministic key derivation
  const salt = encoder.encode('emagrecenter-salt-v1');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts checkout data to a URL-safe string
 */
export async function encryptCheckoutData(data: Record<string, string>): Promise<string> {
  const key = await deriveKey(CHECKOUT_SECRET);
  const encoder = new TextEncoder();

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the JSON data
  const jsonData = JSON.stringify(data);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(jsonData)
  );

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convert to base64url (URL-safe)
  return btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decrypts checkout data from URL parameter
 * (Use this on the checkout page)
 */
export async function decryptCheckoutData(encryptedData: string): Promise<Record<string, string>> {
  const key = await deriveKey(CHECKOUT_SECRET);

  // Convert from base64url
  const base64 = encryptedData
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
