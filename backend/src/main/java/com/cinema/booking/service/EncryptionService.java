package com.cinema.booking.service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class EncryptionService {
    
    @Value("${encryption.enabled:false}")
    private boolean encryptionEnabled;
    
    @Value("${encryption.key:}")
    private String encryptionKeyString;
    
    private SecretKeySpec secretKey;
    private static final String ALGORITHM = "AES";
    
    @PostConstruct
    public void init() {
        if (encryptionEnabled) {
            try {
                if (encryptionKeyString == null || encryptionKeyString.isEmpty()) {
                    throw new RuntimeException("Encryption is enabled but encryption.key is not set");
                }
                
                byte[] decodedKey = Base64.getDecoder().decode(encryptionKeyString);
                
                if (decodedKey.length != 32) {
                    throw new RuntimeException("Encryption key must be 256 bits (32 bytes), but got " + decodedKey.length + " bytes");
                }
                
                secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, ALGORITHM);
                System.out.println("✓ Encryption initialized successfully with 256-bit key");
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Encryption key is not valid Base64", e);
            }
        } else {
            System.out.println("ℹ Encryption is disabled (encryption.enabled=false)");
        }
    }
    
    public String encrypt(String data) {
        if (!encryptionEnabled || data == null || data.isEmpty()) {
            return data;
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            String result = Base64.getEncoder().encodeToString(encrypted);
            System.out.println("✓ Encrypted data: " + data.substring(0, Math.min(4, data.length())) + "... -> " + result.substring(0, Math.min(20, result.length())) + "...");
            return result;
        } catch (Exception e) {
            System.err.println("✗ Encryption failed: " + e.getMessage());
            throw new RuntimeException("Encryption failed: " + e.getMessage(), e);
        }
    }
    
    public String decrypt(String encryptedData) {
        if (!encryptionEnabled || encryptedData == null || encryptedData.isEmpty()) {
            return encryptedData;
        }
        
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decoded = Base64.getDecoder().decode(encryptedData);
            return new String(cipher.doFinal(decoded));
        } catch (IllegalArgumentException e) {
            return encryptedData;
        } catch (Exception e) {
            System.err.println("✗ Decryption failed: " + e.getMessage());
            return encryptedData;
        }
    }
    
    public boolean isEncryptionEnabled() {
        return encryptionEnabled;
    }
}
