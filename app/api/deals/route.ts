export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const getPrisma = () => {
  const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
  
  if (!globalForPrisma.prisma) {
    let dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) throw new Error("DATABASE_URL is missing!");

    dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();
    if (!dbUrl.startsWith('postgres')) {
      dbUrl = 'postgresql://' + dbUrl;
    }

    const sql = neon(dbUrl);
    const adapter = new PrismaNeonHTTP(sql as any);

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
      return NextResponse.json({ error: 'Unauthorized: Invalid Secret' }, { status: 401 });
    }

    const newDeal = await prisma.deal.create({
      data: { title, content, affiliateUrl, platform, imageUrl },
    });

    return NextResponse.json({ success: true, message: "Deal successfully published!", dealId: newDeal.id }, { status: 200 });

  } catch (error) {
    console.error("Error saving deal:", error);
    return NextResponse.json({ error: 'Failed to save the deal to the database.' }, { status: 500 });
  }
}