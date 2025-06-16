"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supervisors = [
  "Aashanan Rahman - Junior Lecturer",
  "Maliha Nousin Raida - Lecturer",
  "Abu Raihan Mostofa Kamal - Professor",
  "Dr. Md. Azam Hossain - Associate Professor",
]

export default function SupervisorPage() {
  const [selectedSupervisor, setSelectedSupervisor] = useState("")
  const [supervisorStatus, setSupervisorStatus] = useState("Not Selected")

  const handleSelectSupervisor = () => {
    if (selectedSupervisor) {
      setSupervisorStatus("Selected")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Supervisor</h1>

      <div className="space-y-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Select Supervisor</span>
              <div className="flex items-center gap-4">
                <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map((supervisor, index) => (
                      <SelectItem key={index} value={supervisor}>
                        {supervisor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSelectSupervisor}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedSupervisor}
                >
                  Select
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Supervisor Status</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {supervisorStatus === "Selected" ? "Selected" : "Not Selected"}
                </span>
                {supervisorStatus === "Selected" && <span className="text-slate-800">Maliha Noushin Raida</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
