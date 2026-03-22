'use client'; // Tells Next.js this runs on the user's device, not the server

export default function ClaimButton({ url, platform }: { url: string, platform: string }) {
  const handleDeepLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (platform.toLowerCase() === 'amazon') {
      try {
        const urlObj = new URL(url);
        const pathAndQuery = urlObj.pathname + urlObj.search;
        const host = urlObj.host; // e.g., www.amazon.in

        // Detect if the user is on a mobile device
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
          // Fire the Android Intent to open the native Amazon App
          window.location.href = `intent://${host}${pathAndQuery}#Intent;scheme=https;package=com.amazon.mShop.android.shopping;end;`;
        } else if (isIOS) {
          // Fire the iOS deep link for iPhones
          window.location.href = `amzn://${host}${pathAndQuery}`;
          
          // Fallback just in case they don't have the app installed
          setTimeout(() => {
            window.location.href = url;
          }, 1500);
        } else {
          // They are on a Desktop computer, just open a new tab normally
          window.open(url, '_blank');
        }
      } catch (error) {
        // If anything fails, fallback to standard web link
        window.open(url, '_blank');
      }
    } else {
      // If it's Flipkart or another platform, open normally for now
      window.open(url, '_blank');
    }
  };

  return (
    <button 
      onClick={handleDeepLink}
      className="inline-flex justify-center items-center py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl transition-transform hover:scale-105 shadow-lg shadow-blue-200"
    >
      Go to {platform} to Claim <span className="ml-2">→</span>
    </button>
  );
}