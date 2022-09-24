import  nodemailer  from 'nodemailer';
import { google } from 'googleapis';

import { host, port, user, pass } from '../config/mail.json';

export async function sendMail(mailOptions: any) {
  try {
    const CLIENT_ID = '667146587106-kahaoohfc7j18been90sgs0c5l5gn5lg.apps.googleusercontent.com';
    const CLEINT_SECRET = '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';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN = 
    '1//04xZD6YkNaV6yCgYIARAAGAQSNwF-L9IrYAIkvdHW3lq1FxjySTDay0BN1yb11_1DUxH7-AgC7vF0BEX4zOgFv-A4zncfDfA1LQo';

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
    },
  });


  const authAutentication = {
    type: 'OAuth2',
    user: 'adotadoguvv@gmail.com',
    clientId: CLIENT_ID,
    clientSecret: CLEINT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  };

  mailOptions.auth = authAutentication;

  const result = await transporter.sendMail(mailOptions);
  return result;
  } catch (error) {
    return error;
  }
}



