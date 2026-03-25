export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  
  if (!globalForPrisma.prisma) {
    // 🛡️ Using the new variable name to prevent Prisma/Vercel conflicts
    let dbUrl = process.env.NEON_DATABASE_URL;

    if (!dbUrl) {
      throw new Error("NEON_DATABASE_URL is missing! Please update your Vercel Environment Variables.");
    }

    // Clean formatting
    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) dbUrl = 'postgresql://' + dbUrl;

    // Initialize using the PrismaNeonHttp driver
    const adapter = new PrismaNeonHttp(dbUrl, { fetchOptions: {} } as any);

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
};

export default async function Home() {
  const prisma = getPrisma();
  const deals = await prisma.deal.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">LootDrop</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">Latest Drops</h2>
        {deals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-lg font-bold text-slate-700">Awaiting Signal...</h3>
            <p className="text-slate-500">No deals found yet. Checking for new discounts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all p-6 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{deal.title}</h3>
                <a href={`/deal/${deal.id}`} className="mt-auto py-3 px-4 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition">
                  View Deal →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}