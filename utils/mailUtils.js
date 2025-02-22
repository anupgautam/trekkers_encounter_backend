const nodemailer = require('nodemailer');

const sendMail = (payload) => {
  const { message, to, title, link } = payload;

  const transporter = nodemailer.createTransport({
    host: 'mail.himalayantoursandadventure.com',
    port: 465,
    secure: true,
    auth: {
      user: 'support@himalayantoursandadventure.com',
      pass: 'office@0977',
    },
    debug: true,
  });



  const mailOptions = {
    from: 'support@himalayantoursandadventure.com',
    to: to,
    subject: title,
    html: `
          <div>
            <h4> ${title} </h4>
            <h5>${message} </h5>
            <p> ${link} </p>
          </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.sendMail = sendMail;