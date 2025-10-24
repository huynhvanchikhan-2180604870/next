import mongoose from 'mongoose';

const { Schema } = mongoose;

const withdrawSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 10000
  },
  bankInfo: {
    bankName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    accountName: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  transactionId: {
    type: String
  }
}, {
  timestamps: true
});

let Withdraw;
try {
  Withdraw = mongoose.model('Withdraw');
} catch {
  Withdraw = mongoose.model('Withdraw', withdrawSchema);
}

export default Withdraw;