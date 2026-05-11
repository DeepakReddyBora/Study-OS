import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Study-OS" <${process.env.EMAIL_USER}>`,

      to,

      subject: "Verify Your Study-OS Account",

      text: `Your OTP is ${otp}`,

      html: `
        <div style="
          font-family: Arial;
          padding: 20px;
          background: #f5f5f5;
        ">

          <div style="
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
          ">

            <h2 style="color:#4f46e5;">
              Study-OS Verification
            </h2>

            <p>
              Your OTP for account verification is:
            </p>

            <h1 style="
              letter-spacing: 5px;
              color:#111827;
            ">
              ${otp}
            </h1>

            <p>
              This OTP will expire in 5 minutes.
            </p>

          </div>

        </div>
      `,
    });

    console.log(`OTP sent to ${to}`);

  } catch (error) {

    console.log("MAIL ERROR:", error);

    throw error;
  }
};