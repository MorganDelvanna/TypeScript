import { MenuItem } from "../utils/menuLoader";
import { renderLayout } from "./layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
}

export const renderRenewalView = (props: PageProps): string => {
    const content = `
      <div class="row">
          <div class="col-12">
              <h1>Renewals</h1>
          </div>
      </div>
      <div class="row">
        <div class="col-12">
            <h4>
                Want to Renew your membership?
            </h4>
            <p>
                Submit a completed renewal application & payment form to membership@pfga.ca or mail to P.O. Box 241 ‐ Peterborough, Ontario K9J 6Y1.
            </p>
            <p>
                <b>Note:</b>
                <ul>
                    <li>Please select “Renewal” on your application and include your PFGA membership number in the designated field.</li>

                    <li>Renewal applications which are incomplete, incorrect will not be renewed, but we will accept your fee as a donation to the club.</li>

                    <li>Our membership year runs from October 1st to September 30th. Please make sure you renew by September 30th to ensure your access card isn’t disabled.</li>

                    <li>Members who do not renew within the membership year may be required to re-do new member orientation and section training.</li>
                </ul>
            </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">                
            <h4>Pay Online using Stripe</h4>
            <p>                       
                Instead of filling out the paper form you can use this link to fill out the form online and pay using Stripe.
                <a href="stripe/memberform/renew">Stripe Online Membership Form</a>                    
            </p>
            <p>
                If you are just adding new family members or ordering extra swipe cards you can do so here:
                <a href="stripe/familyform/renew">Add Family/Order Cards Membership Form</a>
            </p>
        </div>
      </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};