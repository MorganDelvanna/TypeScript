import fs from 'fs';
import path from 'path';

export interface MenuItem {
  text: string;
  href?: string;
  children?: MenuItem[];
}

export const loadMenuMap = (): MenuItem[] => {
  const jsonPath = path.join(__dirname, '../data/menu.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const menuItems: MenuItem[] = JSON.parse(rawData);

  return menuItems;
};