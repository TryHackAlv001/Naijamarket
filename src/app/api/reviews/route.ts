import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin';
import {
  validateBuyerPurchased,
  hasBuyerReviewedProduct,
  recalculateProductRating,
} from '@/lib/reviews';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { productId, rating, comment } = await request.json();

    // Validate input
    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (comment && comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Validate that buyer purchased and received the product
    const hasPurchased = await validateBuyerPurchased(user.id, productId);
    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You must purchase and receive this product to review it' },
        { status: 403 }
      );
    }

    // Check if buyer already reviewed this product
    const alreadyReviewed = await hasBuyerReviewedProduct(user.id, productId);
    if (alreadyReviewed) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Create review
    const { data, error: reviewError } = await supabaseAdminClient
      .from('reviews')
      .insert([
        {
          product_id: productId,
          buyer_id: user.id,
          rating,
          comment: comment?.trim() || null,
        },
      ])
      .select('*')
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    // Recalculate product rating
    try {
      await recalculateProductRating(productId);
    } catch (err) {
      console.error('Error recalculating rating:', err);
      // Don't fail the request if rating recalculation fails
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in reviews POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check if user can review a product
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if user has purchased the product
    const hasPurchased = await validateBuyerPurchased(user.id, productId);

    // Check if user has already reviewed
    const alreadyReviewed = await hasBuyerReviewedProduct(user.id, productId);

    return NextResponse.json({
      canReview: hasPurchased && !alreadyReviewed,
      hasPurchased,
      alreadyReviewed,
    });
  } catch (error) {
    console.error('Error in reviews GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}