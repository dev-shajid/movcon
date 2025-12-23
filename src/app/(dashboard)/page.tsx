import DashboardLoading from "@/components/skeleton/dashboard-loading";
import { Suspense } from "react";
import DashboardContent from "./_components/DashboardContent";


export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      {/* <DashboardLoading /> */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}