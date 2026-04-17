import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), Math.max(0, delayMs));
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}

