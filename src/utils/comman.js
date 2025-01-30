const role = Object.freeze({
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
});

const subject = Object.freeze({
  DOCTOR: "Welcome to the System - Your Login Details",
  PATIENT: "Verify Your Account: OTP Inside",
});

const mailText = Object.freeze({
  DOCTOR: `
      Dear Dr. ${"${name}"},

      Your account has been created.

      Email: ${"${email}"}
      Password: ${"${password}"}

      Best regards,
      Your System Team
    `,
  PATIENT: `Dear User,
Your One-Time Password (OTP) for verification is: ${"${otp}"}.
Please enter this OTP to complete your request.
Note: This OTP is valid for a 10 Minutes and can only be used once.`,
});

module.exports = { role , subject, mailText };
