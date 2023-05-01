import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const trackedCodes = ["0000", "1990", "2010", "2005", "1980"];
const guessedCodes = ["0000", "1990", "1997", "2004", "2000"];

export default function Home() {
  const router = useRouter();

  const render = useRef(0);

  const [correct, setCorrect] = useState(false);
  const [tracked, setTracked] = useState(trackedCodes[0]);
  const [guessed, setGuessed] = useState(guessedCodes[0]);

  useEffect(() => {
    animate();
  }, []);

  function animate(step = 0) {
    setTracked(trackedCodes[step]);

    setTimeout(() => {
      setGuessed(guessedCodes[step]);
    }, 600);

    if (step + 1 < trackedCodes.length) {
      setTimeout(() => animate(step + 1), 1200);
      return;
    }

    setTimeout(() => {
      setCorrect(true);
    }, 600);

    setTimeout(() => {
      setCorrect(false);
      animate(0);
    }, 5000);
  }

  return (
    <>
      <h1 className="text-center text-[3.2rem] font-extrabold leading-none tracking-tighter sm:text-[5rem]">
        Crack Locks,
        <br />
        <span className="hidden sm:inline">just {""}</span>using Math.
      </h1>
      <p className="text-md mt-8 max-w-[80vw] text-center text-muted-foreground md:max-w-[35rem] md:text-lg">
        85% of the people only change up a few numbers on their locks. We use
        math to determine the most likely combinations.
      </p>
      <div className="mt-10 flex space-x-4">
        {/* <Button */}
        {/*   variant="secondary" */}
        {/*   onClick={() => router.push("/app")} */}
        {/*   className="px-8 py-7 text-lg" */}
        {/* > */}
        {/*   Learn More */}
        {/* </Button> */}
        <Button
          onClick={() => router.push("/app")}
          className="px-8 py-7 text-lg"
        >
          Get Started
        </Button>
      </div>
      <div className="mt-12 flex flex-col space-y-8 md:mt-20 md:flex-row md:space-x-12 md:space-y-0">
        <div className="flex flex-col items-start space-y-2">
          <p className="font-medium text-foreground/50">Tracked Lock:</p>
          <Lock code={tracked} />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex w-full items-center justify-between">
            <p className="font-medium text-foreground/50">Guessed Pin:</p>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                correct
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {correct ? <Check className="w-3" /> : <X className="w-3" />}
            </div>
          </div>
          <Lock code={guessed} />
        </div>
      </div>
    </>
  );
}

interface LockProps {
  code: string;
}

function Lock({ code }: LockProps) {
  const digits = code.split("").map(Number);

  return (
    <div className="flex space-x-2">
      {digits.map((digit, index) => (
        <Digit key={index} digit={digit} />
      ))}
    </div>
  );
}

interface DigitProps {
  digit: number;
}

function Digit({ digit }: DigitProps) {
  return (
    <div className="relative box-content flex h-14 w-10 flex-col overflow-hidden rounded-lg border border-input bg-white/5 shadow">
      <div
        style={{ transform: `translateY(${-100 * digit}%)` }}
        className="absolute h-full w-full transition-all duration-300"
      >
        {new Array(10).fill(null).map((_, index) => (
          <div
            key={index}
            className="flex h-14 w-10 items-center justify-center"
          >
            <p className="text-4xl font-bold">{index}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
