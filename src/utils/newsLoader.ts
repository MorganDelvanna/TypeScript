import { query } from "../db";

export interface newsHeader {
    id: number;
    title: string;
    date: string;
}

export interface newsItem {
    id: number;
    title: string;
    date: string;   
    content: string;
}

export const loadNewsHeaders = async (): Promise<newsHeader[]> => {
      const newsItems = await query<newsHeader>('SELECT id, publish_date as date, header as title FROM news WHERE archived = 0 ORDER BY publish_date DESC');
      return newsItems;
}

export const loadNews = async (): Promise<newsItem[]> => {
    const newsItems = await query<newsItem>('SELECT id, publish_date as date, header as title, description as content FROM news WHERE archived = 0 ORDER BY publish_date DESC');
    return newsItems;
}