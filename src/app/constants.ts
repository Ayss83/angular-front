import { HttpContextToken } from "@angular/common/http";

export const baseUrl = 'http://localhost:3000';
export const DISABLE_INTERCEPTION = new HttpContextToken(() => false);