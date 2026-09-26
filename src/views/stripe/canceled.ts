import { MenuItem } from "../../utils/menuLoader";
import { renderLayout } from "../layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderCancelView = (props: PageProps): string => {
    const content = `
    <div class="sr-root">
      <div class="sr-main">
        <div class="sr-payment-summary completed-view">
          <h1>Your payment was canceled</h1>
        </div>
        <div class="sr-section">
          <p>If you cancelled by mistake you may re-submit your application.</p>
        </div>
      </div>
    </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};