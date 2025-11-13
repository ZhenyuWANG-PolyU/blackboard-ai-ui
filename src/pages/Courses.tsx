import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "人工智能基础",
      instructor: "张教授",
      progress: 75,
      students: 120,
      hours: "48小时",
      status: "进行中",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "数据结构与算法",
      instructor: "李教授",
      progress: 60,
      students: 95,
      hours: "40小时",
      status: "进行中",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "机器学习实战",
      instructor: "王教授",
      progress: 45,
      students: 80,
      hours: "56小时",
      status: "进行中",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      title: "深度学习进阶",
      instructor: "刘教授",
      progress: 30,
      students: 65,
      hours: "60小时",
      status: "进行中",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">我的课程</h1>
          <p className="text-muted-foreground text-lg">管理和学习您的课程</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          浏览更多课程
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center`}>
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                  <CardDescription>授课教师: {course.instructor}</CardDescription>
                </div>
                <Badge variant="secondary">{course.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">学习进度</span>
                  <span className="font-medium text-foreground">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} 学生</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.hours}</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                继续学习
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
