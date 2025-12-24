import { headers } from "next/headers";

import { auth } from "@ecomerceNextjs/auth";

import { getCaller } from "@/trpc/server";

export default async function AuthServerDebugPage() {
  // Check session on server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let trpcResult = null;
  let trpcError = null;

  // Try calling a protected tRPC endpoint
  try {
    const caller = await getCaller();
    trpcResult = await caller.user.getCurrentUser();
  } catch (err: any) {
    trpcError = err.message || String(err);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Server-Side Auth Debug</h1>

      <div className="space-y-6">
        {/* Server Session */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Server Session</h2>
          {session ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <p className="text-green-700 font-semibold mb-2">✅ Authenticated</p>
              <pre className="text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <p className="text-red-700 font-semibold">❌ Not authenticated</p>
            </div>
          )}
        </div>

        {/* tRPC Server Call */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">tRPC Server Call Result</h2>
          {trpcError ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <p className="text-red-700 font-semibold mb-2">Error:</p>
              <pre className="text-sm">{trpcError}</pre>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <p className="text-green-700 font-semibold mb-2">✅ Success</p>
              <pre className="text-sm overflow-auto">{JSON.stringify(trpcResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
