import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Category from '../../../models/Category';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}