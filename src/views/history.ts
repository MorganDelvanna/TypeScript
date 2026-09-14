import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderHistoryView = (props: PageProps): string => {
    const content = `
        <div class="row">
            <div class="col-12">
                <h1>Club History</h1>
            </div>
        </div>
        <div class="row  align-items-center">
            <div class="col-10">
                <p>
                    We at Peterborough Fish and Game Association have a lot to be proud of. PF&GA is the oldest shooting
                    facility in the area and is located a 10-minute drive east of downtown Peterborough on 100 acres of land.
                    Our facilities include a heated clubhouse with a lounge, canteen, and washrooms. The clubhouse has
                    Peterborough's only heated indoor shooting range for pellet, .22 calibre rifles and handguns, center fire
                    handguns and archery activities. High-powered rifles are shot outdoors. Our outdoor facilities, located on
                    the west side of the property include 6 outdoor shooting ranges, and 2 outdoor archery ranges and a 3D archery range.
                    Our major activities include a very active junior program, archery, handguns, and action shooting. The facilities are available
                    7 days a week to members.
                </p>
                <p>
                    PF&GA was founded in 1952. The original clubhouse was on Parkhill Road near Jackson Creek Park. In 1978,
                    through a grant from Lottario, the present acreage on Division Rd. was purchased and the clubhouse built.
                    Over the years, new ranges and facilities have been added. Further expansion is in the planning stages.
                </p>
                <p>
                    The Club's facilities are used by many law enforcement agencies for training purposes.
                </p>
                <p>
                    All membership dues go towards club maintenance and expansion. PF&GA is looking at adding to the
                    clubhouse so that the archery and air pellet sections have their own facilities.
                </p>
                <p>
                    The club has a very active junior program with many Ontario and Canadian champions. The handgun
                    section has Canadian 900, 1800 and Practical Pistol. Smallbore rifle and Air rifle have been with
                    us for many years.
                </p>

            </div>
        </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};