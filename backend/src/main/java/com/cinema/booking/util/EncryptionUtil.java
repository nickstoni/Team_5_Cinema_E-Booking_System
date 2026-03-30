package com.cinema.booking.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    
    // This key should be stored securely in production (environment variables, AWS KMS, etc.)
    // For now, using a fixed key - MUST be changed in production
    private static final String SECRET_KEY = "AbsoluteCinemaSecure256KeyForPayments1234";

    private static SecretKey getSecretKey() {
        try {
            byte[] decodedKey = new byte[32]; // 256 bits = 32 bytes
            byte[] keyBytes = SECRET_KEY.getBytes();
            System.arraycopy(keyBytes, 0, decodedKey, 0, Math.min(keyBytes.length, 32));
            return new SecretKeySpec(decodedKey, 0, 32, ALGORITHM);
        } catch (Exception e) {
            throw new RuntimeException("Error initializing encryption key", e);
        }
    }

    public static String encrypt(String data) {
        if (data == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data: " + e.getMessage(), e);
        }
    }

    public static String decrypt(String encryptedData) {
        if (encryptedData == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedData = cipher.doFinal(decodedData);
            return new String(decryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data: " + e.getMessage(), e);
        }
    }
}