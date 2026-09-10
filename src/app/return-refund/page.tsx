import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const sections = [
  ["1. Eligibility for Returns", "A return may be considered when a product arrives damaged, defective, materially different from its description, or incorrect compared with the confirmed order. Please raise a return request within 48 hours of delivery with clear photographs or video."],
  ["2. Custom & Made-to-Order Furniture", "Customized, made-to-order, personalized, or specially finished furniture generally cannot be returned or cancelled once production has commenced, except where the product is defective or damaged in transit."],
  ["3. Damaged or Incorrect Items", "If furniture arrives damaged or incorrect, contact NIRA promptly. We may request photographs, an unpacking video, delivery details, and other information needed to assess the claim. After verification, we may arrange repair, replacement, or another appropriate resolution."],
  ["4. Refunds", "Where a refund is approved, it will normally be processed to the original payment method. Processing time depends on the payment provider or bank. Approved refunds may exclude clearly communicated non-refundable charges."],
  ["5. Order Cancellation", "Cancellation requests should be made as early as possible. Orders that have entered production, customization, dispatch, or delivery may not be cancellable."],
  ["6. Natural Material Variations", "Natural wood grain, stone, fabric texture, colour, finish, and handcrafted detailing can vary. Such normal variations are not necessarily defects, and screen colours may differ slightly from physical materials."],
];

export default function Page() {
  return <PolicyPage title="Return & Refund Policy" intro="Every NIRA piece is prepared with care. Because furniture may be made to order or customized, returns and refunds are subject to the conditions below." sections={sections} />;
}

function PolicyPage({title, intro, sections}:{title:string;intro:string;sections:string[][]}) {
  return <main className="min-h-screen bg-[#F4F0E8] text-[#211E1A]"><Header title={title}/><article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24"><p className="border-l-2 border-[#927344] pl-5 text-base leading-8 text-[#4F4942] sm:text-lg">{intro}</p>{sections.map(([h,p])=><section key={h} className="border-b border-[#211E1A]/10 py-8"><h2 className="font-serif text-2xl sm:text-3xl">{h}</h2><p className="mt-4 text-sm leading-7 text-[#5F5951] sm:text-[15px]">{p}</p></section>)}<p className="mt-8 text-xs leading-6 text-[#756D63]">Your statutory rights under applicable Indian law are not excluded or limited by this policy.</p><Link href="/contact-support" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#927344]">Contact Support <ArrowUpRight size={14}/></Link></article></main>;
}
function Header({title}:{title:string}) { return <header className="border-b border-[#211E1A]/10"><div className="mx-auto max-w-6xl px-5 py-7 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#756D63]"><ArrowLeft size={13}/> NIRA Furniture</Link><p className="mt-12 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#927344]">Customer Policies</p><h1 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">{title}</h1></div></header>; }
