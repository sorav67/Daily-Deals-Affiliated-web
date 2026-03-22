export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// 🛡️ THE TITANIUM SHIELD
const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error("DATABASE_URL is missing from Vercel!");
    }

    // 1. Strip away any hidden quotes or spaces Vercel adds
    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    
    // 2. Auto-fix the URL if the "postgresql://" prefix was accidentally left out
    if (!dbUrl.startsWith('postgres')) {
      dbUrl = 'postgresql://' + dbUrl;
    }

    // 3. FORCE Prisma's internal engine to use our perfectly cleaned URL
    process.env.DATABASE_URL = dbUrl;

    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool as any);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
};

export default async function Home() {
  const prisma = getPrisma();

  // Fetch all deals from the database, newest first
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">LootDrop</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition">Today's Deals</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition">Trending</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-b from-blue-900 to-slate-900 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            The Best Tech Deals, <span className="text-blue-400">Curated by AI.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8">
            We scour the web for the deepest discounts and hidden gems so you don't have to. Updated in real-time.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Latest Drops</h2>
          <span className="text-sm font-medium text-slate-500">{deals.length} active deals</span>
        </div>
        
        {deals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <span className="text-4xl block mb-4">📡</span>
            <h3 className="text-lg font-bold text-slate-700">Awaiting Signal...</h3>
            <p className="text-slate-500">No deals found. The AI is hunting for discounts right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div 
                key={deal.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-slate-100 relative border-b border-slate-100 flex items-center justify-center overflow-hidden">
                  {deal.imageUrl ? (
                    <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 flex items-center justify-center">
                      <span className="text-5xl opacity-20">🎁</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {deal.platform}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-medium text-slate-400 mb-2">
                    {deal.createdAt.toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug line-clamp-2">
                    {deal.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
                    {deal.content}
                  </p>
                  
                  <a 
                    href={deal.affiliateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Claim Deal <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-400 font-bold">⚡</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} LootDrop. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">
            We may earn a commission for purchases made through our links. This helps keep the server running!
          </p>
        </div>
      </footer>
    </div>
  );
}