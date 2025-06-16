"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from "lucide-react"

const thesisSteps = [
  { name: "Supervisor Selection", status: "completed" },
  { name: "Proposal Submission", status: "completed" },
  { name: "PGC Review", status: "completed" },
  { name: "CASR Review", status: "pending" },
  { name: "Thesis Submission", status: "pending" },
  { name: "Defence Scheduled", status: "pending" },
]

export default function ThesisPage() {
  const [proposalStatus, setProposalStatus] = useState("Submitted")

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Thesis</h1>

      <div className="space-y-8 max-w-4xl">
        {/* Thesis Actions */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Submit Thesis Proposal</span>
                <Button
                  variant={proposalStatus === "Submitted" ? "secondary" : "default"}
                  className={
                    proposalStatus === "Submitted"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-green-600 hover:bg-green-700"
                  }
                  disabled={proposalStatus === "Submitted"}
                >
                  {proposalStatus === "Submitted" ? "Submitted" : "Upload Document"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Submit Thesis</span>
                <Button className="bg-green-600 hover:bg-green-700">Upload Document</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Schedule Defense</span>
                <Button className="bg-green-600 hover:bg-green-700">Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thesis Status */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Thesis Status</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {thesisSteps.map((step, index) => (
                  <div key={step.name} className="flex flex-col items-center text-center">
                    <div className="flex items-center mb-2">
                      {step.status === "completed" ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <Circle className="h-8 w-8 text-slate-300" />
                      )}
                      {index < thesisSteps.length - 1 && <div className="w-16 h-0.5 bg-slate-300 ml-2" />}
                    </div>
                    <div className="text-sm font-medium text-slate-700">{step.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
