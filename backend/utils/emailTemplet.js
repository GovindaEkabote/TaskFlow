export function generateForgotPasswordTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password for your <strong>FYP SYSTEM</strong> account.</p>

      <p>Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>

      <a href="${resetPasswordUrl}" 
         style="
           display: inline-block;
           padding: 12px 20px;
           margin: 16px 0;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
           font-weight: bold;
         ">
        Reset Password
      </a>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetPasswordUrl}</p>

      <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>

      <br />
      <p>Thanks,<br/>FYP SYSTEM Team</p>
    </div>
  `;
}
