const { sendMail } = require("../src/utils/mailer");

async function main() {
  try {
    const result = await sendMail({
      to: "tester@example.com",
      subject: "Test Email from Pet Adoption App",
      text: "This is a test email to show Ethereal preview URL",
    });
    console.log("sendMail result:", result);
  } catch (err) {
    console.error("Error sending test email:", err);
  }
}

main();
