export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL is missing!");
    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) dbUrl = 'postgresql://' + dbUrl;

    const url = new URL(dbUrl);
    const pool = new Pool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: parseInt(url.port) || 5432,
      ssl: true,
    });

    const adapter = new PrismaNeon(pool as any);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
};

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const { title, content, affiliateUrl, platform, imageUrl, secret } = body;

    if (secret !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newDeal = await prisma.deal.create({
      data: { title, content, affiliateUrl, platform, imageUrl },
    });

    return NextResponse.json({ success: true, dealId: newDeal.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Database crash' }, { status: 500 });
  }
}