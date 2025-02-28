const nodemailer = require('nodemailer');

const sendMail = (payload) => {
  const { message, to, title, link } = payload;

  const transporter = nodemailer.createTransport({
    host: 'mail.trekkersencounter.com',
    port: 465,
    secure: true,
    auth: {
      user: 'support@trekkersencounter.com',
      pass: 'Office@0977',
    },
    debug: true,
  });



  const mailOptions = {
    from: 'support@trekkersencounter.com',
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