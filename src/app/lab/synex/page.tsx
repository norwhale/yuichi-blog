import type { Metadata } from "next";
import SynexPage from "./SynexPage";

export const metadata: Metadata = {
  title: "Synex Experiment",
  description: "A design recreation experiment built inside yuichi.blog lab.",
  alternates: {
    canonical: "https://yuichi.blog/lab/synex",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SynexExperimentPage() {
  return <SynexPage />;
}
