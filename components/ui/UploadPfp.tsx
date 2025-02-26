import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


function UploadPfp() {
    const router =  useRouter()
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [userPfp,setUserPfp] = useState<string|null>()
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

            console.log("THIS IS DATA ", data);

            console.log("this is imageurl", imageUrl);
            window.location.reload()
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {

        try {
            const res = await fetch(`/api/users/current-user`, {
                method: "GET",
                credentials: 'include'
            });


            if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
            const data = await res.json();
            const pfp = data.profilePhoto
            setUserPfp(pfp);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <div>
            <div className=''>
                <CldImage
                    height={200}
                    width={200}
                    crop='fill'
                    gravity='face'
                    src={userPfp||""}
                    alt="Social media preview"
                    className="rounded-lg border"
                />

                <h1 className="text-2xl mt-3 font-bold mb-6 text-gray-800">Update your pfp</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {file ? <div className="relative" >
                        <CldImage
                            height={500}
                            width={500}
                            crop='fill'
                            gravity='face'
                            src={fileUrl}
                            alt="Social media preview"
                            className="rounded-lg border"
                        />
                    </div> :
                        <div className="p-3 text-sm rounded-md   bg-red-100 text-red-800">
                            Select a image

                        </div>
                    }


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Uploading...' : 'Upload new profile pic'}
                    </button>

                    {message && (
                        <div className={`p-3 rounded-md  ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default UploadPfp