import { getIDPPlans } from "@/actions/idp";
import { getSystemPhase } from "@/actions/settings";
import IDPTableClient from "./IDPTableClient";

export default async function IDPListPage() {
  const plans = await getIDPPlans();
  const IDP_PHASE = await getSystemPhase();

  return <IDPTableClient initialPlans={plans} IDP_PHASE={IDP_PHASE} />;
}
