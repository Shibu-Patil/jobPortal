// // // utils/sendEmail.js
// // const nodemailer = require("nodemailer");

// // const sendEmail = async ({ to, subject, text, html }) => {
// //   try {
// //     // Create transporter
// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER, // your gmail
// //         pass: process.env.EMAIL_PASS, // app password
// //       },
// //     });

// //     // Send mail
// //     const info = await transporter.sendMail({
// //       from: `"Support" <${process.env.EMAIL_USER}>`,
// //       to,
// //       subject,
// //       text,
// //       html,
// //     });

// //     console.log("Email sent: %s", info.messageId);
// //     return info;
// //   } catch (error) {
// //     console.error("Error sending email:", error);
// //     throw new Error("Email could not be sent");
// //   }
// // };

// // module.exports = sendEmail;



// const nodemailer = require("nodemailer");

// const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     // Debug (safe)
//     console.log("EMAIL_USER:", process.env.EMAIL_USER ? "SET" : "NOT SET");
//     console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");

//     // Create transporter (Render compatible)
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // TLS
//       auth: {
//         user: process.env.EMAIL_USER, // Gmail
//         pass: process.env.EMAIL_PASS, // App Password
//       },
//       tls: {
//         rejectUnauthorized: false, // 🔑 fixes Render TLS handshake
//       },
//     });

//     // Verify SMTP connection
//     await transporter.verify();
//     console.log("✅ SMTP connection verified");

//     // Send email
//     const info = await transporter.sendMail({
//       from: `"Support" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("📧 Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ EMAIL SEND ERROR:", {
//       message: error.message,
//       code: error.code,
//       response: error.response,
//       responseCode: error.responseCode,
//       command: error.command,
//     });

//     throw new Error("Email could not be sent");
//   }
// };

// module.exports = sendEmail;




const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Support" <${process.env.BREVO_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error("Brevo email error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;


