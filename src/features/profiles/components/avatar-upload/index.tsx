'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { HiCamera } from 'react-icons/hi';
import styles from './avatar-upload.module.scss';

interface AvatarUploadProps {
  displayName: string;
  avatarUrl: string | null;
  onUpload: (url: string) => void;
  disabled?: boolean;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export default function AvatarUpload({
  displayName,
  avatarUrl,
  onUpload,
  disabled,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profiles/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.url);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const initials = getInitials(displayName || '??');
  const bgColor = getAvatarColor(displayName || '');

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handleButtonClick}
        aria-label="Upload avatar photo"
        aria-busy={isUploading}
        disabled={disabled || isUploading}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={displayName} fill sizes="120px" style={{ objectFit: 'cover' }} />
        ) : (
          <span className={styles.initials} style={{ backgroundColor: bgColor }} aria-hidden="true">
            {initials}
          </span>
        )}

        {isUploading && (
          <span className={styles.spinnerOverlay} aria-hidden="true">
            <span className={styles.spinner} />
          </span>
        )}
      </button>

      <span className={styles.cameraIcon} aria-hidden="true">
        <HiCamera />
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        aria-label="Choose avatar image"
        tabIndex={-1}
      />
    </div>
  );
}
