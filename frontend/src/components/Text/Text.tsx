import React from "react";
import styles from "./Text.module.css";
interface Props {
    text: string;
    color?: string;
    margin?: string;
    textAlign?: any;
    family?: string;
    positon?: any;
    zIndex?: string;
    transform?: any;
    whiteSpace?: any;
    cursor?: string;
    onPress?: () => void;
    lineHeight?: number;
    id?: string;
    WebkitTextStroke?: string;
    className?: string;
    textSize:
        | "twelve"
        | "fourteen"
        | "sixteen"
        | "eighteen"
        | "twenty"
        | "twentyTwo"
        | "twentyEight"
        | "thirtySix"
        | "forty"
        | "fifty"
        | "sixty"
        | "seventy";
}

const Text: React.FC<Props> = ({
    text,
    color,
    margin = 0,
    textAlign,
    family,
    positon,
    zIndex,
    id,
    transform,
    whiteSpace,
    cursor,
    onPress,
    lineHeight,
    textSize,
    WebkitTextStroke,
    className,
}) => {
    return (
        <p
            id={id}
            className={`${styles.text} ${styles[textSize]} ${className}`}
            onClick={onPress}
            dangerouslySetInnerHTML={{ __html: text }}
            style={{
                margin: margin,
                color: color ? color : "#fff",
                fontFamily: family,
                textAlign: textAlign,
                position: positon,
                zIndex: zIndex,
                textTransform: transform,
                whiteSpace: whiteSpace,
                cursor: cursor,
                lineHeight: `${lineHeight}px`,
                WebkitTextStroke: WebkitTextStroke,
            }}
        ></p>
    );
};

export default Text;
