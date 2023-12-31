import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { AdminJwtPayload } from '@/types'
import jwt from 'jsonwebtoken'
import prismadb from '@/lib/prismadb'
import serverAuth from '@/lib/serverAuth'

// Admin middleware: Ensures authentication and authorization for admin users
const adminAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => { 
   try {
      const { adminId } = await serverAuth(req, res);
      if (!adminId) { return res.status(401).json({ error: 'Unauthorized access. User is not an admin.' }) }
   
      const adminTokenPayload = { adminId: adminId };
      const adminToken = jwt.sign(adminTokenPayload, `${process.env.ADMIN_JWT_SECRET}`, { expiresIn: '3d' });
      if (!adminToken) { return res.status(401).json({ error: 'Unauthorized access. No admin token found.' }) }
      
      const decodedToken = jwt.verify(adminToken, `${process.env.ADMIN_JWT_SECRET}`) as AdminJwtPayload;

      const admin = await prismadb.user.findFirst({ where: { adminId: decodedToken.adminId } });
      if (!admin || admin.adminId === null) { return res.status(401).json({ error: 'Unauthorized access. Admin ID not found.' }) }

      const domain = process.env.NODE_ENV === 'production' ? '.vladsurnin.com' : 'localhost';
      res.setHeader('Set-Cookie', `next-auth.admin-token=${adminToken}; Path=/; HttpOnly; Secure; SameSite=None; Domain=${domain}`);

      handler(req, res);  // User authorized to proceed to the API handler
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Authentication server error has occurred.' });
   }
};

export default adminAuth;