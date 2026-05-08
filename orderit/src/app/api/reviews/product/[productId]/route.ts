import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'recent'; // recent, highest, lowest

    let query = supabaseAdminClient
      .from('reviews')
      .select(
        `
        *,
        buyer:buyer_id(id, full_name, avatar_url)
        `,
        { count: 'exact' }
      )
      .eq('product_id', productId);

    // Apply sorting
    switch (sort) {
      case 'highest':
        query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'lowest':
        query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({
      reviews: data || [],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0),
    });
  } catch (error) {
    console.error('Error in reviews GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}