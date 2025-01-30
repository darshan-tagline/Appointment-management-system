const { addNewUser, findUser } = require("../service/userServices");
const { passwordHash } = require("./passwordUtils");

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const existingAdmin = await findUser({
      email,
      role: "admin",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      
    }
    const hashedPassword = passwordHash(password);

    const admin = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin created successfully:", admin);
    
  } catch (err) {
    console.error("Error while creating admin:", err);
  }
};

module.exports = createAdmin;
