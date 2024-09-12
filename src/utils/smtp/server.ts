import * as tls from 'tls'
import * as fs  from 'fs'
import { SMTPServer, SMTPServerOptions } from 'smtp-server';

import { white } from 'colorette';
import { SMTP_CONFIG, AUTH_CONFIG, SETTINGS_CONFIG } from './loadData';
import { validateAll, TLS_KEYS } from './validate';
import { Logging } from '@/logs';
const authMethods = AUTH_CONFIG.methods.split(",").map((item: string) => item.toUpperCase())
const { settings: SETTINGS } = SETTINGS_CONFIG
const keys = SETTINGS.secure ? TLS_KEYS : {}
const options: SMTPServerOptions = {
    allowInsecureAuth: SETTINGS.allowInsecureAuth || true,
    secure: SETTINGS.secure || false,
    logger: SETTINGS.logger || false,
    
    // not required but nice-to-have
    banner: SETTINGS.banner || "Welcome to ENJOYS SMTP Server",
    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ["STARTTLS"],
    // By default only PLAIN and LOGIN are enabled
    authMethods: authMethods || ["PLAIN", "LOGIN", "CRAM-MD5", "XOAUTH2"],
    // Accept messages up to 10 MB
    size: SETTINGS.size || 10 * 1024 * 1024,
    // allow overriding connection properties. Only makes sense behind proxy
    useXClient: false,
    hidePIPELINING: true,
    // use logging of proxied client data. Only makes sense behind proxy
    // useXForward: true,
    authOptional: true,
    handshakeTimeout: 5000,
    maxClients: SETTINGS.maxClients || 2500000,
    name: SETTINGS.hostname || "smtp-server",
    ...keys,
    onConnect(session, callback) {
        if (session.remoteAddress === "127.0.0.1") {
            callback(new Error("No connections from localhost allowed"));
            return
        }
        Logging.dev("Server Connected " + session.id);
        callback(); // Accept the connection
        return
        // NewMailHandler.HandleConnection(session, callback);
    },
    onClose(session, callback) {
        if (session.remoteAddress === "127.0.0.1") {
            callback(new Error("No connections from localhost allowed"));
            return
        }
        Logging.dev("Server Disconnected " + session.id);

        return
    },
    onMailFrom(address, session, callback) {
        Logging.dev("Mail Sent from " + address.address);
        return callback(null)
        // NewMailHandler.HandleMailFrom(address, session, callback);
    },
    onRcptTo(address, session, callback) {
        Logging.dev("Mail Sent To " + address.address);

        // NewMailHandler.HandleMailFrom(address, session, callback);
        return callback(null)
    },
    onAuth(auth, session, callback) {
        if (auth.username !== "mullayam06@cirrusmail.cloud" || auth.password !== "def") {
            return callback(new Error("Invalid username or password"));
        }
        Logging.dev("Authentication successful " + auth.username);
        callback(null, { user: auth.username, data: session });

        // // NewMailHandler.HandleAuthenticate(auth, session, callback);

    },
    onData(stream, session, callback) {
        Logging.dev("mail received");

        
        callback(null)
        // NewMailHandler.HandleNewMail(stream, session, callback);
    },

}
const initSMTP_Server = new SMTPServer(options);
const server = tls.createServer(options, (socket) => {
    console.log('Client connected');
  
    // Send a welcome message (IMAP servers usually send a greeting when a connection is established)
    socket.write('* OK IMAP4rev1 Service Ready\r\n');
  
    socket.on('data', (data) => {
      console.log('Received:', data.toString());
  
      // Handle the IMAP commands (just responding to CAPABILITY for this example)
      if (data.toString().startsWith('A001 CAPABILITY')) {
        socket.write('* CAPABILITY IMAP4rev1 AUTH=PLAIN\r\nA001 OK CAPABILITY completed\r\n');
      } else if (data.toString().startsWith('A002 LOGIN')) {
        socket.write('A002 OK LOGIN completed\r\n');
      } else {
        socket.write('A003 BAD Command not recognized\r\n');
      }
    });
  
    socket.on('end', () => {
      console.log('Client disconnected');
    });
  });
  
  // Listen on port 993 (IMAPS)

class SMTP_Service {
    constructor() {
        validateAll()
        initSMTP_Server.on("error", (err: any) => Logging.dev("Server closed " + err, "error"));
        initSMTP_Server.on("close", () => Logging.dev("Server closed"));
    }
    getServer(): SMTPServer {
        return initSMTP_Server;
    }
    async init() {
        server.listen(993, () => {
          
            Logging.dev(white("IMAP service running on port 993"));

          });
        return initSMTP_Server.listen(SMTP_CONFIG.port, () => {
            Logging.dev(white("SMTP Server Started at " + SMTP_CONFIG.port));
        })
    }
    async transporter() {

    }
}
export const SMTP_Server = new SMTP_Service();