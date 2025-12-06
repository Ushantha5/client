"use client";
import { CldImage } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function CloudinaryDemoPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 dark:bg-slate-900">
            <h1 className="text-2xl font-bold mb-8">Cloudinary Integration Demo</h1>
            <div className="rounded-xl overflow-hidden shadow-xl border bg-white dark:bg-slate-800 p-4">
                <CldImage
                    src="cld-sample-5" // Use this sample image or upload your own via the Media Library
                    width="500" // Transform the image: auto-crop to square aspect_ratio
                    height="500"
                    crop={{
                        type: 'auto',
                        source: true
                    }}
                    alt="Cloudinary Sample Image"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    If you see an image above, Cloudinary is working!
                </p>
            </div>
        </div>
    );
}
