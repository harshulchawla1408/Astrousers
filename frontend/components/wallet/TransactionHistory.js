"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUserContext } from "@/contexts/UserContext";

const backend =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function TransactionHistory() {
  const { user, loading } = useUserContext();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const res = await fetch(
          `${backend}/api/payment/history?page=${page}&limit=10`,
          {
            headers: {
              "x-user-id": user.clerkId
            }
          }
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setTransactions(json.transactions || []);
        setTotalPages(json.totalPages || 1);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
  }, [user, page]);

  if (loading) return null;
  if (!user)
    return (
      <Card>
        <CardContent className="text-center text-gray-500">
          Please sign in
        </CardContent>
      </Card>
    );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>

      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found</p>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border p-4 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Badge
                    variant={t.type === "credit" ? "default" : "destructive"}
                  >
                    {t.type === "credit" ? "+" : "-"}
                    {t.amount}
                  </Badge>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
