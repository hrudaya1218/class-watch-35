import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("data-structures");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  // Mock data
  const courses = [
    { id: "data-structures", name: "Data Structures" },
    { id: "web-dev", name: "Web Development" },
    { id: "databases", name: "Database Systems" },
  ];

  const students = [
    { id: "1", name: "John Doe", rollNo: "CS2021001", percentage: 85 },
    { id: "2", name: "Jane Smith", rollNo: "CS2021002", percentage: 72 },
    { id: "3", name: "Mike Johnson", rollNo: "CS2021003", percentage: 65 },
    { id: "4", name: "Sarah Williams", rollNo: "CS2021004", percentage: 90 },
    { id: "5", name: "Tom Brown", rollNo: "CS2021005", percentage: 68 },
  ];

  const stats = {
    totalClasses: 35,
    averageAttendance: 76,
    lowAttendanceCount: 2,
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const userEmail = localStorage.getItem("userEmail");
    
    if (role !== "faculty" || !userEmail) {
      navigate("/");
      return;
    }
    
    setEmail(userEmail);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAttendanceToggle = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmitAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    toast.success(`Attendance marked for ${presentCount} students`, {
      description: `Course: ${courses.find(c => c.id === selectedCourse)?.name}`,
    });
    setAttendance({});
  };

  const getPercentageBadge = (percentage: number) => {
    if (percentage >= 75) {
      return <Badge className="bg-success text-success-foreground">{percentage}%</Badge>;
    }
    if (percentage >= 60) {
      return <Badge className="bg-warning text-warning-foreground">{percentage}%</Badge>;
    }
    return <Badge variant="destructive">{percentage}%</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Faculty Dashboard</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalClasses}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.averageAttendance}%</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowAttendanceCount} Students</div>
            </CardContent>
          </Card>
        </div>

        {/* Mark Attendance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select course and mark present students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Present</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Current %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={attendance[student.id] || false}
                        onCheckedChange={() => handleAttendanceToggle(student.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{getPercentageBadge(student.percentage)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button onClick={handleSubmitAttendance} className="w-full">
              Submit Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Students with Low Attendance */}
        <Card className="border-2 border-warning/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Students with Low Attendance
            </CardTitle>
            <CardDescription>Students below 75% attendance threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.filter(s => s.percentage < 75).map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{getPercentageBadge(student.percentage)}</TableCell>
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

export default FacultyDashboard;
