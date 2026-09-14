import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderJuniorsView = (props: PageProps): string => {
    const content = `
      <div class="row">
            <div class="col-12">
                <h1>Junior Program</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <p>
                    The club has a very active junior program with many Ontario and Canadian champions in both air pistol and air rifle.
                    The PF&GA Junior program is designed to introduce new shooters to target shooting is air rifle, air pistol and smallbore rifle.
                    Emphasis is on safe gun handling and range safety. Rifles, pistols, pellets, targets, safety glasses are provided.
                </p>

                <p>Open to male and female participants between the ages of 11 to 21. </p>

                <p>The PF&GA Junior Air Program is held on Friday nights from 7pm to 9pm November to February on our 10m indoor range complete with returning targets.</p>

                <p>In the summer we move outdoors and learn .22 rifle.</p>

                <p>Junior shooters are encouraged to participate in shooting competitions. In the past few years we have had participants compete in the Lakeshore Smallbore Association matches, Ontario Provincial Indoor and Outdoor Championships, The Tournament of Juniors, The National Smallbore Championships in Calgary, The Grand Prix (which is an international event), as well as at our own club level matches. Our shooters have done well, often winning medals, most recently we took fifteen air gun shooters to the Ontario Winter Games where both our pistol team and rifle team won the Bronze medals as well as individual performances winning Gold, Silver and Bronze. More important than the medals was the experience of participating in an event of this magnitude. </p>

                <p>Target shooting with air guns, either rifle or pistol, is a sport that is open to all. There is no ideal criteria or age group for this sport. It is completely open, in some events male and female compete as equals. The shooting sports are one of the most popular sports in the world.  Competition is available at all levels and age groups, from club level right up to Olympic events. Shooters are able to be competitive into their senior years. There are events for disabled athletes as well.  Shooting is also a recreational sport, where individuals can practice at the club in non-competitive setting. </p>

                <p><a href="https://ontariotarget.ca/" target="_blank">ONTarget</a> membership is not mandatory for participants in registered competition, this is the Provincial organization responsible for matches, it's not neccessary to join our program.<br/>
                   <a href="https://sfc-ftc.ca/" target="_blank">Shooting Federation of Canada</a> (SFC) is mandatory, they are the Federal organiztion for registered comptetition, also not necessary to join our program. </p>

                <p>Sign up form can be downloaded <a href="forms/PFGA Juniors.pdf" target="_blank">here</a></p>

                <p><a href="/smallbore|pfga:ca?subject=Smallbore inquiry" id="email_one" title="">Bryan McKellar</a> is the director of the Junior Program</a></p>
            </div>
        </div>
        <script type="text/javascript">
            $(document).ready(function () {
                el = $('#email_one');
                el.each(function () {
                    el.attr('href', 'mailto:' + el.attr('href').replace('|', '@').replace('/', '').replace(':', '.'));
                    el.attr('title', el.attr('href').replace('|', '@').replace('/', '').replace(':', '.').replace('mailto.', 'Email: '));
                });
            });
        </script>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};