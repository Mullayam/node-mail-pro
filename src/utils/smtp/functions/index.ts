import * as fs from 'fs';
import * as path from 'path';
import * as ini from 'ini';
export const ResolveIniPath = (...filename:string[])=> path.resolve(process.cwd(),'src','utils','smtp', 'config',...filename);
export const ParsedIniData = (configPath:string) => ini.parse(fs.readFileSync(configPath, 'utf-8'));