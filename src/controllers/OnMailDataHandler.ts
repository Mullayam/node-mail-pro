import { InjectRepository } from "@/factory/typeorm";
import { Logging } from "@/logs"; 
import { ParseEmail } from "@/utils/smtp/functions/MailParser";
import { writeFileSync } from "fs";

import { SMTPServerAddress, SMTPServerAuthentication, SMTPServerAuthenticationResponse, SMTPServerDataStream, SMTPServerSession } from "smtp-server";

class MailHandler {
    async HandleAuthenticate(auth: SMTPServerAuthentication, session: SMTPServerSession, callback: (err: Error | null | undefined, response?: SMTPServerAuthenticationResponse | undefined) => void): Promise<void> {
        if (auth.method !== "XOAUTH2") {
            // should never occur in this case as only XOAUTH2 is allowed
            return callback(new Error("Expecting XOAUTH2"));
        }
        if (
            auth.username === "abc" &&
            auth.password === "def"
          ) {
            callback(null, { user: auth.username });
          } else {
            callback(new Error('Invalid username or password'));
          }
        
    }
    HandleConnection(session: SMTPServerSession, callback: (err?: Error | null | undefined) => void): void {
        if (session.remoteAddress === "127.0.0.1") {
            callback(new Error("No connections from localhost allowed"));
            return
        }
        Logging.dev("Server Connected " + session.id);
        callback(); // Accept the connection
        return
    }
    HandleConnectionClose(session: SMTPServerSession, callback: (err?: Error | null | undefined) => void): void {
        if (session.remoteAddress === "127.0.0.1") {
            callback(new Error("No connections from localhost allowed"));
            return
        }
        Logging.dev("Server Disonnected " + session.id);
        callback(); // Accept the connection
        return
    }
    async HandleNewMail(stream: SMTPServerDataStream, session: SMTPServerSession, callback: (err?: Error | null | undefined) => void): Promise<void> {
        const parsedEmailData = await ParseEmail(stream);
        const username = String(Array.isArray(parsedEmailData.to) ? parsedEmailData.to[0].value[0].address! : parsedEmailData.to?.text);      
         
        stream.pipe(process.stdout);
        stream.on("end", callback);
        return
    }
    async HandleMailFrom(address: SMTPServerAddress, session: SMTPServerSession, callback: (err?: Error | null | undefined) => void): Promise<void> {
     
        callback(new Error(`Only ${address.address} is allowed to send mail`));
    }
    async HandleRcptTo(address: SMTPServerAddress, session: SMTPServerSession, callback: (err?: Error | null | undefined) => void): Promise<void> {
        return callback(new Error(`Only ${address.address}  is allowed to receive mail`));
    }
}
export const NewMailHandler = new MailHandler()