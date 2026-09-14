import { MenuItem } from "../../utils/menuLoader";
import { renderLayout } from "../layout";

export interface PageProps {
  menuMap: MenuItem[];
  currentPath: string;
  applicationType: string;
  fees: Map<string, number>;
  csrfToken: string;
}

const serializeFeeMap = (fees: Map<string, number>): string =>
        JSON.stringify(Object.fromEntries(fees));

export const renderMemberView = (props: PageProps): string => {
    const content = `
    <!-- Embedded Data Script -->
        <h1>Membership Application</h1>
        <h2><span id="memberYear">October 1st, 2025 - September 30th, 2026</span></h2>
        <form id="memberForm" action="/stripe/checkout" method="POST" enctype="multipart/form-data">
          <input id="csrfToken" name="token" type="hidden" value="${props.csrfToken}" />
          <input type="hidden" id="members_json" name="members_json"  value="">
            <input type="hidden" id="photoData" name="photoData" value="">
            <input type="hidden" id="photoName" name="photoName" value="">
            <input type="hidden" id="photoType" name="photoType" value="">
            <p>All required fields must be complete. Applications that are illegible, incomplete or incorrect WILL NOT BE ACCEPTED.<br />
                The membership application and payment form must be submitted with appropriate fees for presentation to the Board of Directors. Applications without payment WILL NOT BE ACCEPTED.</p>
            <p>As part of the new member application process please submit a photo for each family member to be used for ID. Email your photo(s) to membership@pfga.ca. The photo does not need to be professional, it can be taken on your phone. It should look like a passport photo. Please stand in front of a plain, preferably light coloured, background and include your head and shoulders. You can smile or not, whichever you prefer. Your face needs to be clearly seen. Thank you. </p>
            <br />
            <div class="row">
                <div class="col-12"><strong>Application Type: </strong>(Please select one of the following options)</div>
            </div>
            <div class="row mt-1">
                <div class="col-12 col-md-4">
                    <div class="form-check">
                        <input type="radio" id="newMember" name="applicationType" value="new" class="form-check-input" checked> <label class="form-check-label" for="newMember">New Membership (Full Year)</label>
                    </div>
                </div>
                <div class="col-12 col-md-4" id="halfColumn">
                    <div class="form-check">
                        <input type="radio" id="halfMember" name="applicationType" value="half" class="form-check-input"> <label class="form-check-label" for="halfMember">New Membership (Half Year)*<br />April to September</label>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="form-check">
                        <input type="radio" id="renewMember" name="applicationType" value="renew" class="form-check-input"> <label class="form-check-label" for="renewMember">Membership Renewal</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                   <span id="halfSpan">Note: Half-Year Applications are for NEW MEMBERS ONLY who join April 1st - Sept 30th.</span>
                </div>
            </div>
  
            <hr />

            <div class="row">
                <div class="col-12">
                    <span><strong>Personal Information:</strong> (Please Complete all <span class="required">REQUIRED</span> fields)</span>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-2">
                    <label for="firstname" class="form-label title required">First Name</label><br />
                    <input id="firstname" type="text" class="form-control new" name="firstname" required>
                </div>
                <div class="col-12 col-md-2">
                    <label for="lastname" class="form-label title required">Last Name</label><br />
                    <input id="lastname" type="text" class="form-control new" name="lastname" required>
                </div>
                <div class="col-12 col-md-2">
                    <label for="alias" class="form-label">Preferred Name</label><br />
                    <input id="alias" type="text" class="form-control" name="alias">
                </div>
                <div class="col-12 col-md-2">
                    <label for="dob" class="form-label title required new" >Date of Birth</label><br/>
                    <input id="dob" type="date" class="form-control new" name="dob" required>
                </div>
                <div id="cardCell" class="col-12 col-md-3 hidden">
                    <label id="cardLabel" for="pfgaNumber" class="form-label">PFGA Card #</label><br/>
                    <input id="pfgaNumber" type="text" class="form-control" name="pfgaNumber">
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-3">
                    <label for="address" class="form-label title required new">Home Address</label><br />
                    <input id="address" type="text" class="form-control new" name="address" required>
                </div>
                <div class="col-12 col-md-2" >
                    <label for="city" class="form-label title required new">City</label><br />
                    <input id="city" type="text" class="form-control new" name="city" required>
                </div>
                <div class="col-12 col-md-2">
                    <label for="province" class="form-label title required new">Province</label><br />
                    <input id="province" type="text" class="form-control new" name="province" required>
                </div>
                <div class="col-12 col-md-2">
                    <label for="postal" class="form-label title required new">Postal Code</label><br />
                    <input id="postal" type="text" class="form-control new" name="postal" required>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-2">
                    <label for="homephone" class="form-label title">Home Phone *</label><br/>
                    <input id="homephone" type="text" class="form-control new phone" name="homephone" >
                </div>
                <div class="col-12 col-md-2">
                    <label for="cellphone" class="form-label title">Cell Phone *</label><br />
                    <input id="cellphone" type="text" class="form-control new phone" name="cellphone" >
                </div>
                <div class="col-12 col-md-4">
                    <label for="email" class="form-label title required new">E-Mail Address</label>
                    <input type="text" id="email" class="form-control new" name="email" required>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-4">
                    <div class="row">
                        <div class="col-4 centered">
                            <label for="pal" class="form-check-label title required">PAL</label><br />
                            <div class="form-check">
                              <input type="radio" class="form-check-input" id="pal" name="palType" value="pal" required checked>
                            </div>
                        </div>
                        <div class="col-4 centered">
                          <label for="rpal" class="form-check-label title required">RPAL</label><br />
                          <div class="form-check">
                            <input type="radio" class="form-check-input" id="rpal" name="palType" value="rpal">
                          </div>
                        </div>
                        <div class="col-4 centered">
                            <label for="noPal" class="form-check-label title required">None</label><br />
                          <div class="form-check">
                            <input type="radio" class="form-check-input" id="noPal" name="palType" value="noPal">
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-2">
                    <label for="palDate" class="form-label title">Approx. Date of PAL Course (MM-YY)</label>
                    <input type="text" id="palDate" name="palDate" class="form-control">
                </div>                    
                <div class="col-12 col-md-2">
                    <label for="PALNum" class="form-label title required pal">PAL/RPAL #</label>
                    <input type="text" id="PALNum" name="palNum" class="form-control" required>
                </div>
                <div class="col-12 col-md-2">
                    <label for="palExpiry" class="form-label title required pal">Pal Expiry Date</label>
                    <input type="date" id="palExpiry" name="palExpiry" class="form-control" required>
                </div>
            </div>
            <hr />
            <div class="row mt-2 newOnly">
                <div class="col-12">
                    <span><strong>Please select the section(s) you would like to join:</strong> (New Members Only)</span>
                </div>
                <div class="col-12 col-md-2" style="align-content: center;">
                    <div  class="form-check">
                    <input type="checkbox" class="form-check-input" id="archery" name="archery">
                    <label class="form-check-label ml-1" for="archery">Archery</label>
                    </div>
                </div>
                <div class="col-12 col-md-2" style="align-content: center;">
                    <input type="checkbox" class="form-check-input" id="rifle" name="rifle">
                    <label class="form-check-label ml-1" for="rifle">Rifle</label>
                </div>
                <div class="col-12 col-md-2" style="align-content: center;">
                    <input type="checkbox" class="form-check-input" id="smallbore" name="smallbore">
                    <label class="form-check-label ml-1" for="smallbore">Smallbore</label>
                </div>
                <div class="col-12 col-md-2" style="align-content: center;">
                    <input type="checkbox" class="form-check-input" id="handgun" name="handgun">
                    <label class="form-check-label ml-1" for="handgun">Handgun</label>
                </div>
                <div class="col-12 col-md-2" style="align-content: center;">
                    <input type="checkbox" class="form-check-input" id="action" name="action">
                    <label class="form-check-label ml-1" for="action">Action*</label>
                </div>
                <div class="col-12">
                    <span><strong>Note:</strong> In order to join Action Pistol you must first join Handgun, or be a current active member of an action shooting organization such as IPSC, IDPA, or ICORE. Please include this in the training & certifications section.</span>
                </div>
            </div>
            <hr />
            <div class="row mt-2 newOnly">
                <div class="col-12">
                    <div class="row mt-3">
                        <div class="col-12">
                            <strong>Photo Upload:</strong>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <label for="photo" class="title form-label required">Passport-style Photo</label><br />
                            <input id="photo" type="file" class="form-control new" name="photo" accept="image/jpeg,image/jpg,image/png">
                            <small class="form-text text-muted">Upload a passport-style JPG or PNG photo, max 200 KB. The image should be portrait orientation with a near passport ratio.</small>
                            <div id="photoError" class="error"></div>
                        </div>
                    </div>
                </div>
            </div>            
            <hr class="newOnly" />
            <div class="row mt-2">
                <div class="col-12 col-md-8">
                    <strong>Additional Family Members:</strong> (Please ensure you included the appropriate number of family members in the Membership Fees section below)<br />
                    <button type="button" class="btn btn-primary" id="addFamily">Add Family</button>
                </div>
            </div>

            <div id="familyApp">
                <div class="row">
                    <div class="d-none d-sm-block col-md-2"><label class="centered required">First Name</label></div>
                    <div class="d-none d-sm-block col-md-3"><label class="centered required">Last Name</label></div>
                    <div class="d-none d-sm-block col-md-2"><label class="centered">PAL#</label></div>
                    <div class="d-none d-sm-block col-md-2"><label class="centered">PAL Expiry</label></div>
                    <div class="d-none d-sm-block col-md-2"><label class="centered required">Date of Birth</label></div>
                </div>                
            </div>
                
            <hr />
            <div id="clubsApp" class="newOnly">
                <div class="row mt-2">
                    <div class="col-12 col-md-7">
                        <strong>Other Club Affiliations Past or Present:</strong> (New Members Only - Optional)<br />
                        <button id="addClub" class="btn btn-primary" type="button">Add Club</button>
                    </div>
                </div>
                <div class="row">
                    <div class="d-none d-sm-block col-md-3 centered">Club Name</div>
                    <div class="d-none d-sm-block col-md-3 centered">City, Province</div>
                    <div class="d-none d-sm-block col-md-2 centered">From (MM/YY)</div>
                    <div class="d-none d-sm-block col-md-2 centered">To (MM/YY)</div>
                </div>

            </div>
                
            <hr class="newOnly" />
            <div id="coursesApp" class="newOnly">
                <div class="row mt-2">
                    <div class="col-12 col-md-8">
                        <strong>Firearms/Archery Training or Certifications:</strong> (New Members Only - Optional)<br />
                        <button type="button" class="btn btn-primary" id="addCourse">Add Training/Certification</button>
                    </div>
                </div>
                <div class="row">
                    <div class="d-none d-sm-block col-md-3 centered">Description</div>
                    <div class="d-none d-sm-block col-md-3 centered">Instructor/Trainer</div>
                    <div class="d-none d-sm-block col-md-3 centered">Location</div>
                    <div class="d-none d-sm-block col-md-2 centered">Date (MM/YY)</div>
                </div>
            </div>
            <hr class="newOnly" />
            <div class="row mt-2">
                <div class="col-12">
                    <strong>Membership Fees:</strong> (Please select the appropriate membership options and add the appropriate fees in the membership dues column). Fees are not refundable.
                </div>                                           
            </div>
            <div class="row">
                <div class="col-6"><strong>Membership<span class="d-none d-sm-block"> Options</span></strong></div>
                <div class="d-none d-sm-block col-md-2"><strong>Full Year (Oct 1 - Sept 30)</strong></div>
                <div class="d-none d-sm-block col-md-2"><strong>Half Year (April 1 - Sept 30)</strong></div>
                <div class="col-6 col-md-2"><strong><span class="d-none d-sm-block">Membership </span>Dues</strong></div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">New Member Initiation Fee (New Members Only)</div>
                <div class="col-6 d-md-none">Initiation Fee (<span class="d-md-none initiaionFee">$75</span>)</div>
                <div class="d-none d-sm-block col-md-2"><span class="initiaionFee">$75</span></div>
                <div class="d-none d-sm-block col-md-2"><span class="initiaionFee">$75</span></div>
                <div class="col-6 col-md-2"><span id="initiationFee"></span></div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">General Membership Fee</div>
                <div class="col-6 d-md-none">General Fee</div>
                <div class="d-none d-sm-block col-md-2">${props.fees.get('general')}</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('general_half')}</div>
                <div class="col-6 col-md-2"><input id="generalBtn" type="radio" title="General Membership" name="membershipFee" value="general" checked>&nbsp;$${props.fees.get('general')}</div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">Senior Membership Fee (65+)</div>
                <div class="col-6 d-md-none">Senior Fee (65+)</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('senior')}</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('senior_half')}</div>
                <div class="col-6 col-md-2"><input type="radio" title="Senior Membership" name="membershipFee" value="senior">&nbsp;$${props.fees.get('senior')}</div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">Junior Membership Fee (12-18)</div>
                <div class="col-6 d-md-none">Junior Fee (12-18)</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('junior')}</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('junior_half')}</div>
                <div class="col-6 col-md-2"><input type="radio" title="Junior Membership" name="membershipFee" value="junior">&nbsp;$${props.fees.get('junior')}</div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">Summer Archery (Outdoor Archery Only - April 1 to Sept 30)</div>
                <div class="col-6 d-md-none">Summer Archery</div>
                <div class="d-none d-sm-block col-md-2">N/A</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('general_half')}</div>
                <div class="col-6 col-md-2"><input id="archeryBtn" type="radio" title="Archery Membership" name="membershipFee" value="archery" class="hidden">&nbsp;$${props.fees.get('general_half')}</div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">Additional Family Members<</div>
                <div class="col-6 d-md-none">Extra Family</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('family')}</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('family')}</div>
                <div class="col-2 col-md-2"><input type="number" id="family" name="family" value="0"></div>
            </div>
            <div class="row">
                <div class="d-none d-sm-block col-md-6">Extra Swipe Cards<br />
                                        <span><strong>Note:</strong> Extra swipe cards are for adults who will require their own swipe card to access the club</span></div>
                <div class="col-6 d-md-none">Extra Swipe Cards</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('extra')}</div>
                <div class="d-none d-sm-block col-md-2">$${props.fees.get('extra')}</div>
                <div class="col-2 col-md-2"><input type="number" id="extra" name="extra" value="0"></div>                
            </div>
            <div class="row">
                <div class="col-6 col-md-10 align-content-end"><strong>Amount Due:</strong></div>
                <div class="col-6 col-md-2">&nbsp;$<span id="total"></span></div>
            </div>
            <div class="row mt-2">
                <div class="col-6 col-md-10 align-content-end"><strong>Grand Total (All Applicants):</strong></div>
                <div class="col-6 col-md-2"><strong>$<span id="grandTotal">0</span></strong></div>
            </div>         
            <div class="row mt-2 terms">
                <div class="col-12">
                    <input type="checkbox" id="terms" name="terms" required>
                    <label class="ml-1" for="terms">I agree that I have read the all the instructions and I hereby declare that the information provided is true and correct</label>
                </div>
            </div>              
            <div class="row mt-2">
                <div class="col-8 col-md-4">
                    <span id="errors" class="error"></span>
                    <button type="button" class="btn btn-primary" id="addApplicant">Add Another Applicant</button>                    
                </div>
            </div>
            <hr />
            <div class="row mt-2">
                <div class="col-12">
                    <button type="button" class="btn btn-primary" id="btnSubmit">Submit</button>
                    <span id="applicantCount">0 applicants added</span>
                    <div id="applicantList"></div>
                </div>
            </div>
        </form>
        <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/additional-methods.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/jquery.inputmask.min.js"></script>
        <script src="/js/members.js"></script>
        <script id="fee-data" type="application/json">
          ${serializeFeeMap(props.fees)}
        </script>
    `;

    return renderLayout({ menu: props.menuMap, currentPath: props.currentPath}, content );
};