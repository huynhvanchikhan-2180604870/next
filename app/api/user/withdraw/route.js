import { NextResponse } from "next/server";
import { authenticateUser } from "../../../../lib/auth";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import Withdraw from "../../../../models/Withdraw";
import { sendWithdrawRequestToAdmin } from "../../../../lib/email";

export async function POST(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { amount, bankInfo } = await request.json();

    if (!amount || amount < 10000) {
      return NextResponse.json(
        { error: "Số tiền rút tối thiểu là 10,000 GẠCH" },
        { status: 400 }
      );
    }

    if (
      !bankInfo ||
      !bankInfo.bankName ||
      !bankInfo.accountNumber ||
      !bankInfo.accountName
    ) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đầy đủ thông tin ngân hàng" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(auth.user._id);
    if (user.balance < amount) {
      return NextResponse.json({ error: "Số dư không đủ để rút tiền" }, { status: 400 });
    }

    // Trừ tiền từ balance ngay lập tức
    await User.findByIdAndUpdate(
      auth.user._id,
      { $inc: { balance: -amount } }
    );

    const withdraw = new Withdraw({
      userId: auth.user._id,
      amount,
      bankInfo,
    });

    await withdraw.save();

    // Gửi email cho admin
    await sendWithdrawRequestToAdmin(
      user.fullName,
      amount,
      bankInfo,
      withdraw._id
    );

    return NextResponse.json({
      message: "Tạo lệnh rút tiền thành công. Tiền đã được trừ khỏi số dư.",
      withdrawId: withdraw._id,
    });
  } catch (error) {
    console.error("Withdraw request error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const auth = await authenticateUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await connectDB();

    const withdraws = await Withdraw.find({ userId: auth.user._id })
      .sort({ createdAt: -1 })
      .populate("processedBy", "fullName");

    return NextResponse.json({ withdraws });
  } catch (error) {
    console.error("Get withdraws error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
