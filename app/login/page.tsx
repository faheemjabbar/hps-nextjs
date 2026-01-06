// pages/horizontalSplit.tsx
import React from "react"

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top half - blue */}
      <div className="h-1/2 bg-blue-500 flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">Top Half (Blue)</h1>
      </div>

      {/* Bottom half - white */}
      <div className="h-1/2 bg-white flex items-center justify-center">
        <h1 className="text-black text-3xl font-bold">Bottom Half (White)</h1>
      </div>
    </div>
  )
}
