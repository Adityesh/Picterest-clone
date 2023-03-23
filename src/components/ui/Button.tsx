import { CSSProperties, MouseEventHandler, memo } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
    value: string;
    onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    style?: CSSProperties | undefined;
    parentStyle? : CSSProperties | undefined;
    variant: "default" | "primary" | "secondary";
    disabled?: boolean;
};

const colors = {
    default: "#3F88C5",
    secondary: "#D00000",
    primary: "#136F63",
};

function Button({
    value,
    onClick,
    style,
    variant,
    disabled = false,
    parentStyle
}: ButtonProps) {
    return (
        <div className={styles.buttonContainer} style={parentStyle}>
            <button
                onClick={onClick}
                style={{
                    backgroundColor: disabled ? 'grey' : colors[variant],
                    pointerEvents: disabled ? "none" : "initial",
                    ...style,
                }}
                className={styles.button}
            >
                {value}
            </button>
        </div>
    );
}

export default memo(Button)
