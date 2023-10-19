import { HttpContextToken } from "@angular/common/http";

export const baseUrl = 'http://localhost:3000';
export const DISABLE_INTERCEPTION = new HttpContextToken(() => false);
export const appColors = {
  blue: 'rgb(140, 204, 241)',
  green: 'rgb(149, 241, 195)',
  yellow: 'rgb(255, 255, 204)',
  orange: 'rgb(255, 227, 135)',
  red: 'rgb(247, 145, 145)',
  gray: 'rgb(210, 210, 210)',
};