import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderArcheryView = (props: PageProps): string => {
    const content = `
        <div class="row">
            <div class="col-12">
                <h1>Archery Section</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <p>This is a year round function as it can be shot both indoors and outdoors. Our indoor range has practice butts that we shoot up to 20 yards. The outdoor range features 3-D animal targets placed along a marked course and are shot at various distances to sharpen your archery skills. </p>

                <p>Shooting our outdoor range may be done any day with you being the judge of weather and conditions. </p>

                <p>We do allow crossbows but not broad-heads due to the damage they cause to the targets.</p>
            </div>
        </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};