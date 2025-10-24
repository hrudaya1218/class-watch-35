import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  
  // Mock data - replace with actual API calls
  const attendanceData = {
    overall: 78,
    courses: [
      { name: "Data Structures", present: 28, total: 35, percentage: 80 },
      { name: "Web Development", present: 25, total: 30, percentage: 83 },
      { name: "Database Systems", present: 20, total: 32, percentage: 63 },
      { name: "Operating Systems", present: 22, total: 28, percentage: 79 },
    ],
    recentRecords: [
      { date: "2025-10-20", course: "Data Structures", status: "present" },
      { date: "2025-10-19", course: "Web Development", status: "present" },
      { date: "2025-10-18", course: "Database Systems", status: "absent" },
      { date: "2025-10-17", course: "Operating Systems", status: "present" },
      { date: "2025-10-16", course: "Data Structures", status: "absent" },
    ],
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");
    
    if (role !== "student" || !userEmail) {
      navigate("/");
      return;
    }
    
    setEmail(userEmail);

    // Check for low attendance
    const lowCourses = attendanceData.courses.filter(c => c.percentage < 75);
    if (lowCourses.length > 0) {
      toast.warning(
        `Low Attendance Alert! ${lowCourses.length} course(s) below 75%`,
        {
          description: lowCourses.map(c => c.name).join(", "),
          duration: 10000,
        }
      );
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    if (status === "present") {
      return <Badge className="bg-success text-success-foreground">Present</Badge>;
    }
    return <Badge variant="destructive">Absent</Badge>;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Overall Attendance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
            <CardDescription>Your attendance across all courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">{attendanceData.overall}%</span>
              {attendanceData.overall >= 75 ? (
                <CheckCircle className="h-8 w-8 text-success" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning" />
              )}
            </div>
            <Progress value={attendanceData.overall} className="h-3" />
            {attendanceData.overall < 75 && (
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span>Your attendance is below the required 75%</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course-wise Attendance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Course-wise Attendance</CardTitle>
            <CardDescription>Detailed breakdown by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.courses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.name}</span>
                    <span className={`font-bold ${getPercentageColor(course.percentage)}`}>
                      {course.percentage}%
                    </span>
                  </div>
                  <Progress value={course.percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {course.present} present out of {course.total} classes
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance Records */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your last 5 attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.recentRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
