const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
      error: { 
        code: null, 
        details: null 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: {},
      error: { 
        code: "INTERNAL_SERVER_ERROR", 
        details: error.message 
      },
    });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: user,
        error: { 
          code: null, 
          details: null 
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found",
        data: {},
        error: { 
          code: "USER_NOT_FOUND", 
          details: "User not found" 
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: {},
      error: { 
        code: "INTERNAL_SERVER_ERROR", 
        details: error.message 
      },
    });
  }
};

exports.updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    res.status(200).json({
      status: "success",
      message: "User information updated successfully",
      data: updatedUser,
      error: { 
        code: null, 
        details: null 

      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: {},
      error: { 
        code: "INTERNAL_SERVER_ERROR", 
        details: error.message },
    });
  }
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: {},
      error: { 
        code: null, 
        details: null 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: {},
      error: {
        code: "INTERNAL_SERVER_ERROR", 
        details: error.message },
    });
  }
};
