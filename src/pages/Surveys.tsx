import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, CheckCircle2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Surveys = () => {
  const navigate = useNavigate();

  const availableSurveys = [
    {
      title: "课程满意度调查",
      course: "人工智能基础",
      deadline: "2024-01-25",
      questions: 12,
      participants: 45,
      status: "进行中",
      urgent: true,
    },
    {
      title: "教学质量反馈",
      course: "数据结构",
      deadline: "2024-01-28",
      questions: 8,
      participants: 32,
      status: "进行中",
      urgent: false,
    },
    {
      title: "学习体验问卷",
      course: "编程基础",
      deadline: "2024-02-01",
      questions: 10,
      participants: 28,
      status: "进行中",
      urgent: false,
    },
  ];

  const completedSurveys = [
    {
      title: "期中课程评价",
      course: "人工智能基础",
      completedDate: "2024-01-10",
      questions: 15,
      participants: 58,
    },
    {
      title: "实验课程反馈",
      course: "算法设计",
      completedDate: "2024-01-05",
      questions: 10,
      participants: 42,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">在线问卷</h1>
        <p className="text-muted-foreground text-lg">参与问卷调查，分享您的意见和建议</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available">待填写</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableSurveys.map((survey, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/surveys/${index + 1}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                      survey.urgent ? 'from-orange-500 to-red-500' : 'from-primary to-accent'
                    } flex items-center justify-center flex-shrink-0`}>
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{survey.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                        <span>{survey.course}</span>
                        <span>•</span>
                        <span>{survey.questions}个问题</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{survey.participants}人已参与</span>
                        </div>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1">
                        <Clock className="w-3 h-3" />
                        <span className={survey.urgent ? 'text-destructive font-medium' : ''}>
                          截止: {survey.deadline}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={survey.urgent ? "destructive" : "secondary"}>
                    {survey.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/surveys/${index + 1}`);
                    }}
                  >
                    填写问卷
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/surveys/${index + 1}`);
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
          {completedSurveys.map((survey, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/surveys/${availableSurveys.length + index + 1}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{survey.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <span>{survey.course}</span>
                        <span>•</span>
                        <span>完成于: {survey.completedDate}</span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-sm mt-1">
                        <Users className="w-3 h-3" />
                        <span>{survey.participants}人参与</span>
                        <span>•</span>
                        <span>{survey.questions}个问题</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary">已提交</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/surveys/${availableSurveys.length + index + 1}`);
                  }}
                >
                  查看问卷内容
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Surveys;
