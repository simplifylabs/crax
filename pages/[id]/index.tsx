import read, { Lock } from "@/lib/db";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Head from "next/head";

export default function Track() {
  const router = useRouter();

  const [lock, setLock] = useState<Lock | null>(null);
  const [frequency, setFrequency] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [mix, setMix] = useState<number>(0);

  useEffect(() => {
    if (!router.isReady) return;

    const db = read();
    const lock = db.data.locks[router.query.id as string];
    setLock(lock);

    if (lock.codes.length < 2) return;

    const digits: { [key: number]: { [key: number]: number } } = {};
    for (let digit = 0; digit < lock.digits; digit++) {
      digits[digit] = {};

      lock.codes.forEach((code) => {
        const value = Number(code[digit]);
        if (!digits[digit][value]) digits[digit][value] = 1;
        else digits[digit][value] += 1;
      });
    }

    let frequency = "";
    let average = "";
    let mix = "";

    Object.values(digits).forEach((count) => {
      const max = Object.values(count).reduce((a, b) => Math.max(a, b));
      const highest = Object.keys(count)
        .map(Number)
        .filter((key) => count[key] === max);

      const frequent = Math.round(
        highest.reduce((acc, curr) => acc + curr, 0) / highest.length
      );

      const avg = Math.round(
        Object.keys(count)
          .map(Number)
          .reduce((acc, key) => acc + count[key] * key, 0) / lock.codes.length
      );

      average = `${average}${avg}`;
      frequency = `${frequency}${frequent}`;
      mix = `${mix}${
        (count[frequent] || 0) / lock.codes.length > 0.4 ? frequent : avg
      }`;
    });

    setAverage(Number(average));
    setFrequency(Number(frequency));
    setMix(Number(mix));
  }, [router]);

  if (!lock) return null;
  return (
    <>
      <Head>
        <title>{lock.name} | Crax</title>
      </Head>
      <div className="flex flex-col items-center space-y-2">
        <p className="font-semibold uppercase tracking-widest text-foreground/50">
          {lock.name}
        </p>
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight">
          Results
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          The calculated results for this lock.
        </p>
      </div>
      {lock.codes.length > 1 ? (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Stat
            title="Guessed Pin (Mix)"
            value={String(mix).padStart(lock.digits, "0")}
            description="This guess includes both the the average and the frequency of each digit saved."
          />
          <Stat
            title="Guessed Pin (Freq.)"
            value={String(frequency).padStart(lock.digits, "0")}
            description="This guess is based on the most frequent number of each digit."
          />
          <Stat
            title="Guessed Pin (Avg.)"
            value={String(average).padStart(lock.digits, "0")}
            description="This guess is based on the arithmetic mean of each digit saved."
          />
          <Stat
            title="Tracked Codes"
            value={lock.codes.length}
            description="This is the total number of codes tracked. Track more codes to improve the results."
          />
        </div>
      ) : (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>No Data yet.</CardTitle>
            <CardDescription>
              Please track at least 2 codes first.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push(`/${lock.id}/track`)}>
              <Plus className="mr-2 h-4 w-4" />
              Track
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

interface StatProps {
  title: string;
  value: string | number;
  description?: string;
}

function Stat({ title, value, description }: StatProps) {
  return (
    <div className="w-[80vw] rounded-lg border bg-card text-card-foreground shadow-sm sm:w-[18rem]">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="text-base font-medium tracking-tight">{title}</h3>
      </div>
      <div className="space-y-2 p-6 pt-0">
        <p className="text-5xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
