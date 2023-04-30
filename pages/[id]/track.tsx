import dynamic from "next/dynamic";
import read, { Lock } from "@/lib/db";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

const ReactCodeInput = dynamic(import("react-code-input"));

export default function Track() {
  const router = useRouter();

  const [lock, setLock] = useState<Lock | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const db = read();
    setLock(db.data.locks[router.query.id as string]);
  }, [router]);

  function save() {
    if (!lock) return;

    const db = read();
    if (!db.data.locks[lock.id]) return;

    db.data.locks[lock.id].codes.push(code);
    db.write();

    router.push(`/${lock.id}`);
  }

  if (!lock) return null;
  return (
    <>
      <Head>
        <title>Track {lock.name} | Crax</title>
      </Head>
      <div className="flex flex-col items-center space-y-2">
        <p className="font-semibold uppercase tracking-widest text-foreground/50">
          {lock.name}
        </p>
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight sm:text-7xl">
          Track
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Enter the lock&apos;s current code.
        </p>
      </div>
      <div className="mt-8 flex max-w-[90vw] flex-col items-center space-y-2">
        <ReactCodeInput
          name="number"
          type="number"
          inputMode="numeric"
          fields={lock.digits}
          value={code}
          onChange={setCode}
          autoFocus
        />
        <Button
          onClick={save}
          disabled={code.length < lock.digits}
          size="lg"
          className="w-full"
        >
          Track
        </Button>
      </div>
    </>
  );
}
