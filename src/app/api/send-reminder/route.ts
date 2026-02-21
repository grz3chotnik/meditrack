import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { medicineName, dosage, email } = await request.json();

  const { error } = await resend.emails.send({
    from: "MediTrack <onboarding@resend.dev>",
    to: email,
    subject: `Reminder: Time to take ${medicineName}`,
    html: `<p>It's time to take <strong>${medicineName}</strong> (${dosage}).</p>`,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
