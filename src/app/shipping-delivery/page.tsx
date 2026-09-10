import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const sections = [
["1. Processing & Production","Orders are processed after payment and confirmation. Made-to-order and customized products may require additional production time. Any timeline communicated at purchase or confirmation is an estimate."],
["2. Delivery Areas","NIRA serves customers across India subject to service availability. Remote or restricted locations may require additional logistics arrangements or charges."],
["3. Delivery Charges","Applicable delivery charges will be communicated during ordering or confirmation. Special handling, stairs, assembly, access, or location-specific logistics may attract additional charges."],
["4. Delivery Appointment","Our team or logistics partner may contact you to coordinate a delivery window. Please ensure an adult is available and that the premises provide safe and reasonable access."],
["5. Inspection at Delivery","Please inspect packaging and furniture at delivery where reasonably possible. If visible damage is noticed, record it and contact NIRA promptly with photographs or video."],
["6. Delays","Weather, transportation disruptions, public holidays, production requirements, remote locations, access restrictions, or circumstances beyond reasonable control may cause delays. We will make reasonable efforts to communicate material delays."],
["7. Address Changes","Provide a complete and accurate delivery address. Changes after dispatch may cause additional charges or delays and may not always be possible."],
["8. Assembly & Installation","Where assembly or installation is included or separately agreed, it will be coordinated with delivery. Please contact NIRA before modifying structural components if there is an issue."],
];

export default function Page(){return <Policy title="Shipping & Delivery Policy" intro="NIRA Furniture delivers carefully prepared furniture across India. Delivery timelines vary by product, destination, customization, production schedule, and logistics conditions." sections={sections}/>;}
function Policy({title,intro,sections}:{title:string;intro:string;sections:string[][]}){return <main className="min-h-screen bg-[#F4F0E8] text-[#211E1A]"><Header title={title}/><article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24"><p className="border-l-2 border-[#927344] pl-5 text-base leading-8 text-[#4F4942] sm:text-lg">{intro}</p>{sections.map(([h,p])=><section key={h} className="border-b border-[#211E1A]/10 py-8"><h2 className="font-serif text-2xl sm:text-3xl">{h}</h2><p className="mt-4 text-sm leading-7 text-[#5F5951]">{p}</p></section>)}<Link href="/contact-support" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#927344]">Contact Support <ArrowUpRight size={14}/></Link></article></main>}
function Header({title}:{title:string}){return <header className="border-b border-[#211E1A]/10"><div className="mx-auto max-w-6xl px-5 py-7 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#756D63]"><ArrowLeft size={13}/> NIRA Furniture</Link><p className="mt-12 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#927344]">Customer Policies</p><h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl">{title}</h1></div></header>}
