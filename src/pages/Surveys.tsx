import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClipboardList, Clock, CheckCircle2, Users, Edit, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Surveys = () => {
  const navigate = useNavigate();

  const [allSurveys, setAllSurveys] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [analyzingSurveyId, setAnalyzingSurveyId] = useState<string | null>(null);

  async function fetchSurveys() {
    let res6 = await axios.post("/api/select_activity_date_by_user_id", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    // console.log(res6.data.activity_finish_times);
    let finishTimes = res6.data.activity_finish_times;


    let res5 = await axios.post("/api/get_all_time_group_by_activity_id", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    let activityTimes = res5.data.activity_times;
    // console.log(res5.data.activity_times);

    let res4 = await axios.post("/api/getcountsubmitsurveybyuserid", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    // console.log(res4.data.survey_submit_counts_by_user);
    let userSubmitCounts = res4.data.survey_counts;

    let res3 = await axios.post("/api/getcountofsubmitsurvey", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    // console.log(res3.data.survey_counts);
    let surveyCounts = res3.data.survey_counts;

    let res2 = await axios.post("/api/count_survey_q_by_suvery_id", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    let numbers = res2.data.survey_question_counts;
    // Fetch surveys from API if needed
    let res = await axios.post("/api/getallsurveys", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.surveys);
    let fetchedSurveys = [];
    for (let i = 0; i < res.data.surveys.length; i++) {
      let survey = res.data.surveys[i];

      // 从数组中找到对应的提交计数
      let submitCountObj = surveyCounts.find((s: any) => s.survey_id === survey.id);
      let participantCount = submitCountObj ? submitCountObj.submit_count : 0;

      // 从用户提交计数中找到对应的记录
      let userSubmitObj = userSubmitCounts.find((s: any) => s.survey_id === survey.id);
      let userSubmitCount = userSubmitObj ? userSubmitObj.submit_count : 0;
      let isCompleted = userSubmitCount > 0;

      // 从活动时间中找到对应的记录
      let activityTimeObj = activityTimes.find((a: any) => a.activity_id === survey.id);
      let startDate = activityTimeObj ? String(activityTimeObj.start_time).split(' ')[0] : "";
      let endDate = activityTimeObj ? String(activityTimeObj.end_time).split(' ')[0] : "";

      // 计算是否紧急：截止日期距离今天小于5天或已超时
      let isUrgent = false;
      if (endDate) {
        const today = new Date();
        const deadline = new Date(endDate);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isUrgent = diffDays <= 5;
      }

      // 从完成时间数组中找到对应的记录
      let finishTimeObj = finishTimes.find((f: any) => f.activity_id === survey.id);
      let completedDate = finishTimeObj ? finishTimeObj.finish_time : "";

      fetchedSurveys.push({
        title: survey.name,
        course: survey.course_name,
        start_date: startDate,
        deadline: endDate,
        questions: (numbers[survey.id] || 0).toString(),
        participants: participantCount.toString(),
        status: survey.status || "已完成",
        urgent: isUrgent,
        completed: isCompleted,
        completedDate: completedDate,
        id: survey.id,
        description: survey.description,
        course_id: survey.course_id,
        teacher_name: survey.teacher_name,
      })
    }
    setAllSurveys(fetchedSurveys);
  }

  async function ai_analysis(surveyId: string) {
    setAnalyzingSurveyId(surveyId);
    try {
      let res = await axios.post("/api/getsubmitsurveybysurveyid", {
        survey_id: surveyId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log("AI分析结果:", res.data.analysis.analysis);
      setAnalysisResult(res.data.analysis.analysis);
      setIsAnalysisDialogOpen(true);
    } catch (error) {
      console.error("AI分析失败:", error);
      setAnalysisResult("分析失败，请稍后重试");
      setIsAnalysisDialogOpen(true);
    } finally {
      setAnalyzingSurveyId(null);
    }
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
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${survey.completed
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
                        </CardDescription><CardDescription className="flex items-center gap-2 text-sm mt-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            开始: {survey.start_date}
                          </span>
                          <span>•</span>
                          <span className={survey.urgent ? 'text-destructive font-medium' : ''}>
                            截止: {survey.deadline}
                          </span>
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
                          <span>
                            开始: {survey.start_date}
                          </span>
                          <span>•</span>
                          <span className={survey.urgent ? 'text-destructive font-medium' : ''}>
                            截止: {survey.deadline}
                          </span>
                        </CardDescription>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {(
                    <>
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
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={analyzingSurveyId === survey.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          ai_analysis(survey.id);
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {analyzingSurveyId === survey.id ? "分析中..." : "AI分析"}
                      </Button>
                    </>
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
                <div className="flex gap-2">
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

      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI 分析结果</DialogTitle>
            <DialogDescription>
              基于问卷提交数据的智能分析
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{analysisResult}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Surveys;
