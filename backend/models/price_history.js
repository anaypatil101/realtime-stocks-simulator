import mongoose from 'mongoose';

const priceHistorySchema = mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  },
  ticker: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete records older than 24 hours
priceHistorySchema.index({ recordedAt: 1 }, { expireAfterSeconds: 86400 });
// Speed up per-ticker queries
priceHistorySchema.index({ ticker: 1, recordedAt: -1 });

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

export default PriceHistory;
