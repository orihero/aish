import React from "react";
import styles from "./Text.module.css";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
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
    isEditable?: boolean;
    onChange?: (e: any) => void;
    inputWidth?: number;
    rows?: number;
    placeholder?: string;
    isTag?: boolean;
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
    isEditable,
    onChange,
    inputWidth,
    rows,
    placeholder,
    isTag,
}) => {
    return isEditable ? (
        <textarea
            id={id}
            className={`${styles.text} ${styles[textSize]} ${className}`}
            value={text}
            placeholder={placeholder ? placeholder : ""}
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
                border: "none",
                outline: "none",
                width: inputWidth,
                borderBottom: `1px solid ${
                    isEditable ? Colors.lineColor : Colors.black
                }`,
                resize: "none", // foydalanuvchi o‘lchamini o‘zgartira olmasligi uchun
                overflow: "hidden", // scroll bo'lmasin
                background: "transparent", // fon yo‘q bo‘lsin
            }}
            onChange={(e) => onChange?.(e.target.value)}
            rows={rows ? rows : 1} // Boshlang'ich qatorlar soni
        />
    ) : (
        <p
            id={id}
            className={`${styles.text} ${styles[textSize]} ${className} ${
                isTag && styles.tag
            }`}
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

export default observer(Text);
