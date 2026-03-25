'use client'; // Tells Next.js this runs on the user's device, not the server

export default function ClaimButton({ url, platform }: { url: string, platform: string }) {
  // Use a standard semantic anchor tag to allow the mobile OS (Android/iOS) to naturally intercept App Links.
  // This securely prevents the "Play Store Fallback" caused by improperly formatted intent:// URIs.
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex justify-center items-center py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl transition-transform hover:scale-105 shadow-lg shadow-blue-200"
    >
      Go to {platform} to Claim <span className="ml-2">→</span>
    </a>
  );
}