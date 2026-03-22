import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClaimButton from '../../components/ClaimButton'; 

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

// Next.js 15 requires params to be a Promise
type Props = {
  params: Promise<{ id: string }>;
};

// 1. Generate Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // AWAIT the params before reading the ID!
  const resolvedParams = await params;
  
  const deal = await prisma.deal.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!deal) return { title: 'Deal Not Found' };

  return {
    title: `${deal.title} - LootDrop`,
    description: deal.content || 'Check out this amazing deal!',
    openGraph: {
      title: deal.title,
      description: deal.content || 'Check out this amazing deal!',
      images: deal.imageUrl ? [deal.imageUrl] : [],
    },
  };
}

// 2. The actual Product Page UI
export default async function DealPage({ params }: Props) {
  // AWAIT the params before reading the ID!
  const resolvedParams = await params;

  // Fetch the specific deal clicked by the user
  const deal = await prisma.deal.findUnique({
    where: { id: resolvedParams.id },
  });

  // If the deal doesn't exist, show a 404 page
  if (!deal) {
    notFound();
  }

  // Fetch 3 recent deals to show at the bottom (excluding the current one)
  const similarDeals = await prisma.deal.findMany({
    where: { id: { not: deal.id } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <a href="/" className="font-extrabold text-xl text-slate-900">LootDrop</a>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        {/* MAIN PRODUCT SPOTLIGHT */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16 text-center">
          <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider rounded-full mb-6">
            {deal.platform} Deal
          </span>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {deal.title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {deal.content}
          </p>
          
          {/* Your smart button! */}
          <ClaimButton url={deal.affiliateUrl} platform={deal.platform} />
        </div>

        {/* SIMILAR DEALS SECTION */}
        {similarDeals.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
              More Active Deals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarDeals.map((similar) => (
                <a key={similar.id} href={`/deal/${similar.id}`} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition block group">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">{similar.platform}</div>
                  <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
                    {similar.title}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}