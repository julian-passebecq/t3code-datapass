import { createFileRoute } from "@tanstack/react-router";
import { DataPassCockpit } from "../components/datapass/DataPassCockpit";

export const Route = createFileRoute("/_chat/datapass")({ component: DataPassCockpit });
