import { MailParserOptions, ParsedMail, simpleParser, Source,MailParser  } from "mailparser"
export let parser = new MailParser();
export async function ParseEmail(source: Source, options?: MailParserOptions | undefined): Promise<ParsedMail> {
    let parsed = await simpleParser(source, options);
    return parsed;
}