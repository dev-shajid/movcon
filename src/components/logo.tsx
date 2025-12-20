'use client'

import Image from 'next/image'

export default function Logo({ size = 40 }: { size?: number }) {
    return (
        <div className='flex items-center justify-center woverflow-hidden'>
            <Image
                src="/logo.png"
                alt="Logo"
                width={size}
                height={size}
                className='rounded-full'
            />
        </div>
    )
}
