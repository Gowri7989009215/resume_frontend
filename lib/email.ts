export function getSenderAddress() {
  return process.env.SMTP_FROM || process.env.EMAIL_FROM || "onboarding@resumeiq.com";
}

export function getEmailErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return "Unknown email provider error";
}

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  const apiKey = process.env.SMTP_API_KEY?.trim();
  console.log("Brevo API Key available:", apiKey ? apiKey.substring(0, 10) + "..." : "No");

  if (!apiKey) {
    return { error: new Error("SMTP_API_KEY is not configured for Brevo") };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "ResumeIQ", email: getSenderAddress() },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        textContent: text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: new Error(errorData.message || "Failed to send email via Brevo") };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { error };
  }
}
