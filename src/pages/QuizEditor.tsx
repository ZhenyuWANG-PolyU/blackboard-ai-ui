import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: "single" | "multiple";
}

const QuizEditor = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { toast } = useToast();

  const [quizTitle, setQuizTitle] = useState("机器学习算法测试");
  const [quizCourse, setQuizCourse] = useState("人工智能基础");
  const [quizDuration, setQuizDuration] = useState("60");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      question: "什么是监督学习？",
      options: ["使用标记数据进行训练的学习方法", "不使用标记数据的学习方法", "强化学习的一种形式", "深度学习的特殊情况"],
      correctAnswer: 0,
      type: "single"
    }
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["选项A", "选项B", "选项C", "选项D"],
      correctAnswer: 0,
      type: "single"
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, `选项${String.fromCharCode(65 + q.options.length)}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { 
          ...q, 
          options: newOptions,
          correctAnswer: q.correctAnswer >= optionIndex && q.correctAnswer > 0 ? q.correctAnswer - 1 : q.correctAnswer
        };
      }
      return q;
    }));
  };

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      toast({
        title: "无法删除",
        description: "至少需要保留一道题目",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    // 验证所有题目是否填写完整
    const hasEmptyQuestion = questions.some(q => !q.question.trim());
    const hasEmptyOption = questions.some(q => q.options.some(opt => !opt.trim()));

    if (!quizTitle.trim()) {
      toast({
        title: "保存失败",
        description: "请填写测验标题",
        variant: "destructive"
      });
      return;
    }

    if (hasEmptyQuestion) {
      toast({
        title: "保存失败",
        description: "请完善所有题目内容",
        variant: "destructive"
      });
      return;
    }

    if (hasEmptyOption) {
      toast({
        title: "保存失败",
        description: "请完善所有选项内容",
        variant: "destructive"
      });
      return;
    }

    // TODO: 调用API保存数据
    toast({
      title: "保存成功",
      description: "测验已成功保存"
    });
    navigate("/quizzes");
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">编辑测验</h1>
          <p className="text-muted-foreground">添加和编辑测验题目</p>
        </div>
      </div>

      {/* 测验基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>设置测验的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">测验标题</Label>
            <Input
              id="title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="请输入测验标题"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">所属课程</Label>
              <Input
                id="course"
                value={quizCourse}
                onChange={(e) => setQuizCourse(e.target.value)}
                placeholder="请输入课程名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">时长（分钟）</Label>
              <Input
                id="duration"
                type="number"
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">测验说明</Label>
            <Textarea
              id="description"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="请输入测验说明（可选）"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 题目列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">题目列表</h2>
          <Badge variant="secondary">{questions.length} 道题目</Badge>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={question.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <span className="font-semibold text-lg">第 {qIndex + 1} 题</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteQuestion(question.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>题目类型</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: "single" | "multiple") => 
                    updateQuestion(question.id, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">单选题</SelectItem>
                    <SelectItem value="multiple">多选题</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>题目内容</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                  placeholder="请输入题目内容"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>选项</Label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() => updateQuestion(question.id, "correctAnswer", optIndex)}
                      className="h-4 w-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                      placeholder={`选项 ${String.fromCharCode(65 + optIndex)}`}
                      className="flex-1"
                    />
                    {question.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(question.id, optIndex)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {question.options.length < 6 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    添加选项
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full h-20 border-dashed"
          onClick={addQuestion}
        >
          <Plus className="h-5 w-5 mr-2" />
          添加新题目
        </Button>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container max-w-4xl mx-auto flex justify-between items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/quizzes")}>
            取消
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            保存测验
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
