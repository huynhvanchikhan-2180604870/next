import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['request', 'update', 'system', 'tool'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
}, {
  timestamps: true
});

let Notification;
try {
  Notification = mongoose.model('Notification');
} catch {
  Notification = mongoose.model('Notification', notificationSchema);
}

export default Notification;