'use client'; // Tells Next.js this runs on the user's device, not the server

export default function ClaimButton({ url, platform }: { url: string, platform: string }) {
  // Ensure we have a valid absolute URL for the href attribute
  let safeUrl = url.trim();
  if (!safeUrl.startsWith('http')) {
    safeUrl = 'https://' + safeUrl;
  }

  // Use a standard anchor tag without target="_blank" and without rel="noopener noreferrer".
  // 1. target="_blank" prevents Android 12+ from intercepting App Links because they force opening in the browser.
  // 2. rel="noopener noreferrer" strips the HTTP Referer, which triggers Amazon's bot protection 
  //    and serves broken HTML (the `doctype html>` issue) on mobile devices.
  // 3. Javascript window.location.href assignments often fail to trigger OS Deep Links due to user-interaction security rules.
  return (
    <a 
      href={safeUrl}
      className="inline-flex justify-center items-center py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl transition-transform hover:scale-105 shadow-lg shadow-blue-200"
    >
      Go to {platform} to Claim <span className="ml-2">→</span>
    </a>
  );
}