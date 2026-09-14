import { MenuItem } from "../utils/menuLoader";
import { ShowItem } from "../utils/showsLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  shows: ShowItem[];
}

export const renderShowsView = (props: PageProps): string => {
    let content = `
      <div class="row">
          <div class="col-12">
              <h1>Shows and Auctions</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <select id="monthInput">
                  <option value="-1">Show All</option>
                  <option value='0'>Monthly</option>
                  <option value='1'>January</option>
                  <option value='2'>February</option>
                  <option value='3'>March</option>
                  <option value='4'>April</option>
                  <option value='5'>May</option>
                  <option value='6'>June</option>
                  <option value='7'>July</option>
                  <option value='8'>August</option>
                  <option value='9'>September</option>
                  <option value='10'>October</option>
                  <option value='11'>November</option>
                  <option value='12'>December</option>
              </select>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <table class="table pfgaTable" id="eventGrid">
                  <thead>
                      <tr>
                          <th width="20%" align="left" valign="top" scope="col" id="thDate">Date</th>
                          <th width="40%" align="left" valign="top" scope="col" id="thDescription">Description</th>
                          <th width="40%" align="left" valign="top" scope="col" id="thLocation">Location</th>
                      </tr>
                      <tr>
                          <th align="left" colspan="3" scope="col" id="thDirections">Details / Directions</th>
                      </tr>
                  </thead>
                  <tbody>`

    props.shows.forEach((show) => {
        content += `
            <tr class="showRow ${show.id % 2 === 0 ? 'alt' : ''}" data-id="${show.id}" data-month="${show.month}">
                <td headers='thDate' width='80px'>${show.date}</td>
                <td headers='thDescription'>${show.description}</td>
                <td headers='thLocation'>${show.location}</td>
            </tr>
            <tr class="detailsRow ${show.id % 2 === 0 ? 'alt' : ''}" data-month="${show.month}">
                <td headers='thDirections' colspan="3">
                    ${show.detail}
                    <br />
                    <a href='directions/${show.id}' class='direction'>Click for directions</a>
                </td>
            </tr>`;
    });

    content += `</tbody>
              </table>
          </div>
      </div>
      <script type="text/javascript" src="js/shows.js"></script>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};