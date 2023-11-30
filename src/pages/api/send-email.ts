import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
import { env } from "../../env.mjs"; // Import the env object
sgMail.setApiKey(env.SENDGRID_API_KEY);

async function sendEmailWithICS(icsData: string, recipientEmail: string) {
  const msg = {
    to: recipientEmail,
    //from: 'paulo.dacunha@go1.com',
    from: "pcunha03@gmail.com",
    subject: "Scheduled Learning Session",
    text: "A dedicated time block for learning.",
    attachments: [
      {
        content: Buffer.from(icsData).toString("base64"),
        filename: "scheduled_learning.ics",
        type: "text/calendar",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { icsData, email } = req.body;
      await sendEmailWithICS(icsData, email);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
