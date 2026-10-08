package com.portfolio.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SlugUtilsTests {

    @Test
    @DisplayName("Converts special characters, spaces, and accents to clean URL slug")
    void testToSlug() {
        assertThat(SlugUtils.toSlug("Portfolio CMS Platform!")).isEqualTo("portfolio-cms-platform");
        assertThat(SlugUtils.toSlug("  My Project #1 & 2!  ")).isEqualTo("my-project-1-2");
        assertThat(SlugUtils.toSlug("Crème Brûlée App")).isEqualTo("creme-brulee-app");
        assertThat(SlugUtils.toSlug("---hello---world---")).isEqualTo("hello-world");
        assertThat(SlugUtils.toSlug("")).isEqualTo("");
        assertThat(SlugUtils.toSlug(null)).isEqualTo("");
    }

    @Test
    @DisplayName("Validates slug format")
    void testIsValidSlug() {
        assertThat(SlugUtils.isValidSlug("portfolio-cms")).isTrue();
        assertThat(SlugUtils.isValidSlug("project-123")).isTrue();
        assertThat(SlugUtils.isValidSlug("simple")).isTrue();

        assertThat(SlugUtils.isValidSlug("Portfolio-CMS")).isFalse(); // Uppercase
        assertThat(SlugUtils.isValidSlug("-portfolio")).isFalse(); // Leading hyphen
        assertThat(SlugUtils.isValidSlug("portfolio-")).isFalse(); // Trailing hyphen
        assertThat(SlugUtils.isValidSlug("portfolio--cms")).isFalse(); // Double hyphen
        assertThat(SlugUtils.isValidSlug("")).isFalse();
        assertThat(SlugUtils.isValidSlug(null)).isFalse();
    }
}
