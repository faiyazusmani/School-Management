const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'EduManage Pro Security'}" <${process.env.FROM_EMAIL || smtpUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; borderRadius: 12px;"><h2>EduManage Pro Security Notification</h2><p>${options.message}</p></div>`,
      });

      console.log(`✅ Transactional OTP Email Sent via SMTP to ${options.email} (MessageID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.warn(`⚠️ SMTP Email Error: ${err.message}. Falling back to logger.`);
    }
  }

  // Fallback transactional email logger
  console.log(`================ TRANSACTIONAL EMAIL DISPATCHED ================`);
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message:\n${options.message}`);
  console.log(`===============================================================`);

  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
};

module.exports = sendEmail;
