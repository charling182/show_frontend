import NodeRSA from 'node-rsa';
import JSEncrypt from 'jsencrypt';
import { getPublicKey } from '@/api';
const privateKey = `
        MIIBPAIBAAJBAJxyBWuwr6Ctr6UBNp9VFvanTLykZfxGm2qdwEaOqWqWTPGxZ//O
        csaJK2+aONnsvoryMDuVOs+NsugZbS9Z6asCAwEAAQJBAJl06sZIqO3GkR0cxJSj
        5YOKdaYw6Gz+YWLCXKGZPKt0Na9fxmrlq0QQYMEKBDsbGMQxrbMA2qNf4fxKSeTI
        KcECIQDwu0yEG/o28HDbqCtraRcp0ldrNMb8ACgT5u+rDEQOCwIhAKZeL+MWO3QU
        NC0gry3CZM/G5zKdp9qPRb3bw7pcAfbhAiEA1MsLoP/GFwhFCrXF48Vad1p6ccaO
        WjWdN7J8irtl8O8CIAxscCsHF/19HMBZ9nr2T0zsz4sKFuTNWinpZV5fTI5BAiEA
        6kdlV030ql/FTHcxEm2138M3ecj6tFRNLVTcYslteEI=`;

/**
 * @description RSA加密
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data) {
  let publicKey = '';
  const res = await getPublicKey();
  publicKey = res.data.rsa_public_key;
  const key = new NodeRSA(publicKey);
  data = key.encrypt(data, 'base64');
  return data;
}

/**
 * @description RSA解密
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`,
  );
  data = decrypt.decrypt(JSON.stringify(data));
  return data;
}
