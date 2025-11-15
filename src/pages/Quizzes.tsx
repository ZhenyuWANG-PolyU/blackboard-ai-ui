import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, CheckCircle2, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Quizzes = () => {
  const navigate = useNavigate();

  const availableQuizzes = [
    {
      title: "机器学习算法测试",
      course: "人工智能基础",
      duration: "60分钟",
      questions: 20,
      deadline: "2024-01-22",
      status: "未开始",
      urgent: true,
    },
    {
      title: "数据结构知识测验",
      course: "数据结构",
      duration: "45分钟",
      questions: 15,
      deadline: "2024-01-25",
      status: "未开始",
      urgent: false,
    },
    {
      title: "Python基础测试",
      course: "编程基础",
      duration: "30分钟",
      questions: 10,
      deadline: "2024-01-28",
      status: "未开始",
      urgent: false,
    },
  ];

  const completedQuizzes = [
    {
      title: "线性回归理论测试",
      course: "人工智能基础",
      completedDate: "2024-01-12",
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18,
    },
    {
      title: "排序算法测验",
      course: "算法设计",
      completedDate: "2024-01-09",
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">在线测验</h1>
        <p className="text-muted-foreground text-lg">参加在线测验并查看测试结果</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available">待参加</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableQuizzes.map((quiz, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/quizzes/${index + 1}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                      quiz.urgent ? 'from-red-500 to-orange-500' : 'from-primary to-accent'
                    } flex items-center justify-center flex-shrink-0`}>
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{quiz.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                        <span>{quiz.course}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          <span>{quiz.duration}</span>
                        </div>
                        <span>•</span>
                        <span>{quiz.questions}题</span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1">
                        <Clock className="w-3 h-3" />
                        <span className={quiz.urgent ? 'text-destructive font-medium' : ''}>
                          截止: {quiz.deadline}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={quiz.urgent ? "destructive" : "secondary"}>
                    {quiz.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quizzes/${index + 1}`);
                    }}
                  >
                    开始测验
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quizzes/${index + 1}`);
                    }}
                  >
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuizzes.map((quiz, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/quizzes/${availableQuizzes.length + index + 1}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{quiz.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <span>{quiz.course}</span>
                        <span>•</span>
                        <span>完成于: {quiz.completedDate}</span>
                      </CardDescription>
                      <CardDescription className="text-sm mt-1">
                        正确率: {quiz.correctAnswers}/{quiz.totalQuestions} 题
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{quiz.score}</div>
                    <div className="text-xs text-muted-foreground">分数</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quizzes/${availableQuizzes.length + index + 1}`);
                  }}
                >
                  查看测验详情
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Quizzes;
