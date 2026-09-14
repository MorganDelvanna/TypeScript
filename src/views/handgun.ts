import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderHandgunView = (props: PageProps): string => {
    const content = `
      <div class="row">
          <div class="col-12">
              <h1>Handgun Section</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <p>The PF&GA range is ideally suited for recreational shooting as well as handgun competition. The range is equipped for the various handgun events shot in Olympic and International competitions. </p>
              <p>Bulls-eye, "The Gallery" and Canadian 900, the events most often fired by PFGA shooters, offer a pleasing assortment of slow and deliberate shooting as well as faster, more instinctive shooting. </p>
              <p>Shooting is not easy, but the fact that it is challenging to master adds to the appeal. </p>
          </div>
      </div>    
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};