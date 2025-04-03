const userRole = Object.freeze({
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
});

const emailSubject = Object.freeze({
  DOCTOR: "Welcome to the System - Your Login Details",
  PATIENT: "Verify Your Account: OTP Inside",
});

const emailText = Object.freeze({
  DOCTOR: (name, email, password) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Welcome to the System, Dr. ${name}!</h2>
          <p>Your account has been successfully created. Please find your login details below:</p>
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; background-color: #f0f0f0; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #f0f0f0; font-weight: bold;">Password:</td>
              <td style="padding: 10px;">${password}</td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #777;">Best regards,</p>
          <p style="font-size: 14px; color: #777;">AMS</p>
        </div>
      </body>
    </html>
  `,

  PATIENT: (otp) => `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Account Verification</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <h3 style="color: #FF5722; font-size: 24px; text-align: center;">${otp}</h3>
          <p style="font-size: 14px; color: #777;">Please enter this OTP to complete your request.</p>
          <p style="font-size: 14px; color: #777;">Note: This OTP is valid for 10 minutes and can only be used once.</p>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 14px; color: #777;">Best regards,</p>
          <p style="font-size: 14px; color: #777;">AMS</p>
        </div>
      </body>
    </html>
  `,
});

const status = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
  RESLVED: "resolved",
});

const collectionName = Object.freeze({
  USER: "users",
  MEDICINE: "medicines",
  CATEGORY: "categorys",
  CASE: "cases",
  HEARING: "hearings",
  HEARING_REQUEST: "hearingrequests",
  APPOINTMENT: "appointments",
  BILL: "bills",
});
module.exports = { userRole, emailSubject, emailText, status, collectionName };
