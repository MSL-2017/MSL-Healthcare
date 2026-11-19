import {paths,origin} from "./site";
export default function sitemap(){return paths.map(path=>({url:new URL(path,origin).href}))}
