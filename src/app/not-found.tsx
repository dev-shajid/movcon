import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ML Course',
}

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">404 Not Found</h1>
                <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            </div>
        </div>
    )
}
