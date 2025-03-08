export async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password/${token}`;

  await fetch("https://api.your-email-service.com/send", {
    method: "POST",
    body: JSON.stringify({
      to: email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetLink}`,
    }),
    headers: { "Content-Type": "application/json" },
  });
}
