// lib/auth.ts — stub until Phase 2
export const auth = {
  handler: () => new Response('Auth not configured yet', { status: 501 }),
  api: {
    getSession: async () => null,
  },
};
