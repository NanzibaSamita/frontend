"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const courses = [
  {
    code: "CSE5040",
    title: "Advanced Algorithms",
    credits: 3,
    status: "available",
  },
  {
    code: "MATH4041",
    title: "Numerical Method",
    credits: 3,
    status: "enrolled",
  },
  {
    code: "CSE4011",
    title: "Machine Learning",
    credits: 3,
    status: "available",
  },
  {
    code: "PHY4031",
    title: "Quantum Mechanics",
    credits: 4,
    status: "available",
  },
  {
    code: "PHY4031",
    title: "Software Requirements & System",
    credits: 2,
    status: "available",
  },
]

export default function CoursesPage() {
  const [courseList, setCourseList] = useState(courses)

  const handleEnroll = (courseCode) => {
    setCourseList((prev) =>
      prev.map((course) => (course.code === courseCode ? { ...course, status: "enrolled" } : course)),
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Courses</h1>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle>Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseList.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    {course.status === "enrolled" ? (
                      <span className="text-slate-600">Enrolled</span>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleEnroll(course.code)}
                      >
                        Enroll
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
