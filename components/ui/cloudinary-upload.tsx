'use client';

import { useState, useCallback } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'cloudinary-upload-widget': any;
    }
  }
}

interface CloudinaryResult {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format: string;
  resource_type: string;
}

interface CloudinaryUploadProps {
  onUploadSuccess?: (_result: CloudinaryResult) => void;
  onUploadError?: (_error: any) => void;
  folder?: string;
  tags?: string[];
}

export function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  folder = 'uploads',
  tags = ['mr5school']
}: CloudinaryUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = useCallback((result: any) => {
    setIsUploading(false);
    setUploadedImage(result.info);
    onUploadSuccess?.(result.info);
  }, [onUploadSuccess]);

  const handleUploadError = useCallback((error: any) => {
    setIsUploading(false);
    console.error('Upload error:', error);
    onUploadError?.(error);
  }, [onUploadError]);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Media Upload</CardTitle>
        <CardDescription>Upload images or videos to Cloudinary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            folder,
            tags,
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFiles: 5,
            styles: {
              palette: {
                window: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                menuIcons: '#5A616A',
                textDark: '#000000',
                textLight: '#FFFFFF',
                link: '#0078FF',
                action: '#FF620C',
                inactiveTabIcon: '#0078FF',
                error: '#F44235',
                inProgress: '#0078FF',
                complete: '#20B832',
                sourceBg: '#E4EBF1'
              },
              fonts: {
                default: null,
                "'Fira Sans', sans-serif": {
                  url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
                  active: true
                }
              }
            }
          }}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          onOpen={handleUploadStart}
        >
          {({ open }) => (
            <Button
              onClick={() => open()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          )}
        </CldUploadWidget>

        {uploadedImage && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Uploaded Media:</h3>
            {uploadedImage.resource_type === 'image' ? (
              <CldImage
                src={uploadedImage.public_id}
                alt={uploadedImage.original_filename}
                width={300}
                height={200}
                crop="fill"
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Uploaded {uploadedImage.resource_type}: {uploadedImage.original_filename}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground break-all">
              URL: {uploadedImage.secure_url}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}