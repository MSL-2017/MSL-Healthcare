import type {Metadata} from "next";
export function pageMeta(title:string,description:string,path:string):Metadata{
 return {title,description,alternates:{canonical:path},openGraph:{type:"website",siteName:"MSL Healthcare",locale:"en_GB",title,description,url:path,images:["/nursing-care.jpg"]}};
}
