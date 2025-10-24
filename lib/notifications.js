import connectDB from './db';
import Notification from '../models/Notification';
import User from '../models/User';
import { sendEmail } from './email';

export const createNotification = async (userId, title, message, type = 'system', relatedId = null) => {
  try {
    await connectDB();
    
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      relatedId
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const notifyAdminsNewRequest = async (requestId, userName) => {
  try {
    await connectDB();
    
    const admins = await User.find({ role: 'admin' });
    
    for (const admin of admins) {
      // Create notification
      await createNotification(
        admin._id,
        'Yêu cầu mới từ người dùng',
        `${userName} đã gửi yêu cầu mới cần xử lý`,
        'request',
        requestId
      );
      
      // Send email
      await sendEmail(
        admin.email,
        'Yêu cầu mới cần xử lý - BankThue',
        `
        <h2>Yêu cầu mới từ người dùng</h2>
        <p>Người dùng <strong>${userName}</strong> đã gửi yêu cầu mới cần xử lý.</p>
        <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
        `
      );
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
};

export const notifyUserRequestUpdate = async (userId, status, requestId) => {
  try {
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) return;
    
    const statusText = {
      processing: 'đang được xử lý',
      completed: 'đã hoàn thành',
      rejected: 'đã bị từ chối'
    };
    
    // Create notification
    await createNotification(
      userId,
      'Cập nhật yêu cầu',
      `Yêu cầu của bạn ${statusText[status] || 'đã được cập nhật'}`,
      'update',
      requestId
    );
    
    // Send email
    await sendEmail(
      user.email,
      'Cập nhật yêu cầu - BankThue',
      `
      <h2>Cập nhật yêu cầu</h2>
      <p>Xin chào <strong>${user.fullName}</strong>,</p>
      <p>Yêu cầu của bạn ${statusText[status] || 'đã được cập nhật'}.</p>
      <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
      `
    );
  } catch (error) {
    console.error('Error notifying user:', error);
  }
};