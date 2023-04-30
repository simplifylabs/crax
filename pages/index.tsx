import Create from "@/components/Create";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import read, { Lock } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { BarChart2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const [locks, setLocks] = useState<Lock[]>([]);

  useEffect(() => {
    const db = read();
    setLocks(Object.values(db.data.locks));
  }, []);

  return (
    <>
      <Head>
        <title>Crax: Crack Locks, using Math.</title>
      </Head>
      <div className="flex flex-col items-center space-y-2">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
          Crax
        </h1>
        <p className="text-lg text-muted-foreground">
          Crack Locks, using Math.
        </p>
      </div>
      {locks.length ? <Add /> : null}
      {locks.length ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {locks.map((lock) => (
            <Lock key={lock.id} {...lock} />
          ))}
        </div>
      ) : (
        <Create first />
      )}
    </>
  );
}

function Add() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="mt-8">
          <Plus className="mr-2 h-4 w-4" />
          Add Lock
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!w-auto !max-w-none border-none bg-transparent p-0">
        <Create />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Lock({ id, name, codes }: Lock) {
  const router = useRouter();

  return (
    <Card className="w-[90vw] sm:w-[20rem]">
      <CardHeader className="pb-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>Tracked {codes.length} times.</CardDescription>
      </CardHeader>
      <CardContent className="flex space-x-2">
        <Button
          onClick={() => router.push(`/${id}`)}
          className="w-1/2"
          variant="secondary"
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Results
        </Button>
        <Button onClick={() => router.push(`/${id}/track`)} className="w-1/2">
          <Plus className="mr-2 h-4 w-4" />
          Track
        </Button>
      </CardContent>
    </Card>
  );
}
