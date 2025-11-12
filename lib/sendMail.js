import nodmailer from "nodemailer";
import { catchError } from "./healperFunc";

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodmailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    }

  })

  const options = {
    from: `"Redoy Hossen Emon" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject: subject,
    html: body,
  }

  try {
    await transporter.sendMail(options)
    return { success: true }

  } catch (error) {
    return catchError(error)

  }



}