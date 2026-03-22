export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL is missing!");

    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) dbUrl = 'postgresql://' + dbUrl;

    // PRISMA 7 OFFICIAL SETUP: No Pool required!
    const adapter = new PrismaNeon({ connectionString: dbUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
};

export default async function Home() {
  const prisma = getPrisma();
  const deals = await prisma.deal.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">⚡</span></div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">LootDrop</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition">Today's Deals</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 font-medium transition">Trending</a>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-b from-blue-900 to-slate-900 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">The Best Tech Deals, <span className="text-blue-400">Curated by AI.</span></h1>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Latest Drops</h2>
        </div>
        
        {deals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-lg font-bold text-slate-700">Awaiting Signal...</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{deal.title}</h3>
                  <a href={deal.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                    Claim Deal <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}