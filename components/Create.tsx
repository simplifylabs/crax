import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { customAlphabet } from "nanoid";
import read from "@/lib/db";
import { Plus } from "lucide-react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  5
);

interface CreateProps {
  first?: boolean;
}

export default function Create({ first }: CreateProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [digits, setDigits] = useState(4);

  function submit() {
    const id = nanoid();
    const db = read();

    db.data.locks[id] = {
      id,
      name,
      digits,
      codes: [],
    };

    db.write();
    router.push(`/${id}/track`);
  }

  return (
    <Card
      className={`rounded-xl ${
        first ? "mt-12 w-[90vw] sm:w-[350px]" : "w-screen sm:w-[350px]"
      }`}
    >
      <CardHeader className={first ? "" : "items-center"}>
        <CardTitle
          className={first ? "" : "text-3xl font-bold tracking-tighter"}
        >
          Create Lock
        </CardTitle>
        <CardDescription>
          {first
            ? "Start tracking your first lock."
            : "Start tracking a new lock."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Name of the lock"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="digits">Digits</Label>
                <p className="text-sm text-muted-foreground">{digits} Digits</p>
              </div>
              <Slider
                id="digits"
                min={1}
                max={8}
                step={1}
                value={[digits]}
                onValueChange={(to) => setDigits(to[0])}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className={`flex justify-between ${first ? "" : "pt-4"}`}>
        {first == true ? (
          <div></div>
        ) : (
          <AlertDialogCancel className="text-white/50" asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
        )}
        <Button disabled={!name} onClick={submit}>
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
