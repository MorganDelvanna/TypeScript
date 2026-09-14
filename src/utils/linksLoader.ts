import fs from 'fs';
import path from 'path';

export interface LinkItem {
    category: string;
    url: string;
    title: string;
    location: string;
    contact?: string;
}

export const loadLinks = ():  LinkItem[] => {
  const jsonPath = path.join(__dirname, '../data/links.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8').replace(/^\uFEFF/, '');
  const linkItems = JSON.parse(rawData) as {
    Category: string;
    URL: string;
    Title: string;
    Location: string;
    Contact?: string;
  }[];

  return linkItems.map((link) => ({
    category: link.Category,
    url: link.URL,
    title: link.Title,
    location: link.Location,
    contact: link.Contact,
  }));
};