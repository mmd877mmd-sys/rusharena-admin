import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import SmsLog from "@/models/smsLog";
import Deposit from "@/models/dipositScema";
import Transactions from "@/models/transection";
import { catchError, response } from "@/lib/healperFunc";

// ✅ Validation schema

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { key, time } = body;

    // ✅ Validate input

    if (!key) {
      return response(false, 400, "key msg value is invalied");
    }

    // ✅ Find user
    // const user = await User.findById(userId);
    // if (!user) return response(false, 404, "User not found");

    // // ✅ Check if transaction already used
    // const trxUsed =
    //   (await Transactions.findOne({ trxId })) ||
    //   (await Deposit.findOne({ trxId }));
    // if (trxUsed)
    //   return response(false, 400, "This transaction ID is already used");

    // // ✅ Check if transaction exists in SMS logs
    // const smsLog = await SmsLog.findOne({ transactionId: trxId });

    // // ⚙️ CASE 1: trxId found in SmsLog → create direct transaction
    // if (smsLog) {
    //   const numericAmount = Number(smsLog.amount) || 0;

    //   // --- Create a transaction record ---
    //   await Transactions.create({
    //     userId,
    //     type: "deposit",
    //     method: smsLog.service || method,
    //     phone: smsLog.senderNumber || phone,
    //     id: trxId,
    //     amount: numericAmount,
    //     createdAt: new Date(),
    //   });

    //   // --- Update user balance ---
    //   const updatedUser = await User.findByIdAndUpdate(
    //     userId,
    //     { $inc: { dipositbalance: numericAmount } },
    //     { new: true }
    //   );

    //   if (!updatedUser)
    //     return response(false, 404, "User not found while updating balance");

    //   // ✅ Delete the used SmsLog record
    //   await SmsLog.deleteOne({ transactionId: trxId });

    return response(true, 200, "Deposit successful and balance updated");
    // }

    // ⚙️ CASE 2: trxId not found in SmsLog → create a pending deposit record
    // const newDeposit = await Deposit.create({
    //   userId,
    //   method,
    //   phone,
    //   trxId,
    // });

    // if (!newDeposit)
    //   return response(false, 500, "Failed to create deposit record");

    return response(true, 200, "Deposit request submitted successfully!");
  } catch (err) {
    console.error("Deposit route error:", err);
    return catchError(err);
  }
}
