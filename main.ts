import "dotenv/config"
import "reflect-metadata"
import tsConfig from './tsconfig.json'
import { register } from 'tsconfig-paths'
register({ baseUrl: __dirname, paths: tsConfig.compilerOptions.paths })
import { bootstrap } from "./src/application";
import { SMTP_Server } from "@/utils/smtp/server"
async function main() {

    await SMTP_Server.init()
    const app = bootstrap.AppServer.InitailizeApplication()!
    const options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['htm', 'html'],
        index: false,
        maxAge: '1d',
        redirect: false,
        setHeaders(res: any, path: any, stat: any) {
            res.set('x-timestamp', Date.now())
        }
    }

    app.use(bootstrap.express.static('public', options))
}

main()