export const dynamic = 'force-dynamic'; 

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClaimButton from '../../components/ClaimButton'; 

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL is missing!");
    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) dbUrl = 'postgresql://' + dbUrl;

    const adapter = new PrismaNeon({ connectionString: dbUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
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
  return { title: `${deal.title} - LootDrop` };
}

export default async function DealPage({ params }: Props) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) notFound();
  
  const prisma = getPrisma();
  const deal = await prisma.deal.findUnique({ where: { id: resolvedParams.id } });
  if (!deal) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{deal.title}</h1>
          <ClaimButton url={deal.affiliateUrl} platform={deal.platform} />
        </div>
      </main>
    </div>
  );
}