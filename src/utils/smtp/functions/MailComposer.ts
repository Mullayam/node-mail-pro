import MailComposer  from 'nodemailer/lib/mail-composer'

var mail = new MailComposer({
    
});
var stream = mail.compile().createReadStream();
stream.pipe(process.stdout);