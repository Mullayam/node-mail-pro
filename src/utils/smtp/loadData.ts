import { ParsedIniData, ResolveIniPath } from './functions';

export const SMTP_CONFIG  = ParsedIniData(ResolveIniPath('./smtp.ini'));
export const AUTH_CONFIG  = ParsedIniData(ResolveIniPath('./auth.ini'));
export const SETTINGS_CONFIG  = ParsedIniData(ResolveIniPath('./settings.ini'));
export const TLS_CONFIG  = ParsedIniData(ResolveIniPath('./tls.ini'));



 const SMTP_CONFIG_OPTIONS={
    
 }