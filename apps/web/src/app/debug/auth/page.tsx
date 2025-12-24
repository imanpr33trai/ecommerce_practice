// app/debug/auth/page.tsx
"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/trpc/client";

export default function AuthDebugPage() {
  // const [clientSession, setClientSession] = useState<any>(null);

  // Try to call a protected endpoint
  const { data, error, isLoading } = useQuery(trpc.user.getCurrentUser.queryOptions());

  // Check session via better-auth client
  // useEffect(() => {
  //   async function checkSession() {
  //     try {
  //       const response = await fetch("http://localhost:3000/api/auth/get-session", {
  //         credentials: "include",
  //       });
  //       const session = await response.json();
  //       setClientSession(session);
  //     } catch (err) {
  //       console.error("Failed to get session:", err);
  //     }
  //   }
  //   checkSession();
  // }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-6">
        {/* Better Auth Session */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Better Auth Session</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>

        {/* tRPC Protected Call */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">tRPC Protected Call</h2>
          {isLoading && <p>Loading...</p>}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-semibold">Error:</p>
              <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
          {data && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
              <p className="font-semibold">Success! User data:</p>
              <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Cookie Info */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Browser Cookies</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{document.cookie || "No cookies found"}</pre>
        </div>

        {/* Instructions */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>✅ Check if Better Auth session exists</li>
            <li>✅ Check if cookies are set (look for better-auth cookies)</li>
            <li>✅ Check if tRPC protected call succeeds</li>
            <li>✅ Open browser DevTools → Network → Check cookies in request headers</li>
            <li>✅ Check API server logs for session info</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
