import getPrismaInstance from "../utils/PrismaClient.js";
import jwt from 'jsonwebtoken';

// Secret key for JWT (keep it secure)
const secretKey = 'koshal12345';

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const prisma = getPrismaInstance();

    const user = await prisma.User.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      // User not found or password does not match
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Successful login
    const userPayload = {
      userId: user.userID,
      email: user.email,
    };

    // Generate a JWT for the authenticated user and set it as an HTTP-only cookie
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
