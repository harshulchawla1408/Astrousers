"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";

export default function WalletCard() {
  const { user, loading, refreshUser } = useUserContext();
  const router = useRouter();

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center text-gray-500">
          Please sign in to view your wallet
        </CardContent>
      </Card>
    );
  }

  const balance = user.wallet || 0;

  const status =
    balance < 50 ? "Low Balance" : balance < 100 ? "Medium Balance" : "Good Balance";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Wallet Balance
          <Badge
            variant={
              balance < 50 ? "destructive" : balance < 100 ? "secondary" : "default"
            }
          >
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-[#FFA726]">
            {balance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Coins Available</p>
        </div>

        {balance < 50 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            ⚠️ Low balance! Consider recharging.
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={refreshUser}>
            Refresh
          </Button>
          <Button className="flex-1" onClick={() => router.push("/wallet/recharge")}>
            Recharge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
