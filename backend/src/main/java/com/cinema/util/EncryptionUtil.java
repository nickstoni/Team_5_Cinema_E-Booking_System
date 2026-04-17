package com.cinema.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EncryptionUtil {
    
    private static final String ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    private static SecretKey secretKey;
    private static boolean encryptionEnabled;
    
    public EncryptionUtil(
            @Value("${encryption.enabled:false}") boolean enabled,
            @Value("${encryption.key:}") String encryptionKey) {
        encryptionEnabled = enabled;
        
        if (enabled) {
            if (encryptionKey == null || encryptionKey.isEmpty()) {
                throw new RuntimeException("Encryption is enabled but encryption.key is not set in application.properties");
            }
            
            try {
                // Decode the encryption key from Base64
                byte[] decodedKey = Base64.getDecoder().decode(encryptionKey);
                if (decodedKey.length != 32) {
                    throw new RuntimeException("Encryption key must be 256 bits (32 bytes). Current key is " + decodedKey.length + " bytes.");
                }
                secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, ALGORITHM);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid encryption key format. Must be Base64 encoded.", e);
            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize encryption key", e);
            }
        }
    }
    
    /**
     * Encrypts a string using AES encryption
     * @param data The data to encrypt
     * @return Base64 encoded encrypted data
     */
    public static String encrypt(String data) {
        if (!encryptionEnabled || data == null || data.isEmpty()) {
            return data;
        }
        
        if (secretKey == null) {
            throw new RuntimeException("Encryption key not initialized. Check encryption.key and encryption.enabled in application.properties");
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Decrypts a Base64 encoded encrypted string
     * @param encryptedData The Base64 encoded encrypted data
     * @return Decrypted data
     */
    public static String decrypt(String encryptedData) {
        if (!encryptionEnabled || encryptedData == null || encryptedData.isEmpty()) {
            return encryptedData;
        }
        
        if (secretKey == null) {
            throw new RuntimeException("Encryption key not initialized. Check encryption.key and encryption.enabled in application.properties");
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            return new String(cipher.doFinal(decoded));
        } catch (IllegalArgumentException e) {
            // Data might already be decrypted, return as is
            return encryptedData;
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed: " + e.getMessage(), e);
        }
    }
    
    /**
     * Check if encryption is enabled
     * @return true if encryption is enabled
     */
    public static boolean isEncryptionEnabled() {
        return encryptionEnabled;
    }
    
    /**
     * Generates a new secure encryption key (use this once to generate and store in application.properties)
     * @return Base64 encoded key
     */
    public static String generateSecretKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(KEY_SIZE);
            SecretKey key = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(key.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate secret key", e);
        }
    }
}
