import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";
import { newsItem } from "../utils/newsLoader";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  newsItems: newsItem[];
}

export const renderNewsListView = (newsItems: newsItem[]): string => {
    const newsItemsHtml = newsItems.map(news => `
        <div class="row newsRow ${news.id % 2 === 0 ? 'alt' : ''}">
            <div class="col-12">  
                <div data-news-index="${news.id}">
                    <h1>${news.title}</h1>
                    <p>${news.content}</p>
                </div>
            </div>
        </div>`).join('');

    return newsItemsHtml;
};

export const renderNewsView = (props: PageProps): string => {
    const content = `
        <div class="row">
            <div class="col-12">
                <h1>News</h1>
            </div>
        </div>
        ${renderNewsListView(props.newsItems)}
            
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};