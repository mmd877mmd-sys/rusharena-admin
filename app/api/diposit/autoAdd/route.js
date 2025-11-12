import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import SmsLog from "@/models/smsLog";
import Deposit from "@/models/dipositScema";
import Transactions from "@/models/transection";
import { catchError, response } from "@/lib/healperFunc";
import smsLog from "@/models/smsLog";

// ✅ Validation schema

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { key, time } = body;
    console.log("Incoming SMSForwarder request body:", body);
    // ✅ Validate input

    // if (!key) {
    //   return response(false, 400, "key msg value is invalied");
    // }

    // // 🧠 Extract using regex
    // const amountMatch = key.match(/received Tk\s*([\d.]+)/i);
    // const fromMatch = key.match(/from\s*(01[3-9]\d{8})/i);
    // const trxIdMatch = key.match(/TrxID\s*([A-Z0-9]+)/i);
    // const dateMatch = key.match(/at\s*([\d/]+\s+\d{2}:\d{2})/i);

    // // ✅ Extracted values

    // const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    // const senderNumber = fromMatch ? fromMatch[1] : null;
    // const trxId = trxIdMatch ? trxIdMatch[1] : null;

    // // ✅ Check if transaction exists in deposit
    // const deposit = await deposit.findOne(trxId);

    // // ⚙️ CASE 2: trxId not found in deposit → create a pending sms log

    // if (deposit) {
    const newsmsLog = await smsLog.create({
      service: "method",
      senderNumber: "01",
      amount: "10",
      transactionId: key,
    });
    // }

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

    // if (!newDeposit)
    //   return response(false, 500, "Failed to create deposit record");

    return response(true, 200, "Deposit request submitted successfully!");
  } catch (err) {
    console.error("Deposit route error:", err);
    return catchError(err);
  }
}
