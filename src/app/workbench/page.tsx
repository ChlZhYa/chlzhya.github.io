import { WorkbenchView } from "@/components/workbench/WorkbenchView";
import { Suspense } from "react";

/**
 * Workbench — Living Index。
 * 真实实现：生长墨线索引 + 焦点绽放 + 资源/档案卫星线索。
 */
export const metadata = { title: "Workbench" };

export default function WorkbenchPage() {
  return (
    <Suspense fallback={null}>
      <WorkbenchView />
    </Suspense>
  );
}
