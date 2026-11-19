import EnquiryPage from "../enquiry-page";
import {pageMeta} from "../metadata";
export const metadata=pageMeta("Request staff","Discuss healthcare staffing requirements with our recruitment team.","/request-staff");
export default function Page(){return <EnquiryPage kind="staff"/>}
