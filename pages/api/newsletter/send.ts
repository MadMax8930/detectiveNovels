import prismadb from '@/lib/prismadb'
import serverAuth from '@/lib/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') { return res.status(405).end() }

   try {
     const { currentUser } = await serverAuth(req, res);
     if (!currentUser.adminId) { return res.status(403).json({ error: 'Forbidden' }) }

     const { title, content } = req.body;
     if (!title || !content) { return res.status(400).json({ error: 'Title & content are required' }) }

     // Create Newsletter Record
     const newNewsletter = await prismadb.newsletter.create({
        data: { 
          title, 
          content,
          admin: {
            connect: { id: currentUser.adminId },
          }, 
        },
     });

     console.log("id", newNewsletter.id)

     // Fetch Admin Record
     const adminRecord = await prismadb.admin.findUnique({
        where: { id: currentUser.adminId },
        include: {
          newsletters: true,
        },
     });
   
     console.log('adminRecord:', adminRecord);

     ///////////

     if (!adminRecord!.newsletters) {
      // If newsletters array is not present, initialize it as an empty array
       adminRecord!.newsletters = [];
     }
    
     // Update Admin Record
     const updatedAdminData = await prismadb.admin.update({
        where: { id: currentUser.adminId },
        data: {
          newsletters: {
            connect: { id: newNewsletter.id },
          },
        },
        include: {
          newsletters: {
            select: {
               id: true,
            },
          },
        },
      });

      console.log('updatedAdminData:', updatedAdminData);
 
      const formattedData = {
        ...adminRecord,
        newsletters: updatedAdminData?.newsletters.map((newsletter) => newsletter.id) || [],
      };

     console.log('Formatted Admin Data:', formattedData);

     ////////////

   //   // Fetch users with receiveNewsletters set to true
   //   const newsletterUsers = await prismadb.user.findMany({
   //      where: { receiveNewsletters: true },
   //      select: { email: true },
   //   });
     
   //   const recipientEmails = newsletterUsers.map((user) => user.email);
   //   await sendEmail(recipientEmails, title, content );

     return res.status(200).json(formattedData);
   } catch (error) {
     console.error(error);
     return res.status(500).json({ error: 'Internal Server Error' });
   }
}

// Authenticate Gmail SMTP server using an app-specific password
async function sendEmail(recipients: string[], title: string, content: string) {
   try {
     const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
         },
     });

     const mailOptions = {
         from: `VladNovels <${process.env.SMTP_USER}>`,
         to: recipients.join(', '),
         subject: `Newsletter - ${title}`,
         text: content,
     };

     await transporter.sendMail(mailOptions);
     recipients.forEach((person) => {
        console.log(`Email sent to user ${person} - (${title}): ${content}`);
     });
   } catch (error) {
     console.error('Error sending newsletter:', error);
     throw error;
   }
}