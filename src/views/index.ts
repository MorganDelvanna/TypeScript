import { MenuItem } from "../utils/menuLoader";
import { newsHeader } from "../utils/newsLoader";
import { renderLayout } from "./layout";
import { formatDateISO } from "../utils/stringUtils";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  newsHeaders: newsHeader[];
}

export const renderNewsListView = (newsHeaders: newsHeader[]): string => {
    const newsItems = newsHeaders.map((news, index) => `
                <div class="news-item" data-news-index="${index}">
                    <h1><a href="/news.htm#news_${news.id}">${news.title}</a></h1>
                </div>`).join('');

    return `<div class="row news news-rotator">
            <!-- Display the latest date -->
            <div class="col-2 latest latest-date" v-if="latestDate">
                <h2>Latest Update</h2>
                ${newsHeaders.length > 0 ? formatDateISO(newsHeaders[0].date) : ''}
            </div>
            <div class="col-10 news-items">
                ${newsItems}
            </div>
        </div>
        <script type="text/javascript" src="js/index.js"></script>`;
}

export const renderHomeView = (props: PageProps): string => {
    const content = `
        ${renderNewsListView(props.newsHeaders)}
        <div class="row align-items-center">
            <div class="col-10">
                <p>
                    The clubhouse is situated on 100 acres of property.
                    Our facilities include a clubhouse with an indoor heated range, canteen, lounge, washrooms,
                    several outdoor ranges for handguns, rifles, archery.
                    The facilities are open 24 hours a day for club members.
                    Out of consideration of our neighbours, the outdoor ranges shouldn't be used after dusk and the indoor ranges after 9 p.m. on weeknights and 9 p.m. on weekends or before noon on Sundays.
                </p>
                <p> Check out the <a href="/schedule">Schedule</a> page for usage of the Indoor range and the <a href="/calendar">Calendar</a> for events happening at the club</p>

                <p> We have the following activities or sections - <a href="/archery">Archery</a>, <a href="/handgun">Handguns</a>, <a href="/smallbore">Competitive Rifle</a>, <a href="/rifles">Rifles</a> and <a href="/action">Action Shooting</a></p>

                <p> Our <a href="/juniors">Junior program</a> is second to none and has had Canadian and Ontario champions in air pistol, air rifle and sporting rifle. </p>

                <p>
                    The club also has a very active Action Shooting section with monthly competitions all year round
                    They are outdoors during the nice weather then they move indoors for the winter.
                </p>

                <p> The archery section is very active all year round (both indoors and outdoors with a 3-D walkabout range of over 20 targets. They have hosted many Canadian and Ontario events in conjunction with Archery Ontario.</p>
                <p> We don't run the Hunter Safety and Canadian Firearms Course (PAL) courses ourselves but you can find instructors by following this <a href="https://www.ohep.net/#InstSearch" target="_blank">link</a></p>
            </div>
        </div>
  `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath }, content);
};