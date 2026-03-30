package com.cinema.booking.util;

import java.util.Base64;

public class EncryptionUtil {

    public static String encrypt(String data) {
        if (data == null) return null;
        return Base64.getEncoder().encodeToString(data.getBytes());
    }

    public static String decrypt(String data) {
        if (data == null) return null;
        return new String(Base64.getDecoder().decode(data));
    }
}