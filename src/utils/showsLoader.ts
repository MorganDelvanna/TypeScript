import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

export interface ShowItem {
  id: number;
  month: number;
  description: string;
  detail: string;
  location: string;
  directions: string;
  map: string;
  date: number;  
}

// Define expected structure
interface Data {
  calendar: {
    show: { '@_id': string; month: string; description: string, detail: string, location: string, directions: string, map: string, date: string, dateSort: string }[];
  };
}

export const loadShows = (): ShowItem[] => {
    const xmlPath = path.join(__dirname, '../data/shows.xml');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    const parser = new XMLParser({ ignoreAttributes: false });
    const result: Data = parser.parse(xmlContent) as Data;

    // Parse XML content and return array of ShowItem objects
    const showItems: ShowItem[] = result.calendar.show.map((show) => ({
        id: parseInt(show['@_id']),
        month: parseInt(show.month),
        description: show.description,
        detail: show.detail,
        location: show.location,
        directions: show.directions,
        map: show.map,
        date: parseInt(show.date)
    }));
    return showItems;
};

export const getShowById = (id: number): ShowItem | undefined => {
    const shows = loadShows();
    return shows.find((show) => show.id === id);
};