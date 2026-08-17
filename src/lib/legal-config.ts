/**
 * Single source of truth for the identity, dates and addresses that the legal
 * pages depend on. Keeping them here (instead of inside messages/*.json) means
 * one edit updates the Privacy Policy and the Terms in all three languages at
 * once, and there is exactly one place to look when something changes.
 *
 * The i18n text may reference these values with the tokens {entity},
 * {operator}, {email}, {site} and {repo}; LegalDocument substitutes them.
 */

export const LEGAL = {
  /** The project as it is presented to the public. */
  entity: "Atlas Munich",

  /** Natural person responsible for the site (Art. 4(7) GDPR controller). */
  operator: "Hamza Chaouki",

  /**
   * Postal address published for provider identification.
   *
   * REQUIRED BY LAW, PLEASE FILL IN: section 5 DDG and section 18(2) MStV
   * oblige a site with editorial content to publish a summonable postal
   * address. A P.O. box is not sufficient. Until this is set, the legal pages
   * show a visible warning instead of an address.
   */
  postalAddress: null as string[] | null,

  /** Contact address for general, privacy and security correspondence. */
  email: "hamza.chaouki@tum.de",

  site: "https://atlasmunich.de",
  repo: "https://github.com/HamzaChx/Atlas-Munich",

  /** Versioning. Bump both values whenever the text changes materially. */
  privacy: { version: "2.1", effective: "2026-08-17" },
  terms: { version: "2.1", effective: "2026-08-17" },

  /**
   * Lead supervisory authority for a controller established in Bavaria
   * (private sector). Visitors may also complain to their own authority.
   */
  supervisoryAuthority: {
    name: "Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)",
    lines: ["Promenade 18", "91522 Ansbach", "Germany"],
    phone: "+49 981 180093 0",
    url: "https://www.lda.bayern.de",
  },

  /** Emergency numbers referenced from the AI section of the Terms. */
  emergency: { medical: "112", police: "110" },
} as const;

/** Replaces {token} placeholders in translated legal copy. */
export function fillLegalTokens(text: string): string {
  return text
    .replace(/\{entity\}/g, LEGAL.entity)
    .replace(/\{operator\}/g, LEGAL.operator)
    .replace(/\{email\}/g, LEGAL.email)
    .replace(/\{site\}/g, LEGAL.site.replace(/^https?:\/\//, ""))
    .replace(/\{repo\}/g, LEGAL.repo.replace(/^https?:\/\//, ""));
}
