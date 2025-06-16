"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Users, CheckCircle, Clock, AlertTriangle, User, Eye, ThumbsUp, ThumbsDown } from "lucide-react"

export default function PGCDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const pendingProposals = [
    {
      id: "1",
      student: "John Doe",
      title: "Machine Learning Applications in Healthcare",
      supervisor: "Dr. Sarah Ahmed",
      submitted: "2024-03-01",
      department: "CSE",
      status: "Under Review",
    },
    {
      id: "2",
      student: "Alice Brown",
      title: "Sustainable Energy Systems Design",
      supervisor: "Dr. Michael Chen",
      submitted: "2024-02-28",
      department: "EEE",
      status: "Pending Review",
    },
    {
      id: "3",
      student: "Bob Wilson",
      title: "Advanced Materials for Construction",
      supervisor: "Dr. Lisa Johnson",
      submitted: "2024-02-25",
      department: "CE",
      status: "Revision Required",
    },
  ]

  const recentDecisions = [
    {
      student: "Emma Davis",
      title: "AI-Powered Traffic Management",
      decision: "Approved",
      date: "2024-02-20",
      nextStep: "CASR Review",
    },
    {
      student: "Tom Anderson",
      title: "Renewable Energy Integration",
      decision: "Approved with Conditions",
      date: "2024-02-18",
      nextStep: "Revision Submission",
    },
    {
      student: "Sarah Wilson",
      title: "Smart Building Systems",
      decision: "Rejected",
      date: "2024-02-15",
      nextStep: "Major Revision Required",
    },
  ]

  const committeeMeetings = [
    {
      date: "2024-03-20",
      time: "10:00 AM",
      agenda: "Monthly Proposal Review",
      proposals: 5,
      status: "Scheduled",
    },
    {
      date: "2024-03-15",
      time: "2:00 PM",
      agenda: "Defense Committee Formation",
      proposals: 2,
      status: "Completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PGC Dashboard</h1>
              <p className="text-gray-600">Postgraduate Committee Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">PGC Member</Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">3 urgent, 5 normal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">Across all departments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">85% approval rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue Reviews</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Committee Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Proposal approved and forwarded to CASR</p>
                      <p className="text-sm text-gray-600">Emma Davis - AI-Powered Traffic Management - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">New proposal received for review</p>
                      <p className="text-sm text-gray-600">John Doe - Machine Learning in Healthcare - 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Committee meeting scheduled</p>
                      <p className="text-sm text-gray-600">Monthly review meeting - March 20, 2024 - 2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Proposal Reviews</CardTitle>
                <CardDescription>Thesis proposals awaiting PGC review and decision</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">{proposal.student}</TableCell>
                        <TableCell className="max-w-xs truncate">{proposal.title}</TableCell>
                        <TableCell>{proposal.supervisor}</TableCell>
                        <TableCell>{proposal.department}</TableCell>
                        <TableCell>{proposal.submitted}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              proposal.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : proposal.status === "Pending Review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {proposal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Decisions</CardTitle>
                <CardDescription>Recently reviewed proposals and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDecisions.map((decision, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            decision.decision === "Approved"
                              ? "bg-green-100"
                              : decision.decision === "Approved with Conditions"
                                ? "bg-yellow-100"
                                : "bg-red-100"
                          }`}
                        >
                          {decision.decision === "Approved" ? (
                            <ThumbsUp className="h-3 w-3 text-green-600" />
                          ) : decision.decision === "Approved with Conditions" ? (
                            <Clock className="h-3 w-3 text-yellow-600" />
                          ) : (
                            <ThumbsDown className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{decision.student}</h4>
                          <p className="text-sm text-gray-600 max-w-md truncate">{decision.title}</p>
                          <p className="text-xs text-gray-500">Decision made: {decision.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            decision.decision === "Approved"
                              ? "bg-green-100 text-green-800"
                              : decision.decision === "Approved with Conditions"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {decision.decision}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{decision.nextStep}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Committee Meetings</CardTitle>
                <CardDescription>Scheduled and past PGC meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {committeeMeetings.map((meeting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            meeting.status === "Scheduled" ? "bg-blue-100" : "bg-green-100"
                          }`}
                        >
                          <FileText
                            className={`h-5 w-5 ${meeting.status === "Scheduled" ? "text-blue-600" : "text-green-600"}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{meeting.agenda}</h4>
                          <p className="text-sm text-gray-600">
                            {meeting.date} at {meeting.time}
                          </p>
                          <p className="text-xs text-gray-500">{meeting.proposals} proposals to review</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={
                            meeting.status === "Scheduled" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }
                        >
                          {meeting.status}
                        </Badge>
                        {meeting.status === "Scheduled" && <Button size="sm">Join Meeting</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule New Meeting</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Schedule Committee Meeting
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
