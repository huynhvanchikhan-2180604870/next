import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (email, code, fullName) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Xác thực tài khoản - BankThue.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Xác thực tài khoản</h2>
          <p>Xin chào <strong>${fullName}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại BankThue.com. Vui lòng sử dụng mã xác thực sau:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0;">${code}</h1>
          </div>
          <p>Mã xác thực có hiệu lực trong 10 phút.</p>
          <p>Trân trọng,<br>Đội ngũ BankThue.com</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.log(`FALLBACK: Verification code for ${email}: ${code}`);
    // Don't throw error, just log it
  }
};

export const sendRequestNotificationToAdmin = async (userName, requestId) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Yêu cầu mới từ người dùng - BankThue.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Yêu cầu mới cần xử lý</h2>
          <p>Người dùng <strong>${userName}</strong> đã gửi yêu cầu mới.</p>
          <p><strong>ID yêu cầu:</strong> ${requestId}</p>
          <p>Vui lòng đăng nhập vào hệ thống để xử lý yêu cầu này.</p>
          <a href="${process.env.APP_URL}/admin/requests" 
             style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Xem yêu cầu
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for request ${requestId}`);
  } catch (error) {
    console.error('Admin email failed:', error.message);
    console.log(`FALLBACK: New request from ${userName} - ID: ${requestId}`);
  }
};

export const sendRequestUpdateToUser = async (email, userName, status, requestId) => {
  try {
    const statusText = {
      processing: 'đang xử lý',
      completed: 'đã hoàn thành',
      rejected: 'đã bị từ chối'
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Cập nhật yêu cầu - BankThue.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Cập nhật yêu cầu</h2>
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Yêu cầu của bạn (ID: ${requestId}) đã được cập nhật trạng thái: <strong>${statusText[status]}</strong></p>
          <a href="${process.env.APP_URL}/user/manage" 
             style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Xem chi tiết
          </a>
          <p>Trân trọng,<br>Đội ngũ BankThue.com</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Update email sent to ${email}`);
  } catch (error) {
    console.error('Update email failed:', error.message);
    console.log(`FALLBACK: Request ${requestId} status updated to ${status} for ${userName}`);
  }
};