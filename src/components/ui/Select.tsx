import { Select } from "@mantine/core";
import { memo } from "react";
import styles from "./Select.module.scss";

interface SelectInputProps {
    label: string;
    data: string[];
    placeholder: string;
    value: string | null | undefined;
    sx?: any;
    onChange: (value: string | null) => void;
}

function SelectInput({
    value,
    placeholder,
    data,
    label,
    sx,
    onChange,
}: SelectInputProps) {
    return (
        <Select
            maw={320}
            mx="auto"
            sx={sx}
            className={styles.parentContainer}
            label={label}
            placeholder={placeholder}
            data={data}
            onChange={onChange}
            value={value}
            withinPortal
            styles={(theme) => ({
                dropdown: {
                    background: "#393c4f !important",
                    color: "white",
                    border: "none",
                },
                item: {
                    fontFamily: "Josefin Sans",
                    background: "#393c4f !important",
                    "&, &:hover": {
                        background: "#393c4f",
                        color: "white",
                    },
                    "&[data-selected]": {
                        background: "#3F88C5 !important",
                        color: "white",
                    },
                },
            })}
        />
    );
}

export default memo(SelectInput);
