import { SETTINGS_CONFIG,TLS_CONFIG } from "./loadData";
import { join, resolve } from 'path';
import * as fs from 'fs';
import { Logging } from "@/logs";
 

export const TLS_KEYS = {
    key: resolve("src\\iutils\\smtp", TLS_CONFIG.tls_key),
    cert: resolve("src\\iutils\\smtp", TLS_CONFIG.tls_cert),
    // ca: resolve("src\\utils\\smtp", TLS_CONFIG.tls_ca),
}  
function validateTLS() {
    if(SETTINGS_CONFIG.settings?.secure)
    {
        Logging.dev("TLS is enabled")       
        Object.values(TLS_KEYS).forEach((file: any) => {
            if (!fs.existsSync(file)) {
                throw Logging.dev(`TLS ${file.split("\\").pop()} file not found at ${file}`,"error")
            }
        });
        
    }
}

export function validateAll() {
    validateTLS()
}