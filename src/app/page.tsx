import Hero from "@/components/Hero";

import { Architects_Daughter } from "next/font/google";
import ArchitecturalDialogues from "@/components/ArchitecturalDialogues";
import AtelierPillars from "@/components/AtelierPillars";
import PrivateAppointment from "@/components/PrivateAppointment";
import CuratedMasterpieces from "@/components/collections/CuratedMasterpieces";
export default function Home() {
  return (
    <main>
      <Hero />

 <CuratedMasterpieces/>
  <ArchitecturalDialogues />
    
      <AtelierPillars />
      <PrivateAppointment />
    </main>
  );
}