import { getIDPPlans } from "@/actions/idp";
import ApprovalsClient from "./ApprovalsClient";

export default async function ApprovalPage() {
  const plans = await getIDPPlans();
  return <ApprovalsClient initialPlans={plans} />;
}
