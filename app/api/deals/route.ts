import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// 1. Create the Neon adapter bridge
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string,
});

// 2. Hand the bridge to Prisma
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
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