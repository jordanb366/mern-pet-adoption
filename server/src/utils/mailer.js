const nodemailer = require("nodemailer");

let transporter;
async function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && port && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
      });
      // verify connection - if it fails, we'll fall back to Ethereal below
      await transporter.verify();
      transporter.__isEthereal = false;
      console.info("Using configured SMTP transporter");
      return transporter;
    } catch (err) {
      console.warn(
        "Configured SMTP transporter verification failed; falling back to Ethereal",
        err
      );
      transporter = null;
      // fall through to Ethereal creation
    }
  }

  // If SMTP not configured, create an Ethereal test account for local development
  try {
    console.info(
      "SMTP not configured - creating Ethereal test account for local emails"
    );
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    transporter.__isEthereal = true; // flag to indicate we can show preview URLs
    return transporter;
  } catch (err) {
    console.warn(
      "Failed to create Ethereal account; emails will be skipped",
      err
    );
    return null;
  }
}

async function sendMail({ to, subject, text, html, from }) {
  const t = await getTransporter();
  if (!t) {
    console.info(
      "Skipping sendMail (no SMTP). To enable, set SMTP_HOST/PORT/USER/PASS in .env"
    );
    return;
  }
  const msg = {
    from:
      from ||
      process.env.FROM_EMAIL ||
      `no-reply@${process.env.SMTP_HOST || "localhost"}`,
    to,
    subject,
    text,
    html,
  };
  try {
    const info = await t.sendMail(msg);
    console.info("Email sent:", info.messageId);
    if (t.__isEthereal) {
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.info("Preview URL (Ethereal):", preview);
      // return the preview URL along with info to aid testing
      return { info, preview };
    }
    return { info };
  } catch (err) {
    console.error("Error sending email:", err);
    // If this wasn't an Ethereal transporter, try to create an Ethereal account and resend once
    if (!t.__isEthereal) {
      try {
        console.warn(
          "Attempting fallback: create Ethereal account and resend email"
        );
        const testAccount = await nodemailer.createTestAccount();
        const ethT = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        ethT.__isEthereal = true;
        const info2 = await ethT.sendMail(msg);
        const preview2 = nodemailer.getTestMessageUrl(info2);
        if (preview2) console.info("Preview URL (Ethereal):", preview2);
        // update global transporter so further sends use Ethereal in dev
        transporter = ethT;
        return { info: info2, preview: preview2 };
      } catch (err2) {
        console.error("Fallback via Ethereal failed:", err2);
        throw err2;
      }
    }
    throw err;
  }
}

module.exports = { sendMail };
