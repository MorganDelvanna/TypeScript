import { MenuItem } from "../../utils/menuLoader";
import { renderLayout } from "../layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  collectedBodyHTML: String[];
}

export const renderEmailHTML = (bodyHTML: String[]): string => {
  const emailHTML = `<div class="alert alert-info mt-2"><h3>Application Details</h3>
    ${bodyHTML.map(item => `<div class="body-record">
      ${item}
      </div><hr />`)}
    </div>
  `
  return emailHTML;
}

export const renderSuccessView = (props: PageProps): string => {
    const content = `
      <div class="sr-payment-summary completed-view">
        <h1>Your payment succeeded</h1>
      </div>
      <p>
        You have successfully completed your application(s), new members will be considered at the next Board of Directors meeting and you will be contacted<br />
        You will be contacted sometime after the meeting to inform you if you have been accepted or not.<br />
        
        The following has been emailed to the Membership Secretary and to you:
      </p>

      <div class="sr-section completed-view">
        ${renderEmailHTML(props.collectedBodyHTML)}
      </div>
      <div class="sr-section">
        If you are a new member, as part of the new member application process please submit a photo for each family member to be used for ID. Email your photo(s) to membership@pfga.ca. The photo does not need to be professional, it can be taken on your phone. It should look like a passport photo. Please stand in front of a plain, preferably light coloured, background and include your head and shoulders. You can smile or not, whichever you prefer. Your face needs to be clearly seen. Thank you. 
      </div>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};