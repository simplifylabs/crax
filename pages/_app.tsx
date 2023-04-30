import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <main
      className={`${inter.variable} ${
        raleway.variable
      } flex min-h-screen flex-col items-center font-sans ${
        router.pathname == "/" ? "py-16" : "pb-16 pt-32"
      }`}
    >
      {router.pathname !== "/" && <Navigation />}
      <div className="mt-auto"></div>
      <Component {...pageProps} />
      <div className="mb-auto"></div>
      <Toaster />
    </main>
  );
}
