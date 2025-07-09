import { useParams } from "react-router-dom";
import LogPage from "./LogPage";

export default function LogPageWrapper() {
  const { logId } = useParams<{ logId: string }>();
  if (!logId) return <p className="text-red-500">Missing log ID</p>;

  return <LogPage logId={logId} />;
}
