const { addNewUser, findUser } = require("../service/userServices");
const { userRole } = require("./comman");
const { passwordHash } = require("./passwordUtils");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const existingAdmin = await findUser({
      email,
      role: userRole.ADMIN,
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = passwordHash(password);

    const admin = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: userRole.ADMIN,
    });
    console.log("Admin created successfully:", admin);
  } catch (err) {
    console.error("Error while creating admin:", err);
  }
};

module.exports = createAdmin;
