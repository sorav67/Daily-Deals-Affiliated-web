export const dynamic = 'force-dynamic'; 

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClaimButton from '../../components/ClaimButton'; 

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) throw new Error("DATABASE_URL is missing!");

    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) {
      dbUrl = 'postgresql://' + dbUrl;
    }

    process.env.DATABASE_URL = dbUrl;
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams?.id) return { title: 'Deal Not Found' };

  const prisma = getPrisma();
  const deal = await prisma.deal.findUnique({ where: { id: resolvedParams.id } });

  if (!deal) return { title: 'Deal Not Found' };

  return {
    title: `${deal.title} - LootDrop`,
    description: deal.content || 'Check out this amazing deal!',
    openGraph: { title: deal.title, description: deal.content || 'Check out this amazing deal!', images: deal.imageUrl ? [deal.imageUrl] : [] },
  };
}

export default async function DealPage({ params }: Props) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) notFound();

  const prisma = getPrisma();
  const deal = await prisma.deal.findUnique({ where: { id: resolvedParams.id } });

  if (!deal) notFound();

  const similarDeals = await prisma.deal.findMany({
    where: { id: { not: deal.id } }, take: 3, orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold">⚡</span></div>
          <a href="/" className="font-extrabold text-xl text-slate-900">LootDrop</a>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16 text-center">
          <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider rounded-full mb-6">{deal.platform} Deal</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{deal.title}</h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">{deal.content}</p>
          <ClaimButton url={deal.affiliateUrl} platform={deal.platform} />
        </div>

        {similarDeals.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">More Active Deals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarDeals.map((similar) => (
                <a key={similar.id} href={`/deal/${similar.id}`} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition block group">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">{similar.platform}</div>
                  <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">{similar.title}</h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}