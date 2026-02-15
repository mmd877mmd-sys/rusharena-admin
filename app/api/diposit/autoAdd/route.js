import mongoose from "mongoose";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import Transactions from "@/models/transection";
import SmsLog from "@/models/smsLog";
import Deposit from "@/models/dipositScema";
import { catchError, response } from "@/lib/healperFunc";

export async function POST(req) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    let body;
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params.entries());
    }

    const { key, time, secret } = body;

    // 🔐 Webhook protection
    if (secret !== process.env.SMS_WEBHOOK_SECRET) {
      return response(false, 401, "Unauthorized");
    }

    if (!key) return response(false, 400, "Missing 'key'");

    // Better regex
    const amountMatch = key.match(/received\s*tk\s*([\d.]+)/i);
    const fromMatch = key.match(/from\s*(01[3-9]\d{8})/i);
    const trxIdMatch = key.match(/trxid[:\s]*([a-z0-9-]+)/i);
    const serviceMatch = key.match(/from\s*:\s*([a-z]+)/i);

    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    const senderNumber = fromMatch?.[1];
    const trxId = trxIdMatch?.[1];
    const service = serviceMatch?.[1];

    if (!amount || amount <= 0 || !senderNumber || !trxId || !service) {
      return response(false, 400, "Invalid transaction format");
    }

    // Prevent duplicate processing
    const existingTransaction = await Transactions.findOne({ trxId });
    if (existingTransaction) {
      return response(true, 200, "Already processed");
    }

    const deposit = await Deposit.findOne({ trxId });

    if (!deposit) {
      await SmsLog.create({
        service,
        senderNumber,
        amount,
        transactionId: trxId,
        receivedAt: time ? new Date(time) : new Date(),
      });

      return response(true, 200, "Logged for later matching");
    }

    // Verify details match
    if (
      deposit.phone !== senderNumber ||
      deposit.method !== service
    ) {
      return response(false, 400, "Deposit details mismatch");
    }

    await session.startTransaction();

    await Transactions.create(
      [
        {
          userId: deposit.userId,
          type: "deposit",
          method: service,
          phone: senderNumber,
          trxId,
          amount,
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      deposit.userId,
      { $inc: { dipositbalance: amount } },
      { session }
    );

    await Deposit.deleteOne({ _id: deposit._id }, { session });

    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Deposit successful");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return catchError(err);
  }
}
