import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderMembershipView = (props: PageProps): string => {
    const content = `
    <div class="row">
            <div class="col-12">
                <h1>Membership Info</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <h2>Membership and Fee Structure - <span id="yearSpan"></span></h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12 col-lg-6">
                            <div class="row">
                                <div class="col-12">
                                    <h2>Full Year September to September</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Iniation Fee (New Members Only)
                                </div>
                                <div class="col-4">
                                    $75.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    General
                                </div>
                                <div class="col-4">
                                    $350.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Senior
                                </div>
                                <div class="col-4">
                                    $320.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Junior
                                </div>
                                <div class="col-4">
                                    $250.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Family Members
                                </div>
                                <div class="col-4">
                                    ____ x $20
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Extra Swipe Cards
                                </div>
                                <div class="col-4">
                                    ____ x $25
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-lg-6">
                            <div class="row">
                                <div class="col-12">
                                    <h2>Half Year (April to September 30) - New Members Only</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Iniation Fee
                                </div>
                                <div class="col-4">
                                    $75.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    General
                                </div>
                                <div class="col-4">
                                    $250.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Senior
                                </div>
                                <div class="col-4">
                                    $230.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Junior
                                </div>
                                <div class="col-4">
                                    $180.00
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Family Members
                                </div>
                                <div class="col-4">
                                    ____ x $20
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Extra Swipe Cards
                                </div>
                                <div class="col-4">
                                    ____ x $25
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p>
                    For a full membership fee, you belong to all sections of the club but must complete each sections training course. <br />
                    A family membership includes your spouse, and all children under the age of 18 and still in school.<br />
                    Memberships are reduced by 50% + insurance for new members who join between April and September.<br />
                    Senior is anyone 65 years of age or over. <br />
                    Junior membership is for individuals under the age of 18 whose parents are not members.<br />
                </p>

                <p>
                    Membership applications are processed during the Executive meeting, the first tuesday of every month so get your applications in before then.
                </p>
            </div>
        </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};