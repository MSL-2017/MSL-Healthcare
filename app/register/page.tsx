import EnquiryPage from "../enquiry-page";
import {pageMeta} from "../metadata";
import {specialties} from "../specialties";
export const metadata=pageMeta("Register with MSL","Prepare your candidate registration enquiry for MSL Healthcare.","/register");
export default async function Page({searchParams}:{searchParams:Promise<{specialty?:string | string[]}>}){
 const selected=(await searchParams).specialty;
 return <EnquiryPage kind="register" initialSpecialty={typeof selected==="string" && specialties.includes(selected)?selected:""}/>
}
