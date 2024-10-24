package com.je3l.domain.enumeration;

/**
 * The EnumColor enumeration.
 */
public enum EnumColor {
    RED("Rouge"),
    ORANGE("Orange"),
    YELLOW("Jaune"),
    GREEN("Vert"),
    BLUE("Bleu"),
    PURPLE("Violet"),
    PINK("Rose"),
    BROWN("Marron"),
    WHITE("Blanc"),
    BLACK("Noir");

    private final String value;

    EnumColor(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
