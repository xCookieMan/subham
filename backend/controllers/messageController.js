const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    // Send email notification (Optional - set up in .env)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: `New Portfolio Message: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Could not send message'
    });
  }
};
