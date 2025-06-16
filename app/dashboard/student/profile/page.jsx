import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Profile</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Full Name:</span>
                <span className="text-slate-800">Sadika Tabassum</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Student ID:</span>
                <span className="text-slate-800">220042147</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Email Address:</span>
                <span className="text-slate-800">sadikatabassum@iut-dhaka.edu</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Department:</span>
                <span className="text-slate-800">Computer Science and Engineering</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Program:</span>
                <span className="text-slate-800">MSc in CSE</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="font-medium text-slate-600">Current AY:</span>
                <span className="text-slate-800">2025-2026</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button className="bg-green-600 hover:bg-green-700 px-8">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

