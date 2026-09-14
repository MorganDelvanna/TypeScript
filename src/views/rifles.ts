import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderRiflesView = (props: PageProps): string => {
    const content = `
      <div class="row">
          <div class="col-12">
              <h1>Rifle Section</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              For those not interested in competition but just want to sight in their rifles or just have fun shooting steel targets the rifle section.
          </div>
      </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};