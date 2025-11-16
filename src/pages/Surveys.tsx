import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, CheckCircle2, Users, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Surveys = () => {
  const navigate = useNavigate();

  const [allSurveys, setAllSurveys] = useState([
    {
      id: "1",
      title: "课程满意度调查",
      course: "人工智能基础",
      deadline: "2024-01-25",
      questions: 12,
      participants: 45,
      status: "进行中",
      urgent: true,
      completed: false,
    },
    {
      id: "2",
      title: "教学质量反馈",
      course: "数据结构",
      deadline: "2024-01-28",
      questions: 8,
      participants: 32,
      status: "进行中",
      urgent: false,
      completed: false,
    },
    {
      id: "3",
      title: "学习体验问卷",
      course: "编程基础",
      deadline: "2024-02-01",
      questions: 10,
      participants: 28,
      status: "进行中",
      urgent: false,
      completed: false,
    },
    {
      id: "4",
      title: "期中课程评价",
      course: "人工智能基础",
      completedDate: "2024-01-10",
      questions: 15,
      participants: 58,
      completed: true,
    },
    {
      id: "5",
      title: "实验课程反馈",
      course: "算法设计",
      completedDate: "2024-01-05",
      questions: 10,
      participants: 42,
      completed: true,
    },
  ]);

  async function fetchSurveys() {
    // Fetch surveys from API if needed
    let res = await axios.post("/api/getallsurveys", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.surveys);
    let fetchedSurveys = [];
    for (let i = 0; i < res.data.surveys.length; i++) {
      let survey = res.data.surveys[i];
      fetchedSurveys.push({
        title: survey.name,
        course: survey.course_name,
        deadline: "2025-12-01",
        questions: "0",
        participants: "0",
        status: survey.status || "未完成",
        urgent: false,
        completed: false,
        id: survey.id,
        description: survey.description,
        course_id: survey.course_id,
        teacher_name: survey.teacher_name,
      })
    }
    setAllSurveys(fetchedSurveys);
  }

  useEffect(() => {
    fetchSurveys();
    // Fetch surveys from API if needed
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">在线问卷</h1>
        <p className="text-muted-foreground text-lg">参与问卷调查，分享您的意见和建议</p>
      </div>

      <div className="space-y-4">
        {allSurveys.map((survey, index) => (
          <Card 
            key={index} 
            className="border-border/50 hover:shadow-md transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-start gap-4 flex-1 cursor-pointer"
                  onClick={() => navigate(`/surveys/${survey.id}`, { state: survey })}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    survey.completed 
                      ? 'from-green-500 to-emerald-500' 
                      : survey.urgent 
                      ? 'from-orange-500 to-red-500' 
                      : 'from-primary to-accent'
                  } flex items-center justify-center flex-shrink-0`}>
                    {survey.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <ClipboardList className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{survey.title}</CardTitle>
                    {survey.completed ? (
                      <>
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
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {!survey.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/survey-editor/${survey.id}`, { state: survey });
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </Button>
                  )}
                  {survey.completed ? (
                    <Badge variant="secondary">已提交</Badge>
                  ) : (
                    <Badge variant={survey.urgent ? "destructive" : "secondary"}>
                      {survey.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {survey.completed ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/surveys/${survey.id}`, { state: survey });
                  }}
                >
                  查看问卷内容
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/surveys/${survey.id}`, { state: survey });
                    }}
                  >
                    填写问卷
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/surveys/${survey.id}`, { state: survey });
                    }}
                  >
                    查看详情
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Surveys;
