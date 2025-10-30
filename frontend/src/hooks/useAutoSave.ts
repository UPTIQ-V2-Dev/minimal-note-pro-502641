import { useEffect, useRef } from 'react';
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

        onSave(debouncedValue);
    }, [debouncedValue, onSave, enabled]);

    // Reset initial value when enabled state changes
    useEffect(() => {
        if (enabled) {
            initialValueRef.current = value;
            isFirstRender.current = true;
        }
    }, [enabled, value]);
};
