import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Category from '../../../../models/Category';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Tên category là bắt buộc' }, { status: 400 });
    }

    await connectDB();
    const category = new Category({ name, description });
    await category.save();

    return NextResponse.json({ message: 'Tạo category thành công', category });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Tên category đã tồn tại' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id, name, description, isActive } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID category là bắt buộc' }, { status: 400 });
    }

    await connectDB();
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, isActive },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Không tìm thấy category' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cập nhật thành công', category });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID category là bắt buộc' }, { status: 400 });
    }

    await connectDB();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Xóa category thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}