import mongoose from 'mongoose';

const balanceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
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

let BalanceRequest;
try {
  BalanceRequest = mongoose.model('BalanceRequest');
} catch {
  BalanceRequest = mongoose.model('BalanceRequest', balanceRequestSchema);
}

export default BalanceRequest;