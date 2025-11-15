import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ClipboardList, CheckCircle2, Users, Calendar } from "lucide-react";

type QuestionType = "single" | "multiple" | "text" | "rating";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
}

const SurveyDetail = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const survey = {
    id: surveyId,
    title: "课程满意度调查",
    course: "人工智能基础",
    description: "请您抽出几分钟时间填写本问卷，您的反馈对我们改进教学质量非常重要。",
    deadline: "2024-01-25",
    participants: 45,
    totalQuestions: 8,
    questions: [
      {
        id: 1,
        type: "single" as QuestionType,
        question: "您对本课程的整体满意度如何？",
        required: true,
        options: ["非常满意", "满意", "一般", "不满意", "非常不满意"],
      },
      {
        id: 2,
        type: "single" as QuestionType,
        question: "教师的教学方式是否清晰易懂？",
        required: true,
        options: ["非常清晰", "比较清晰", "一般", "不太清晰", "很难理解"],
      },
      {
        id: 3,
        type: "multiple" as QuestionType,
        question: "您认为课程中哪些内容最有帮助？（可多选）",
        required: true,
        options: ["理论讲解", "实践案例", "课后作业", "在线测验", "讨论互动"],
      },
      {
        id: 4,
        type: "rating" as QuestionType,
        question: "请为课程内容的难度打分（1-5分，5分最难）",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
      {
        id: 5,
        type: "single" as QuestionType,
        question: "您是否会向他人推荐这门课程？",
        required: true,
        options: ["非常愿意", "愿意", "不确定", "不愿意", "非常不愿意"],
      },
      {
        id: 6,
        type: "multiple" as QuestionType,
        question: "您希望课程增加哪些内容？（可多选）",
        required: false,
        options: ["更多实践项目", "更多理论深度", "行业应用案例", "前沿技术介绍", "其他"],
      },
      {
        id: 7,
        type: "text" as QuestionType,
        question: "您对课程有什么建议或意见？",
        required: false,
      },
      {
        id: 8,
        type: "text" as QuestionType,
        question: "您最喜欢课程的哪个部分？为什么？",
        required: false,
      },
    ] as Question[],
  };

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

  const handleSubmit = () => {
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
                <div className="text-2xl font-bold text-foreground">{survey.participants + 1}</div>
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
