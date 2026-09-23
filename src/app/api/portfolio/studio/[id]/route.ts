import { NextRequest, NextResponse } from 'next/server';
import { getStudioPortfolioItemById } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const item = await getStudioPortfolioItemById(id);

    if (!item) {
      return NextResponse.json({ error: 'Studio portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Error fetching studio portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve studio portfolio item' },
      { status: 500 }
    );
  }
}
