import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseAutoSaveProps {
    value: string;
    onSave: (value: string) => void;
    delay?: number;
    enabled?: boolean;
}

export const useAutoSave = ({ value, onSave, delay = 1000, enabled = true }: UseAutoSaveProps) => {
    const debouncedValue = useDebounce(value, delay);
    const initialValueRef = useRef(value);
    const isFirstRender = useRef(true);
    const onSaveRef = useRef(onSave);
    const prevEnabledRef = useRef(enabled);

    // Update the ref when onSave changes to avoid stale closures
    useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);

    const stableOnSave = useCallback((val: string) => {
        onSaveRef.current(val);
    }, []);

    useEffect(() => {
        // Don't save on initial render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            initialValueRef.current = debouncedValue;
            return;
        }

        // Don't save if value hasn't changed from initial
        if (debouncedValue === initialValueRef.current || !enabled) {
            return;
        }

        stableOnSave(debouncedValue);
    }, [debouncedValue, stableOnSave, enabled]);

    // Reset initial value when enabled state changes from false to true
    useEffect(() => {
        if (enabled && !prevEnabledRef.current) {
            initialValueRef.current = value;
            isFirstRender.current = true;
        }
        prevEnabledRef.current = enabled;
    }, [enabled, value]);
};
