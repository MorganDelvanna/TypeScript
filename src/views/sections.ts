import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderSectionsView = (props: PageProps): string => {
    const content = `
        <div class="row">
            <div class="col-12">
                <h1>Sections</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <p>The Peterborough Fish & Game Association has several activities or sections available to join</p>
                
                <p>
                    <a href="/action">Action shooting:</a> the practice of shooting at multiple targets, moving targets, targets that react when hit, penalty targets mixed-in, obstacle movement, and competitive tactics.
                </p>
                <p>
                    <a href="/archery">Archery:</a> Recurve bows, compound bows and crossbows
                </p>
                <p>
                    <a href="/handgun">Handgun:</a> Bullseye shooting
                </p>
                <p>
                    <a href="/rifles">Rifles:</a> Big bore rifle and hunting rifle
                </p>
                <p>
                    <a href="/smallbore">Smallbore:</a> .22 rifle, air rifle and air pistol competitive shooting
                </p>
                <p>
                    <a href="/juniors">Junior Rifle:</a> For kids age 12 to 18 we teach air rifle in the winter and .22 rifle in the summer
                </p>
            </div>
        </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};