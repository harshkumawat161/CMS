package com.portfolio.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Utility for normalizing, validating, and generating URL-friendly slugs.
 */
public final class SlugUtils {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern DUPLICATE_HYPHENS = Pattern.compile("-+");
    private static final Pattern VALID_SLUG = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    private SlugUtils() {
    }

    /**
     * Converts arbitrary string input into a URL-safe lowercase kebab-case slug.
     */
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String noWhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        slug = DUPLICATE_HYPHENS.matcher(slug).replaceAll("-");
        slug = slug.toLowerCase(Locale.ENGLISH);

        if (slug.startsWith("-")) {
            slug = slug.substring(1);
        }
        if (slug.endsWith("-")) {
            slug = slug.substring(0, slug.length() - 1);
        }

        if (slug.length() > 150) {
            slug = slug.substring(0, 150);
            if (slug.endsWith("-")) {
                slug = slug.substring(0, slug.length() - 1);
            }
        }

        return slug;
    }

    /**
     * Validates whether a slug is formatted correctly (lowercase alphanumeric and hyphens).
     */
    public static boolean isValidSlug(String slug) {
        if (slug == null || slug.isBlank() || slug.length() > 150) {
            return false;
        }
        return VALID_SLUG.matcher(slug).matches();
    }
}
