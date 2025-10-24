import { NextResponse } from 'next/server';
import { authenticateUser } from '../../../lib/auth';
import { parseFileContent } from '../../../lib/utils';

export async function POST(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'Không có file được tải lên' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const allowedTypes = ['txt', 'json', 'xlsx', 'xls'];

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Chỉ hỗ trợ file .txt, .json, .xlsx, .xls' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const parseResult = parseFileContent(fileBuffer, fileExtension);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      );
    }

    if (parseResult.names.length === 0) {
      return NextResponse.json(
        { error: 'File không chứa tên hợp lệ nào' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Xử lý file thành công',
      names: parseResult.names,
      fileName: fileName,
      count: parseResult.names.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xử lý file' },
      { status: 500 }
    );
  }
}