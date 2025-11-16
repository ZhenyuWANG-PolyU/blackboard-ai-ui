import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ClipboardList, CheckCircle2, Users, Calendar } from "lucide-react";
import axios from "axios";
import { set } from "date-fns";

type QuestionType = "single" | "multiple" | "text" | "rating";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
  uuid?: string;
}

const SurveyDetail = () => {
  const { surveyId } = useParams();
  const location = useLocation();
  const surveyData = location.state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [survey, setSurvey] = useState({
    id: surveyData.id,
    title: surveyData.title,
    course: surveyData.course,
    description: surveyData.description,
    deadline: surveyData.deadline,
    participants: surveyData.participants,
    totalQuestions: 0,
    questions: [
      {
        id: 1,
        type: "single" as QuestionType,
        question: "您对本课程的整体满意度如何？",
        required: true,
        options: ["非常满意", "满意", "一般", "不满意", "非常不满意"],
      },
    ] as Question[],
  });

  async function fetchSurveyData() {
    let res = await axios.post("/api/get_suvery_q_by_suvery_id", {
      survey_id: surveyData.id
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log("fetchSurveyData response:", res.data);
    if (res.data.code === 20000 || res.data.code === "20000") {
      let qs = [];
      let num = 0;
      for (let i = 0; i < res.data.suverys.length; i++) {
        let q = res.data.suverys[i];
        qs.push({
          id: (num++).toString(),
          type: "single",
          question: q.q_question,
          required: true,
          options: q.q_options,
          uuid: q.uuid,
        });
      }
      console.log("Setting questions:", qs);
      
      setSurvey(prev => ({
        ...prev,
        questions: qs,
        totalQuestions: qs.length
      }));
    } else {
      console.error("API返回code不是20000:", res.data.code);
    }
  }

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const handleSingleChoice = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleMultipleChoice = (option: string, checked: boolean) => {
    const currentAnswers = (answers[currentQuestion] as string[]) || [];
    if (checked) {
      setAnswers({
        ...answers,
        [currentQuestion]: [...currentAnswers, option],
      });
    } else {
      setAnswers({
        ...answers,
        [currentQuestion]: currentAnswers.filter((a) => a !== option),
      });
    }
  };

  const handleTextAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleNext = () => {
    const currentQ = survey.questions[currentQuestion];
    if (currentQ.required && !answers[currentQuestion]) {
      toast({
        title: "提示",
        description: "此题为必答题，请完成后继续",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < survey.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  async function handleSubmit() {
    
    const requiredQuestions = survey.questions.filter((q) => q.required);
    const answeredRequired = requiredQuestions.every((q) => {
      const index = survey.questions.indexOf(q);
      return answers[index] !== undefined && answers[index] !== "";
    });

    if (!answeredRequired) {
      toast({
        title: "提示",
        description: "请完成所有必答题后再提交",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      user_id: localStorage.getItem("user_id"),
      survey_id: survey.id,
      survey_title: survey.title,
      course: survey.course,
      total_questions: survey.totalQuestions.toString(),
      answered_count: Object.keys(answers).length.toString(),
      questions_and_answers: survey.questions.map((q, index) => ({
        // question_id: q.id,
        question_text: q.question,
        // question_type: q.type,
        // required: q.required,
        // uuid: q.uuid || null,
        answer: answers[index] || null
      })),
      // raw_answers: answers
    };

    let res = await axios.post("/api/insertsubmitsurvey", submissionData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    console.log("问卷填写信息:", submissionData);

    setIsSubmitted(true);
    toast({
      title: "提交成功",
      description: "感谢您的参与！",
    });
  };

  const progress = ((currentQuestion + 1) / survey.totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/surveys")}
        >
          <ArrowLeft className="w-4 h-4" />
          返回问卷列表
        </Button>

        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">提交成功</h1>
          <p className="text-muted-foreground text-lg">感谢您的参与和宝贵意见！</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            <CardDescription>{survey.course}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-6xl">✓</div>
              <p className="text-muted-foreground">
                您的反馈已成功提交，我们会认真对待每一条意见，持续改进教学质量。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{answeredCount}</div>
                <div className="text-sm text-muted-foreground">已回答问题</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{parseInt(survey.participants) + 1}</div>
                <div className="text-sm text-muted-foreground">总参与人数</div>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={() => navigate("/surveys")}
            >
              返回问卷列表
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = survey.questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => navigate("/surveys")}
      >
        <ArrowLeft className="w-4 h-4" />
        返回问卷列表
      </Button>

      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{survey.title}</h1>
        <p className="text-muted-foreground text-lg">{survey.course}</p>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">{survey.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  问题 {currentQuestion + 1}/{survey.totalQuestions}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  已答 {answeredCount}/{survey.totalQuestions}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{survey.participants}人已参与</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">截止: {survey.deadline}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            问题 {currentQuestion + 1}
            {currentQ.required && <span className="text-destructive text-base">*</span>}
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            {currentQ.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.type === "single" && (
            <RadioGroup
              value={answers[currentQuestion] as string}
              onValueChange={handleSingleChoice}
            >
              {currentQ.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === "multiple" && (
            <div className="space-y-2">
              {currentQ.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={((answers[currentQuestion] as string[]) || []).includes(option)}
                    onCheckedChange={(checked) => handleMultipleChoice(option, checked as boolean)}
                  />
                  <Label
                    htmlFor={`checkbox-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentQ.type === "rating" && (
            <div className="flex justify-center gap-4">
              {currentQ.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={(answers[currentQuestion] as string) === option ? "default" : "outline"}
                  className="w-16 h-16 text-xl font-bold"
                  onClick={() => handleSingleChoice(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentQ.type === "text" && (
            <Textarea
              placeholder="请输入您的答案..."
              value={(answers[currentQuestion] as string) || ""}
              onChange={(e) => handleTextAnswer(e.target.value)}
              className="min-h-32"
            />
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              上一题
            </Button>
            {currentQuestion < survey.totalQuestions - 1 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                下一题
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                提交问卷
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>填写进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {survey.questions.map((q, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestion
                    ? "default"
                    : answers[index] !== undefined
                      ? "secondary"
                      : "outline"
                }
                className="h-12 relative"
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
                {q.required && (
                  <span className="absolute top-1 right-1 text-destructive text-xs">*</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDetail;
