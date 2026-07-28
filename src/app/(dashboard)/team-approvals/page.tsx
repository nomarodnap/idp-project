import { getPlansForSupervisor } from "@/actions/idp";
import TeamApprovalsClient from "./TeamApprovalsClient";

export default async function TeamApprovalsPage() {
  const plans = await getPlansForSupervisor();

  return <TeamApprovalsClient initialPlans={plans} />;
}
