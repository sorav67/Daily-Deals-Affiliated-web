'use client'; // Tells Next.js this runs on the user's device, not the server

export default function ClaimButton({ url, platform }: { url: string, platform: string }) {
  const handleDeepLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Ensure URL has protocol to prevent URL parsing errors
    let safeUrl = url;
    if (!safeUrl.startsWith('http')) {
      safeUrl = 'https://' + safeUrl;
    }

    if (platform.toLowerCase() === 'amazon') {
      try {
        const urlObj = new URL(safeUrl);
        const pathAndQuery = urlObj.pathname + urlObj.search;
        const host = urlObj.host; // e.g., www.amazon.in

        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
          // Determine the correct Amazon Android package based on the TLD
          let appPackage = 'com.amazon.mShop.android.shopping';
          if (host.includes('.in')) {
            appPackage = 'in.amazon.mShop.android.shopping';
          } else if (host.includes('.co.uk')) {
            appPackage = 'uk.amazon.mShop.android.shopping';
          }

          window.location.href = `intent://${host}${pathAndQuery}#Intent;scheme=https;package=${appPackage};end;`;
        } else if (isIOS) {
          window.location.href = `amzn://${host}${pathAndQuery}`;
          setTimeout(() => {
            window.location.href = safeUrl;
          }, 1500);
        } else {
          window.location.href = safeUrl;
        }
      } catch (error) {
        window.location.href = safeUrl;
      }
    } else {
      window.location.href = safeUrl;
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