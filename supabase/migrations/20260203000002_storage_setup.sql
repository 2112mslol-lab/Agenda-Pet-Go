-- Migration to setup storage for shop assets

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-assets', 'shop-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'shop-assets' );

-- 3. Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload their own assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'shop-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to update/delete their own assets
CREATE POLICY "Users can update their own assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'shop-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'shop-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
