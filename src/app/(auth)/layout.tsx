import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            suppressContentEditableWarning
            suppressHydrationWarning
        >
            {children}
        </div>
    )
}
