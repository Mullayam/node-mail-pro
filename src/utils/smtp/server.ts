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
    disabledCommands: ["AUTH", "STARTTLS"],
    // By default only PLAIN and LOGIN are enabled
    authMethods: authMethods || ["PLAIN", "LOGIN", "CRAM-MD5"],
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
        Logging.dev("onConnect successful" + session);
        
        // NewMailHandler.HandleConnection(session, callback);
    },
    onClose(session, callback) { },
    onMailFrom(address, session, callback) {
        Logging.dev("Mail from" + address.address);
        // NewMailHandler.HandleMailFrom(address, session, callback);
    },
    onRcptTo(address, session, callback) {
        // NewMailHandler.HandleMailFrom(address, session, callback);
    },
    onAuth(auth, session, callback) {
        if (auth.username !== "abc" || auth.password !== "def") {
            return callback(new Error("Invalid username or password"));
          }
          Logging.dev("Authentication successful" + auth.username);
          callback(null, { user: "abc" }); 
        // NewMailHandler.HandleAuthenticate(auth, session, callback);

    },
    onData(stream, session, callback) {
        console.log("mail received")
        // NewMailHandler.HandleNewMail(stream, session, callback);
    },
     
}
const initSMTP_Server = new SMTPServer(options);

class SMTP_Service {
    constructor() {
        validateAll()
        initSMTP_Server.on("error", (err:any) => Logging.dev("Server closed " + err, "error"));
        initSMTP_Server.on("close", () => Logging.dev("Server closed"));
    }
    getServer(): SMTPServer {
        return initSMTP_Server;
    }
    async init() {
        return initSMTP_Server.listen(SMTP_CONFIG.port, () => {
            Logging.dev(white("SMTP Server Started at " + SMTP_CONFIG.port));
        })
    }
    async transporter() {

    }
}
export const SMTP_Server = new SMTP_Service();