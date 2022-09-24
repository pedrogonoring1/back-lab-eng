import  nodemailer  from 'nodemailer';
import { google } from 'googleapis';
import configMail from '../config/mail.json';

export async function sendMail(mailOptions: any) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      configMail.clientId,
      configMail.clienteSecret,
      configMail.RefirectURI
    );
    
    oAuth2Client.setCredentials({ refresh_token: configMail.RefreshToken});
    
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        clientId: configMail.clientId,
        clientSecret: configMail.clienteSecret,
      },
    });

    const authAutentication = {
      type: 'OAuth2',
      user: 'adotadoguvv@gmail.com',
      clientId: configMail.clientId,
      clientSecret: configMail.clienteSecret,
      refreshToken: configMail.RefreshToken,
      accessToken: accessToken,
    };

    mailOptions.auth = authAutentication;

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}



