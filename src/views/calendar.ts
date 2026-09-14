import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderCalendarView = (props: PageProps): string => {
    const content = `
      <link rel='stylesheet' href='css/fullcalendar.min.css' />
      <div class="row">
          <div class="col-12">
              <div id='script-warning'>
                  <code>get-events.php</code> must be running.
              </div>
              <div id="test"></div>
              <div id='loading'>loading...</div>
              <div id='calendar'></div>
          </div>
      </div>
      <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'></script>
      <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
      <script src='https://unpkg.com/tooltip.js/dist/umd/tooltip.min.js'></script>
      <script src='js/calendar.js'></script>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};