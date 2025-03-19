
import React, { useState, useRef } from "react";
import { User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, UserData } from "@/context/AuthContext";

interface ProfileImageUploadProps {
  userId: string;
  currentImage?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, currentImage }) => {
  const [image, setImage] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateDriverProfile } = useAuth();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    // Read and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      updateDriverProfile(userId, { profileImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-32 h-32 rounded-full cursor-pointer overflow-hidden border-4 border-white shadow-md mb-2"
        onClick={handleImageClick}
      >
        {image ? (
          <img 
            src={image} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <User className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
          <Upload className="w-8 h-8 text-white opacity-0 hover:opacity-100" />
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleImageClick}
        className="mt-2"
      >
        {image ? "Change Picture" : "Upload Picture"}
      </Button>
    </div>
  );
};

export default ProfileImageUpload;
