"use client";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function InsufficientBalanceModal({ 
  isOpen, 
  onClose, 
  requiredCoins, 
  currentBalance,
  onRecharge 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <CardTitle className="text-red-600">Insufficient Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              You need <span className="font-semibold text-red-600">{requiredCoins} coins</span> to start this session.
            </p>
            <p className="text-sm text-gray-500">
              Current balance: <span className="font-medium">{currentBalance} coins</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              💡 Tip: Recharge your wallet to continue consulting with astrologers
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={onRecharge} 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Recharge Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
