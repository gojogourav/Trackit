"use client";
import { useRef, useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary'

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileUrl,setFileUrl] = useState('');


  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setMessage('Invalid file type. Please upload JPEG, PNG, or WEBP.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage('File size exceeds 5MB limit.');
        return;
      }
      
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile)
      setFileUrl(fileUrl)
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file and enter an ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'profile');


      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setImageUrl(data.url);
      setMessage('Upload successful!');
      setFile(null);

      console.log("THIS IS DATA ",data);
      
      console.log("this is imageurl",imageUrl);
      
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Image Upload</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Type
          </label>

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
            accept="image/jpeg, image/png, image/webp"
            required
          />
        </div>
        {file&&<div className="relative" >
          <CldImage
          // width: 500, height: 500, crop: 'fill', gravity: 'face'
            height={500}
            width={500}
            crop='fill'
            gravity='face'
            src={fileUrl}
            alt="Social media preview"
            className="rounded-lg border"
          />
        </div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>

        {message && (
          <div className={`p-3 rounded-md  ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {imageUrl && (
          <div className="mt-4 flex flex-col">
            <p className="text-sm mx-auto text-gray-600 mb-2">your new pfp:</p>
            <CldImage
            height={300}
            width={300}
              src={imageUrl}
              alt="Uploaded preview"
              className=" justify-center mx-auto rounded-xl "
            />
          </div>
        )}
      </form>
    </div>
  );
}