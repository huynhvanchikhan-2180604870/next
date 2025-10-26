import mongoose from 'mongoose';

const { Schema } = mongoose;

const requestSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  names: [{
    index: {
      type: Number,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    sessionNumber: {
      type: String,
      default: null
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  submissionType: {
    type: String,
    enum: ['file', 'manual'],
    required: true
  },
  fileName: {
    type: String
  },
  adminNotes: {
    type: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

let Request;
try {
  Request = mongoose.model('Request');
} catch {
  Request = mongoose.model('Request', requestSchema);
}

export default Request;