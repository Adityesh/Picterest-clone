
export function debounce(cb : (...args : any) => void, delay : number = 250) {
    let timeout : NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    };
}
