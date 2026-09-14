import { query } from "../db";

export interface calendarEvent {
    id: number;
    title: string;
    start: string;
    end: string;   
    allDay: boolean;
}

export const loadCalendarEvents = async (): Promise<string> => {
    let dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);
    const events = await query<calendarEvent>('SELECT ID as id, Title as title, EventStart as start, EventEnd as end, AllDay as allDay FROM calendar WHERE EventStart >= ? ORDER BY EventStart ASC', [dateLimit]);
    const eventsJson = JSON.stringify(events);
    return eventsJson;
}