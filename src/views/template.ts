import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderTemplateView = (props: PageProps): string => {
    const content = `
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};