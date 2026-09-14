import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderOutdoorsView = (props: PageProps): string => {
    const content = `
      <link rel="stylesheet" href="css/blueimp-gallery.min.css" />
      <div class="row">
          <div class="col-12">
              <h1>Outdoors</h1>
          </div>
      </div>
      <div class="row">
          <div class="col-12">
              <p>
                  Our outdoor facilities, located on the west side of the property include the
                  following ranges:
              </p>
              <ul>
                  <li>Range 2: 25 Meter Handgun only</li>
                  <li>Range 3: Covered Range - 50 Yard and 100 Yard, rifle only</li>
                  <li>Range 4: 50 Meter Rifle or Handgun at 25 Meter</li>
                  <li>Range 5: 50 Yard Rifle or Handgun at 25 Yard</li>
                  <li>Range 6: Archery and Crossbow</li>
                  <li>Range 7: 25y Yard Action</li>
                  <li>Range 8: Multi-Purpose Range 100 Yard Rifle or 50 Yard Handgun</li>
                  <li>Range 9: FITA Archery Range</li>
                  <li>Range 10: 3-D archery, the trail goes around the FITA archery</li>
                  <li>Range 11: 25 Yard Handgun</li>
                  <li>Range 12: 20 Yard Handgun</li>
                  <li>Range 13: 20 Yard Handgun</li>
              </ul>
              <p> Smoking is not allowed on any firing line, if you need to smoke move off the line.</p>

              <p>High-powered rifles and handguns are shot outdoors. Pistol Calibre Carbines (PCC) follow the same rules as rifles</p>
              <p>PF&amp;GA has a 3-D archery range of some 25 targets that can test any marksman. </p>
              <!-- The Gallery as lightbox dialog, should be a child element of the document body -->
              <div id="blueimp-gallery-carousel" class="blueimp-gallery blueimp-gallery-controls blueimp-gallery-carousel">
                  <div class="slides"></div>
                  <h3 class="title"></h3>
                  <a class="prev"><img src="images/left.png" /></a>
                  <a class="next"><img src="images/right.png" /></a>
                  <a class="play-pause"></a>
              </div>
          </div>
          <div id="links">
              <a href="images/outdoors/range2.jpg" title="Range 2: 25m Pistol Range"></a>
              <a href="images/outdoors/range2-cottage.jpg" title="Range 2: Cottage"></a>
              <a href="images/outdoors/range2-cottage2.jpg" title="Range 2: Cottage"></a>
              <a href="images/outdoors/range2-cottageback.jpg" title="Range 2: Cottage"></a>
              <a href="images/outdoors/range2-flag.jpg" title="Range 2: The flag"></a>
              <a href="images/outdoors/range2-path.jpg" title="Range 2: Path"></a>
              <a href="images/outdoors/range2-sign.jpg" title="Range 2: Sign"></a>
              <a href="images/outdoors/range2-safetable.jpg" title="Range 2: Safe Tables"></a>
              <a href="images/outdoors/range2-downrange.jpg" title="Range 2: Down Range 25m"></a>
              <a href="images/outdoors/range2-downrange2.jpg" title="Range 2: Down Range 25m"></a>
              <a href="images/outdoors/range3.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-rules.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-sign.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-sign2.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-covered.jpg" title="Range 3: Covered Firing Point"></a>
              <a href="images/outdoors/range3-25mline.jpg" title="Range 3: 25m Covered Range"></a>
              <a href="images/outdoors/range3-50mdownrange.jpg" title="100m Covered Range"></a>
              <a href="images/outdoors/range3-downrange.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-firingline.jpg" title="Range 3: 50yd/100m Covered Range"></a>
              <a href="images/outdoors/range3-rimfiresteel.jpg" title="Range 3: 50yd/100m Covered Range"></a>              
              <a href="images/outdoors/range4_5-entrance.jpg" title="Range 4 & 5: Entrance"></a>
              <a href="images/outdoors/range4_5-sign.jpg" title="Range 4 & 5: Sign"></a>
              <a href="images/outdoors/range4.jpg" title="Range 4: 50m Multi-Purpose Range"></a>
              <a href="images/outdoors/range5-road.jpg" title="Range 5: 50m Multi-Purpose Range"></a>
              <a href="images/outdoors/range5.jpg" title="Range 5: 50m Multi-Purpose Range"></a>
              <a href="images/outdoors/range6.jpg" title="Range 6: Archery Practice Range"></a>
              <a href="images/outdoors/range7.jpg" title="Range 7: Action Pistol Range"></a>
              <a href="images/outdoors/range7-action.jpg" title="Range 7: Action Pistol Sinage"></a>
              <a href="images/outdoors/range7-tables.jpg" title="Range 7: Action Pistol Covered Tables"></a>
              <a href="images/outdoors/range8.jpg" title="Range 8: 100m Multi-Purpose Range"></a>
              <a href="images/outdoors/range8-tables.jpg" title="Range 8: 100m Multi-Purpose Tables"></a>
              <a href="images/outdoors/range9_10.jpg" title="Range 9 & 10: 100m Fita & 3d Archery Range"></a>
              <a href="images/outdoors/range9.jpg" title="Range 9: 100m Fita Archery Range"></a>
              <a href="images/outdoors/range10-lane1.jpg" title="Range 10: 3d Lane 1"></a>
              <a href="images/outdoors/range10-targets.jpg" title="Range 10: 3d Lane 1 targets"></a>
          </div>
      </div>
      <script src="js/blueimp-gallery.min.js"></script>
      <script text="text/javascript">
        blueimp.Gallery(
            document.getElementById('links').getElementsByTagName('a'),
            {
                container: '#blueimp-gallery-carousel',
                carousel: true
            }
        );
    </script>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};