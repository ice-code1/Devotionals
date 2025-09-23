import React, { useRef } from 'react';
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from 'html2canvas';
import { Download, Copy, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAnalyticsContext } from './AnalyticsProvider';

interface ShareCardProps {
  title: string;
  scripture: string;
  shortKeyPoint: string;
  authorName: string;
  authorImage: string;
  canonicalUrl: string;
  section: 'children' | 'teenagers';
  date: string;
  slug: string;
}

export default function ShareCard({
  title,
  scripture,
  shortKeyPoint,
  authorName,
  authorImage,
  canonicalUrl,
  section,
  date,
  slug
}: ShareCardProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const { trackDownload, trackShare, trackClick } = useAnalyticsContext();

  const downloadImage = async () => {
    if (!shareCardRef.current) return;

    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: section === 'children' ? '#FEF3C7' : '#1E1B4B',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${format(new Date(date), 'yyyy-MM-dd')}-${section}-${slug}.png`;
      link.href = canvas.toDataURL();
      trackDownload(link.download, slug);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      trackShare('copy-link', slug);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        trackShare('native-share', slug);
        await navigator.share({
          title: title,
          text: `${shortKeyPoint}\n\n${scripture}`,
          url: canonicalUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      trackShare('fallback-copy', slug);
      copyLink();
    }
  };

  const shortUrl = new URL(canonicalUrl).hostname + '/d/' + slug.split('-').slice(0, 2).join('');

  return (
    <div className="space-y-6">
      <div
        ref={shareCardRef}
        className={`w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl relative overflow-hidden ${
          section === 'children'
            ? 'bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200'
            : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white"></div>
        </div>
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              {title}
            </h3>
            <div className={`text-sm font-medium ${
              section === 'children' ? 'text-gray-600' : 'text-purple-200'
            }`}>
              {format(new Date(date), 'MMMM dd, yyyy')}
            </div>
          </div>

          {/* Scripture */}
          <div className={`text-center p-4 rounded-xl ${
            section === 'children' 
              ? 'bg-white/70 text-gray-800' 
              : 'bg-white/10 text-white border border-white/20'
          }`}>
            <p className="font-semibold text-lg leading-relaxed">
              "{scripture}"
            </p>
          </div>

          {/* Key Point */}
          <div className={`text-center ${
            section === 'children' ? 'text-gray-700' : 'text-gray-100'
          }`}>
            <p className="text-base leading-relaxed">
              {shortKeyPoint}
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center justify-center space-x-3">
            <img
              src={authorImage}
              alt={authorName}
              className="w-12 h-12 rounded-full border-2 border-white/50"
            />
            <div className={`text-sm font-medium ${
              section === 'children' ? 'text-gray-600' : 'text-gray-200'
            }`}>
              {authorName}
            </div>
          </div>

          {/* URL and QR Code */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className={`text-xs ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {shortUrl}
            </div>
            <div className="bg-white p-2 rounded-lg">
              <QRCodeCanvas value={canonicalUrl} size={48} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadImage}
          onClickCapture={() => trackClick('download-png', `devotional-${slug}`)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG</span>
        </button>
        
        <button
          onClick={copyLink}
          onClickCapture={() => trackClick('copy-link', `devotional-${slug}`)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Link</span>
        </button>
        
        <button
          onClick={shareContent}
          onClickCapture={() => trackClick('share-content', `devotional-${slug}`)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}