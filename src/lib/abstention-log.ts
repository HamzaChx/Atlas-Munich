// ============================================
// Atlas Munich – abstention logging
//
// Silent, metadata-only signal for spotting content gaps: which persona,
// whether a guide/FAQ matched, when. Never the query or answer text itself —
// see the privacy policy's data-processing disclosure for why.
// ============================================

export function logAbstention(event: { persona: string; matchedGuide: boolean }): void {
  console.log(
    JSON.stringify({ type: "chat_abstention", ...event, timestamp: new Date().toISOString() })
  );
}
