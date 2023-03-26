import { showNotification } from "@mantine/notifications";
import { GetCommentsQueryType } from "~/schema/comment";
import  dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function debounce(cb: (...args: any) => void, delay: number = 250) {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    };
}

export function showToast(
    message: string,
    type: "error" | "default" | "info"
): void {
    const styles = () => {
        let borderColor: string;
        switch (type) {
            case "error":
                borderColor = "#D00000";
                break;
            case "info":
                borderColor = "#136F63";
                break;
            default:
                borderColor = "#3F88C5";
        }

        return {
            root: {
                backgroundColor: "#393c4f",
                color: "white",
                borderColor,
            },
            title: {
                color: "white",
                fontFamily: "Josefin Sans",
            },
            description: {
                color: "white",
                fontFamily: "Josefin Sans",
            },
        };
    };

    showNotification({
        styles,
        message,
    });
}

export function dateFormatter(date : Date) {
    if(!date) return ""

    return dayjs(date).fromNow()
}


