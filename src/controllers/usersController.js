const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller function to handle GET request for fetching user information
exports.getUsers = async(req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Controller function to handle PUT request for updating user information
exports.updateUserById = async(req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  try {
    // Update user information in your database or source using Prisma's update method
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    // Send successful response after updating user information
    res.status(200).json({ message: "User information updated successfully", updatedUser });
  } catch (error) {
    // Handle errors if any
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
