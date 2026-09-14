import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderIndoorsView = (props: PageProps): string => {
    const content = `
    <link rel="stylesheet" href="css/blueimp-gallery.min.css" />
    <div class="row">
            <div class="col-12">
                <h1>Indoor Facilities</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <p>
                    We at Peterborough Fish and Game Association have a lot to be proud of. The PF&amp;GA is the oldest
                    shooting facility in the area and is located a 10-minute drive east of downtown Peterborough on 100 acres of land.
                    Our facilities include a heated clubhouse with a lounge, canteen, and washrooms.
                    The clubhouse has Peterborough's only heated indoor shooting range for pellet, .22 calibre rifles and handguns,
                    center fire handguns and archery activities.
                </p>
                <p>
                    No pets allowed in the clubhouse, service animals excepted.
                </p>

                <!-- The Gallery as lightbox dialog, should be a child element of the document body -->
                <div id="blueimp-gallery-carousel" class="blueimp-gallery blueimp-gallery-controls blueimp-gallery-carousel">
                    <div class="slides"></div>
                    <h3 class="title"></h3>
                    <a class="prev"><img src="images/left.png" /></a>
                    <a class="next"><img src="images/right.png" /></a>
                    <a class="play-pause"></a>
                </div>
                <div id="links">
                    <a href="images/indoor/clubhouse.jpg" title="Clubhouse"></a>
                    <a href="images/indoor/signin.jpg" title="Sign In"></a>
                    <a href="images/indoor/insideclubhouse.jpg" title="Lounge"></a>
                    <a href="images/indoor/noteboard.jpg" title="Notice Board"></a>
                    <a href="images/indoor/canteen.jpg" title="Canteen"></a>
                    <a href="images/indoor/rangegreen.jpg" title="Green Light and range door"></a>
                    <a href="images/indoor/rangered.jpg" title="Red Light and range door"></a>
                    <a href="images/indoor/rangedoor.jpg" title="Door to the range"></a>
                    <a href="images/indoor/emergencyexit.jpg" title="Emergency Exit"></a>
                    <a href="images/indoor/rangeexit.jpg" title="Exit from the range"></a>
                    <a href="images/indoor/safearea.jpg" title="Safe Area"></a>
                    <a href="images/indoor/safearea2.jpg" title="Safe Area"></a>
                    <a href="images/indoor/downrange.jpg" title="Down Range"></a>
                    <a href="images/indoor/firingline.jpg" title="The Firing Line"></a>                    
                </div>
            </div>
        </div>
        <script src="js/blueimp-gallery.min.js"></script>
        <script type="text/javascript">
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