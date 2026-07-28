import { getIDPPlans } from "@/actions/idp";
import ApprovalsClient from "./ApprovalsClient";

export default async function ApprovalPage() {
  const plans = await getIDPPlans({ fetchAll: true });
  return <ApprovalsClient initialPlans={plans} />;
}
