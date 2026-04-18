import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Coin packages — amount is in INR paise (1 INR = 100 paise)
const PACKAGES = {
  starter: { coins: 50000,   amountPaise: 9900,  label: 'Starter Pack' },
  trader:  { coins: 125000,  amountPaise: 19900, label: 'Trader Pack'  },
  pro:     { coins: 350000,  amountPaise: 49900, label: 'Pro Pack'     },
};

// POST /payment/create-order
export const createOrder = async (req, res) => {
  try {
    const { packageId } = req.body;
    const pkg = PACKAGES[packageId];

    if (!pkg) {
      return res.status(400).json({ message: 'Invalid package selected.' });
    }

    const order = await razorpay.orders.create({
      amount: pkg.amountPaise,
      currency: 'INR',
      receipt: `rcpt_${req.userId.toString().slice(-12)}_${Date.now().toString().slice(-8)}`,
      notes: { userId: req.userId, packageId, coins: pkg.coins },
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      packageLabel: pkg.label,
      coins: pkg.coins,
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({ message: 'Failed to create payment order.' });
  }
};

// POST /payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packageId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return res.status(400).json({ message: 'Invalid package.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { coins: pkg.coins } },
      { new: true },
    );

    res.status(200).json({
      message: `Payment verified! ${pkg.coins.toLocaleString()} coins added.`,
      coins: updatedUser.coins,
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
};
