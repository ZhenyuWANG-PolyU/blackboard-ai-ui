import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Brain, Timer, Award } from "lucide-react";

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 模拟测验数据
  const quiz = {
    id: quizId,
    title: "机器学习算法测试",
    course: "人工智能基础",
    duration: "60分钟",
    totalQuestions: 5,
    passingScore: 60,
    questions: [
      {
        id: 1,
        question: "什么是监督学习？",
        options: [
          "使用标记数据进行训练的学习方法",
          "不使用标记数据的学习方法",
          "强化学习的一种形式",
          "深度学习的特殊情况"
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "以下哪个不是常见的机器学习算法？",
        options: [
          "决策树",
          "支持向量机",
          "快速排序",
          "随机森林"
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "什么是过拟合？",
        options: [
          "模型在训练集上表现很好，但在测试集上表现很差",
          "模型在训练集和测试集上都表现很差",
          "模型训练时间过长",
          "模型参数过多"
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "神经网络中的激活函数有什么作用？",
        options: [
          "加速训练过程",
          "引入非线性",
          "减少参数数量",
          "防止过拟合"
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "什么是交叉验证？",
        options: [
          "一种数据预处理方法",
          "一种特征选择方法",
          "一种模型评估方法",
          "一种优化算法"
        ],
        correctAnswer: 2,
      },
    ],
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < quiz.totalQuestions) {
      toast({
        title: "提示",
        description: "请完成所有题目后再提交",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "提交成功",
      description: "您的测验已成功提交",
    });
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (parseInt(answers[index]) === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.totalQuestions) * 100);
  };

  const getCorrectCount = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (parseInt(answers[index]) === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const progress = ((currentQuestion + 1) / quiz.totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  if (isSubmitted) {
    const score = calculateScore();
    const correctCount = getCorrectCount();
    const isPassed = score >= quiz.passingScore;

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/quizzes")}
        >
          <ArrowLeft className="w-4 h-4" />
          返回测验列表
        </Button>

        <div className="text-center space-y-4">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${
            isPassed ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'
          } flex items-center justify-center`}>
            {isPassed ? (
              <Award className="w-12 h-12 text-white" />
            ) : (
              <AlertCircle className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-foreground">测验结果</h1>
          <p className="text-muted-foreground text-lg">{quiz.title}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-primary">{score}</CardTitle>
            <CardDescription className="text-lg">分数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{correctCount}</div>
                <div className="text-sm text-muted-foreground">答对题数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{quiz.totalQuestions - correctCount}</div>
                <div className="text-sm text-muted-foreground">答错题数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{quiz.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">总题数</div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Badge variant={isPassed ? "default" : "destructive"} className="text-lg px-4 py-2">
                {isPassed ? "通过测验" : "未通过测验"}
              </Badge>
              {!isPassed && (
                <p className="text-sm text-muted-foreground">
                  及格分数: {quiz.passingScore}分
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/quizzes")}
              >
                返回列表
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
              >
                重新测验
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => navigate("/quizzes")}
      >
        <ArrowLeft className="w-4 h-4" />
        返回测验列表
      </Button>

      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground text-lg">{quiz.course}</p>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  题目 {currentQuestion + 1}/{quiz.totalQuestions}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  已答 {answeredCount}/{quiz.totalQuestions}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{quiz.duration}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            题目 {currentQuestion + 1}
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            {currentQ.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[currentQuestion]}
            onValueChange={handleAnswerChange}
          >
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              上一题
            </Button>
            {currentQuestion < quiz.totalQuestions - 1 ? (
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
                提交测验
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>答题进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestion
                    ? "default"
                    : answers[index] !== undefined
                    ? "secondary"
                    : "outline"
                }
                className="h-12"
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizDetail;
