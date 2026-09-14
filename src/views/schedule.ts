import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderScheduleView = (props: PageProps): string => {
    const content = `
    <div class="row">
          <div class="col-12">
              <h1>Indoor Range Hours</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <ul>
                  <li>	7:00am - 11:00pm (All allowed calibers)</li>
                  <li>	11:00pm - 7:00am (38 Special, 9mm, & .22 Rimfire only. No magnum, +p, or compensated firearms)</li>
              </ul>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <h1>Indoor Range Schedule</h1>
          </div>
      </div>
      <div class="row  align-items-center">
          <div class="col-12">
              <div class="container">
                  <div class="row">
                      <div class="col-2">Monday</div>
                      <div class="col-2">5:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Action Pistol</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Tuesday</div>
                      <div class="col-2">5:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Smallbore Rifle</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Wednesday</div>
                      <div class="col-2">5:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Handgun</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Thursday</div>
                      <div class="col-2">5:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Archery</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Friday</div>
                      <div class="col-2">5:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Junior Air Program, setup from 5 to 6:30, Line starts at 7</div>
                  </div>
                  <div class="row">
                      <div class="col-4">Saturday</div>
                      <div class="col-8">Open to first come first served</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Sunday</div>
                      <div class="col-2"></div>
                      <div class="col-8">Open</div>
                  </div>
                  <div class="row">
                      <div class="col-2">Sunday</div>
                      <div class="col-2"> 6:00p.m. - 9:00p.m.</div>
                      <div class="col-8">Archery</div>
                  </div>
                  <div class="row">
                      <div class="col-12">
                          <p>
                              Scheduled Special <a href="calendar.htm">Events Take Precedence over This Schedule </a>                                
                          </p>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-12">
                      <h1>Outdoor Range Hours</h1>
                  </div>
              </div>
              <div class="row">
                  <div class="col-12">
                      <ul>
                          <li>	Monday to Saturday 9:00am - 9:00pm or sunset (whichever comes first.)</li>
                          <li>	Sunday 9:00am - 12:00pm - .22 rimfire only.</li>
                          <li>	Sunday 12:00pm - 9:00pm or sunset (whichever comes first) - all calibers.</li>
                          <li>	Illuminated ranges may be used until 9:00pm. Lights must be used after sunset, currently only Range 7 is illuminated.</li>
                          <li>    On Sunday mornings no centrefire is allowed until noon.</li>
                          <li>    From May to the end August the Juniors take over Range 3 on Friday nights, .22 only.</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};