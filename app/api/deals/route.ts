export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    // Wake up Prisma safely ONLY when n8n actually sends data
    const prisma = getPrisma();

    const body = await request.json();
    const { title, content, affiliateUrl, platform, imageUrl, secret } = body;

    // Security check: Match the secret from n8n with your .env file
    if (secret !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Secret' }, { status: 401 });
    }

    // Save the deal directly to your Neon Database
    const newDeal = await prisma.deal.create({
      data: {
        title,
        content,
        affiliateUrl,
        platform,
        imageUrl,
      },
    });

    // Send a success message back to n8n
    return NextResponse.json({ 
      success: true, 
      message: "Deal successfully published!",
      dealId: newDeal.id 
    }, { status: 200 });

  } catch (error) {
    console.error("Error saving deal:", error);
    return NextResponse.json({ error: 'Failed to save the deal to the database.' }, { status: 500 });
  }
}