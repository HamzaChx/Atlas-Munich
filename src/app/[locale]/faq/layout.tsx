import { Metadata } from "next";

/**
 * `/faq` is retired. Its 32 questions now sit on the journey hub that answers
 * them, each with its own `FAQPage` block matching what is visible there.
 *
 * The route survives only to rescue deep links. A 301 cannot do that job: a
 * URL fragment is never sent to the server, so redirecting `/faq#faq-kvr-3`
 * would silently drop the fragment and drop the reader on a page that does not
 * contain their question. The page below resolves the hash client-side instead.
 *
 * `noindex, follow` keeps it out of the index while still passing link equity
 * on to the hubs. Once the logs show no traffic, replace the whole thing with
 * a 308 to /chat.
 */
export const metadata: Metadata = {
  title: "Questions",
  robots: { index: false, follow: true },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
