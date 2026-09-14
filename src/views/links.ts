import { LinkItem } from "../utils/linksLoader";
import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  links: LinkItem[];
}

export const renderLinksListView = (links: LinkItem[]): string => {
  const categories = Array.from(new Set(links.map(link => link.category)));
  const linksByCategory: { [category: string]: LinkItem[] } = {};
  
  links.forEach(link => {
      if (!linksByCategory[link.category]) {
          linksByCategory[link.category] = [];
      }
      linksByCategory[link.category].push(link);
  });

  let html = '';
  categories.forEach(category => {
      html += `<div class="accordion-item">
        <h4 class="accordion-header pfgaAccordian">
                        <button type="button" class="pfgaAccordian accordion-button collapsed" data-toggle="collapse" data-target="#${category.toLowerCase()}" aria-expanded="false">${category}</button>
        </h4>
                <div id="${category.toLowerCase()}" class="accordion-collapse collapse" data-parent="#accordion">
            <div class="accordion-body row">`;
                linksByCategory[category].forEach(link => {
                    html +=`
                        <div class="padded col-4" >
                            <a href="${link.url}" target="_blank">${link.title}</a><br />
                            ${link.location}<br />
                            ${link.contact}
                        </div>`;
                });
      html +=`</div>
            </div>
        </div>`;
  });

  return html;

};

export const renderLinksView = (props: PageProps): string => {
    const content = `
        <div class="row">
            <div class="col-12">
                <h1>Shooting Links</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div id="accordion" class="accordion">
                    ${renderLinksListView(props.links)}
                </div>
            </div>
        </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};