import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { BarChart2, Plus } from "lucide-react";

export default function Navigation() {
  const router = useRouter();

  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
      <Link
        href="/"
        className="tracking-tighest font-raleway text-3xl font-extrabold text-foreground"
      >
        Crax
      </Link>
      {router.pathname == "/[id]" ? (
        <Button onClick={() => router.push(`/${router.query.id}/track`)}>
          <Plus className="mr-2 h-4 w-4" />
          Track
        </Button>
      ) : router.pathname == "/[id]/track" ? (
        <Button onClick={() => router.push(`/${router.query.id}`)}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Results
        </Button>
      ) : null}
    </div>
  );
}
