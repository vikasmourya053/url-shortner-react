"use client";
import { useState } from 'react';

interface QRCodeModalProps {
  qrCode: string;
  username: string;
  onClose: () => void;
}

export function QRCodeModal({ qrCode, username, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const linktreeUrl = `${window.location.origin}/linktree/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linktreeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `linktree-${username}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          QR Code
        </h2>
        
        <div className="mb-6">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-48 h-48 mx-auto rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Share this QR code to let people easily access your Linktree
          </p>
          <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <input
              type="text"
              value={linktreeUrl}
              readOnly
              className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white"
            />
            <button
              onClick={copyToClipboard}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={downloadQRCode}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
