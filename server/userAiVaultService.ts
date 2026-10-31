import { adminDb } from './firebaseAdmin';
import { GoogleGenAI } from '@google/genai';
import { UserAiConnectionStatus } from '../src/types';
import crypto from 'crypto';

interface EncryptedVaultRecord {
  uid: string;
  provider: 'gemini';
  model: string;
  encryptedKey: string;
  iv: string;
  authTag: string;
  keyMasked: string;
  connectedAt: string;
  lastUsedAt?: string;
  callCount: number;
}

const ENCRYPTION_SECRET = process.env.AI_VAULT_ENCRYPTION_KEY 
  || process.env.COOKIE_SECRET 
  || 'bd_invest_vault_master_seed_2026_secured_key_32b';
const CIPHER_KEY = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '****';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

function encryptKey(plainKey: string): { ciphertext: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', CIPHER_KEY, iv);
  let encrypted = cipher.update(plainKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return { ciphertext: encrypted, iv: iv.toString('hex'), authTag };
}

function decryptKey(record: EncryptedVaultRecord): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', CIPHER_KEY, Buffer.from(record.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(record.authTag, 'hex'));
  let decrypted = decipher.update(record.encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const userAiVaultService = {
  async getConnectionStatus(uid: string): Promise<UserAiConnectionStatus> {
    const doc = await adminDb.collection('userGeminiKeys').doc(uid).get();
    if (!doc.exists) {
      return {
        connected: false,
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        verified: false,
        officialBillingNotice: '개인 계정 기반 과금 체계가 적용됩니다.',
      };
    }
    const record = doc.data() as EncryptedVaultRecord;
    return {
      connected: true,
      provider: record.provider,
      model: record.model,
      connectedAt: record.connectedAt,
      keyMasked: record.keyMasked,
      verified: true,
      lastUsedAt: record.lastUsedAt,
      callCount: record.callCount,
      officialBillingNotice: '개인 Google AI Studio 계정에 연동되어 있습니다.',
    };
  },

  async connectUserGeminiKey(uid: string, rawApiKey: string, model: string = 'gemini-3.8-flash'): Promise<UserAiConnectionStatus> {
    const trimmed = rawApiKey.trim();
    if (!trimmed.startsWith('AIza')) throw new Error('유효하지 않은 키 형식입니다.');

    const testAi = new GoogleGenAI({ apiKey: trimmed, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
    await testAi.models.generateContent({ model, contents: 'ping', config: { maxOutputTokens: 5 } });

    const { ciphertext, iv, authTag } = encryptKey(trimmed);
    const record: EncryptedVaultRecord = {
      uid,
      provider: 'gemini',
      model,
      encryptedKey: ciphertext,
      iv,
      authTag,
      keyMasked: maskApiKey(trimmed),
      connectedAt: new Date().toISOString(),
      callCount: 0,
    };
    await adminDb.collection('userGeminiKeys').doc(uid).set(record);
    return this.getConnectionStatus(uid);
  },

  async disconnectUser(uid: string): Promise<boolean> {
    await adminDb.collection('userGeminiKeys').doc(uid).delete();
    return true;
  },

  async getUserGenAIClient(uid: string): Promise<{ client: GoogleGenAI; model: string }> {
    const doc = await adminDb.collection('userGeminiKeys').doc(uid).get();
    if (!doc.exists) throw new Error('AI_NOT_CONNECTED');
    const record = doc.data() as EncryptedVaultRecord;
    
    try {
      const plainKey = decryptKey(record);
      await adminDb.collection('userGeminiKeys').doc(uid).update({ lastUsedAt: new Date().toISOString(), callCount: record.callCount + 1 });
      return {
        client: new GoogleGenAI({ apiKey: plainKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } }),
        model: record.model,
      };
    } catch {
      throw new Error('AI_DECRYPTION_FAILED');
    }
  },

  async hasConnection(uid: string): Promise<boolean> {
    const doc = await adminDb.collection('userGeminiKeys').doc(uid).get();
    return doc.exists;
  },
};
