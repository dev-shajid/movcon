'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

type SpinnerSize = "sm" | "md" | "lg";

interface OverlayContextType {
    isOpen: boolean;
    spinnerSize: SpinnerSize;
    showOverlay: (message?: string, spinnerSize?: SpinnerSize) => void;
    hideOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [spinnerSize, setSpinnerSize] = useState<SpinnerSize>("md");
    
    // Safe pathname access that works during SSR/prerender
    let pathname: string | null = null
    try {
        pathname = usePathname()
    } catch {
        // During prerender, pathname might not be available
        pathname = null
    }

    const showOverlay = useCallback((msg?: string, size: SpinnerSize = "md") => {
        setMessage(msg);
        setSpinnerSize(size);
        setIsOpen(true);
    }, []);

    const hideOverlay = useCallback(() => {
        setIsOpen(false);
        setMessage(undefined);
        setSpinnerSize("md");
    }, []);

    useEffect(() => {
        // Hide overlay on route change
        hideOverlay();
    }, [pathname]);

    const spinnerSizes = {
        sm: "size-8",
        md: "size-12",
        lg: "size-16",
    }

    const value: OverlayContextType = { isOpen, spinnerSize, showOverlay, hideOverlay };

    return (
        <OverlayContext.Provider value={value}>
            {children}
            {
                isOpen ? <div
                    className={cn(
                        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
                        isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'
                    )}
                    role="status"
                    aria-live="polite"
                    aria-label={message || "Loading"}
                >
                    <div className="flex flex-col items-center gap-4">
                        {/* Spinner */}
                        <Loader2
                            className={cn(
                                "animate-spin",
                                spinnerSizes[spinnerSize]
                            )}
                        />

                        {/* Loading Message */}
                        {message && (
                            <p className="text-sm font-medium text-white">
                                {message}
                            </p>
                        )}
                    </div>
                </div> : null
            }
        </OverlayContext.Provider>
    );
};

export const useOverlay = () => {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error('useOverlay must be used within OverlayProvider');
    }
    return context;
};