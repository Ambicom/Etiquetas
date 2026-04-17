import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

function Harness({ value, delayMs }: { value: string; delayMs: number }) {
    const debounced = useDebouncedValue(value, delayMs);
    return <div data-testid="value">{debounced}</div>;
}

describe("useDebouncedValue", () => {
    it("atualiza o valor apenas após o delay", async () => {
        vi.useFakeTimers();
        const { rerender } = render(<Harness value="a" delayMs={200} />);
        expect(screen.getByTestId("value").textContent).toBe("a");

        rerender(<Harness value="b" delayMs={200} />);
        expect(screen.getByTestId("value").textContent).toBe("a");

        act(() => {
            vi.advanceTimersByTime(199);
        });
        expect(screen.getByTestId("value").textContent).toBe("a");

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(screen.getByTestId("value").textContent).toBe("b");
        vi.useRealTimers();
    });
});
