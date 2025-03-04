const { addNewUser, findUser } = require("../service/userServices");
const { userRole } = require("./comman");
const { passwordHash } = require("./passwordUtils");
const sendResponse = require("./responseUtils");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await findUser({
      email,
      role: userRole.ADMIN,
    });
    if (existingAdmin) {
      return sendResponse(res, 400, "Admin already exists");
    }
    const hashedPassword = passwordHash(password);

    const admin = await addNewUser({
      name,
      email,
      password: hashedPassword,
      role: userRole.ADMIN,
    });
    if (!admin) {
      return sendResponse(res, 400, "Admin creation failed");
    }
    return sendResponse(res, 200, "Admin created successfully", admin);
  } catch (err) {
    console.error("Error while creating admin:", err);
  }
};

module.exports = createAdmin;
