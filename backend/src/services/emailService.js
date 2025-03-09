// import nodemailer from 'nodemailer';
import config from '../config/config.js';

// // 创建邮件发送器函数
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: config.email.host,
//     port: config.email.port,
//     secure: config.email.secure,
//     auth: {
//       user: config.email.user,
//       pass: config.email.password,
//     },
//   });
// };

export default {
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${config.app.url}/api/auth/verify-email/${token}`;
    
    const mailOptions = {
      from: `"${config.app.name}" <${config.email.user}>`,
      to: email,
      subject: '请验证您的电子邮箱',
      html: `
        <h1>验证您的电子邮箱</h1>
        <p>感谢您的注册！请点击下面的链接验证您的电子邮箱：</p>
        <p><a href="${verificationUrl}">验证我的邮箱</a></p>
        <p>或者复制以下链接到浏览器：</p>
        <p>${verificationUrl}</p>
        <p>如果这不是您的操作，请忽略此邮件。</p>
      `,
    };
    
    return false;
    // 在函数内部创建transporter
    // const transporter = createTransporter();
    // return transporter.sendMail(mailOptions);
  },
  
  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${config.app.url}/reset-password/${token}`;
    
    const mailOptions = {
      from: `"${config.app.name}" <${config.email.user}>`,
      to: email,
      subject: '重置您的密码',
      html: `
        <h1>重置您的密码</h1>
        <p>您收到此邮件是因为有人请求重置您账号的密码。请点击下面的链接重置密码：</p>
        <p><a href="${resetUrl}">重置我的密码</a></p>
        <p>或者复制以下链接到浏览器：</p>
        <p>${resetUrl}</p>
        <p>此链接将在一小时后失效。</p>
        <p>如果这不是您的操作，请忽略此邮件，您的密码将保持不变。</p>
      `,
    };
    return true;
    // 在函数内部创建transporter
    // const transporter = createTransporter();
    // return transporter.sendMail(mailOptions);
  }
}; 