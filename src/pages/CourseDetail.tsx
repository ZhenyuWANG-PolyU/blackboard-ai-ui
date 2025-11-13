import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  HelpCircle,
  Download,
  Play,
  CheckCircle2,
  Clock,
  Calendar
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // 模拟课程数据
  const course = {
    id: courseId,
    title: "人工智能基础",
    instructor: "张教授",
    description: "本课程系统介绍人工智能的基本概念、核心算法和实际应用，包括机器学习、深度学习等前沿技术。",
    progress: 75,
    totalWeeks: 16,
    currentWeek: 12,
    students: 120,
    color: "from-blue-500 to-cyan-500",
  };

  // 每周课程内容
  const weeklyContent = [
    {
      week: 1,
      title: "人工智能概述",
      date: "2024-03-01",
      materials: [
        { id: 1, name: "第一章课件.pdf", type: "PDF", size: "2.3 MB", completed: true },
        { id: 2, name: "AI发展历史.pptx", type: "PPT", size: "5.1 MB", completed: true },
        { id: 3, name: "课程介绍视频.mp4", type: "视频", size: "120 MB", completed: true },
      ],
      assignments: [
        { id: 1, name: "第一周作业：AI概念理解", deadline: "2024-03-08", status: "已完成", score: 95 },
      ],
      quizzes: [
        { id: 1, name: "第一周测验", questions: 10, time: "30分钟", status: "已完成", score: 90 },
      ],
      surveys: [
        { id: 1, name: "课程满意度调查", status: "已完成" },
      ],
    },
    {
      week: 2,
      title: "机器学习基础",
      date: "2024-03-08",
      materials: [
        { id: 4, name: "机器学习导论.pdf", type: "PDF", size: "3.5 MB", completed: true },
        { id: 5, name: "监督学习算法.pptx", type: "PPT", size: "4.8 MB", completed: true },
        { id: 6, name: "Python基础回顾.ipynb", type: "Notebook", size: "1.2 MB", completed: true },
      ],
      assignments: [
        { id: 2, name: "第二周作业：线性回归实现", deadline: "2024-03-15", status: "已完成", score: 88 },
      ],
      quizzes: [
        { id: 2, name: "第二周测验", questions: 15, time: "40分钟", status: "已完成", score: 85 },
      ],
      surveys: [],
    },
    {
      week: 3,
      title: "神经网络入门",
      date: "2024-03-15",
      materials: [
        { id: 7, name: "神经网络基础.pdf", type: "PDF", size: "4.2 MB", completed: true },
        { id: 8, name: "感知机模型.pptx", type: "PPT", size: "3.9 MB", completed: false },
        { id: 9, name: "实验演示视频.mp4", type: "视频", size: "85 MB", completed: false },
      ],
      assignments: [
        { id: 3, name: "第三周作业：神经网络实现", deadline: "2024-03-22", status: "进行中", score: null },
      ],
      quizzes: [
        { id: 3, name: "第三周测验", questions: 12, time: "35分钟", status: "未开始", score: null },
      ],
      surveys: [],
    },
  ];

  const [selectedWeek, setSelectedWeek] = useState(1);
  const currentWeekContent = weeklyContent.find(w => w.week === selectedWeek);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-500";
      case "进行中":
        return "bg-orange-500";
      case "未开始":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮和课程标题 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-muted-foreground text-lg">授课教师：{course.instructor}</p>
        </div>
      </div>

      {/* 课程概览卡片 */}
      <Card className="border-border/50">
        <CardHeader>
          <div className={`w-full h-48 rounded-lg bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center`}>
            <BookOpen className="w-24 h-24 text-white" />
          </div>
          <CardTitle>课程简介</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{course.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.students}</div>
              <div className="text-sm text-muted-foreground">学生人数</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.totalWeeks}</div>
              <div className="text-sm text-muted-foreground">总周数</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.currentWeek}</div>
              <div className="text-sm text-muted-foreground">当前周</div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">课程进度</span>
              <span className="font-medium text-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* 周次选择 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>选择周次</CardTitle>
          <CardDescription>查看每周的学习内容</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {weeklyContent.map((week) => (
              <Button
                key={week.week}
                variant={selectedWeek === week.week ? "default" : "outline"}
                onClick={() => setSelectedWeek(week.week)}
                className={selectedWeek === week.week ? "bg-gradient-to-r from-primary to-accent" : ""}
              >
                第 {week.week} 周
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 周内容详情 */}
      {currentWeekContent && (
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">第 {currentWeekContent.week} 周：{currentWeekContent.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  {currentWeekContent.date}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                第 {currentWeekContent.week} 周
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="materials" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="materials">
                  <FileText className="w-4 h-4 mr-2" />
                  资料
                </TabsTrigger>
                <TabsTrigger value="assignments">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  作业
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  测验
                </TabsTrigger>
                <TabsTrigger value="surveys">
                  <BookOpen className="w-4 h-4 mr-2" />
                  问卷
                </TabsTrigger>
              </TabsList>

              {/* 学习资料 */}
              <TabsContent value="materials" className="space-y-4">
                {currentWeekContent.materials.length > 0 ? (
                  currentWeekContent.materials.map((material) => (
                    <Card key={material.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{material.name}</h4>
                                {material.completed && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <Badge variant="secondary">{material.type}</Badge>
                                <span>{material.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {material.type === "视频" ? (
                              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                                <Play className="w-4 h-4 mr-1" />
                                播放
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                下载
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无学习资料
                  </div>
                )}
              </TabsContent>

              {/* 作业 */}
              <TabsContent value="assignments" className="space-y-4">
                {currentWeekContent.assignments.length > 0 ? (
                  currentWeekContent.assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                              assignment.status === "已完成" ? "from-green-500/20 to-emerald-500/20" : "from-orange-500/20 to-red-500/20"
                            } flex items-center justify-center`}>
                              <ClipboardCheck className={`w-6 h-6 ${
                                assignment.status === "已完成" ? "text-green-600" : "text-orange-600"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{assignment.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>截止: {assignment.deadline}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(assignment.status)}`} />
                                <span>{assignment.status}</span>
                                {assignment.score !== null && (
                                  <span className="font-medium text-green-600">得分: {assignment.score}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={assignment.status === "已完成" ? "outline" : "default"}
                            className={assignment.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {assignment.status === "已完成" ? "查看详情" : "开始作业"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无作业
                  </div>
                )}
              </TabsContent>

              {/* 测验 */}
              <TabsContent value="quizzes" className="space-y-4">
                {currentWeekContent.quizzes.length > 0 ? (
                  currentWeekContent.quizzes.map((quiz) => (
                    <Card key={quiz.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                              quiz.status === "已完成" ? "from-purple-500/20 to-pink-500/20" : "from-blue-500/20 to-cyan-500/20"
                            } flex items-center justify-center`}>
                              <HelpCircle className={`w-6 h-6 ${
                                quiz.status === "已完成" ? "text-purple-600" : "text-blue-600"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{quiz.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{quiz.questions} 题</span>
                                <span>•</span>
                                <span>{quiz.time}</span>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(quiz.status)}`} />
                                <span>{quiz.status}</span>
                                {quiz.score !== null && (
                                  <span className="font-medium text-purple-600">得分: {quiz.score}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={quiz.status === "已完成" ? "outline" : "default"}
                            className={quiz.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {quiz.status === "已完成" ? "查看结果" : "开始测验"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无测验
                  </div>
                )}
              </TabsContent>

              {/* 问卷 */}
              <TabsContent value="surveys" className="space-y-4">
                {currentWeekContent.surveys.length > 0 ? (
                  currentWeekContent.surveys.map((survey) => (
                    <Card key={survey.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{survey.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(survey.status)}`} />
                                <span>{survey.status}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={survey.status === "已完成" ? "outline" : "default"}
                            className={survey.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {survey.status === "已完成" ? "查看问卷" : "填写问卷"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无问卷
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDetail;
