'use strict';

const EmailHelper = require('sendgrid').mail;
const emailFrom = new EmailHelper.Email('no-reply@gt-hive.com');
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

exports.sendConfirmEmail = (to, token) => {
  const emailTo = new EmailHelper.Email(to);
  const subject = 'Please confirm your email address';
  const content = new EmailHelper.Content(
    'text/plain',
    "Let's confirm your email address. \nClick on the following link to confirm: " +
      'https://gt-hive-api.herokuapp.com/api/v1/auth/confirm-email/${token}\nThis link expires in 12 hours.'
  );
  const mail = new EmailHelper.Mail(emailFrom, subject, emailTo, content);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};
