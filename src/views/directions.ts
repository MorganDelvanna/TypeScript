import { MenuItem } from "../utils/menuLoader";
import { ShowItem } from "../utils/showsLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  show: ShowItem;
}

export const renderDirectionsView = (props: PageProps): string => {
    const content = `
      <div class="row">
          <div class="col-12">
              <h1>Directions to Gun Shows and Auctions</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <p id="Directions">
                ${props.show.directions}
              </p>
              <p id="Map" align="center">
                ${props.show.map}
              </p>
          </div>
      </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};