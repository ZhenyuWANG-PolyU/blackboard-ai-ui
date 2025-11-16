import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Upload, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: "single" | "multiple";
  uuid: string;
  q_score: string;
}

const QuizEditor = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const location = useLocation();
  const myquiz = location.state;
  const { toast } = useToast();

  const [quizTitle, setQuizTitle] = useState(myquiz?.title || "机器学习算法测试");
  const [quizCourse, setQuizCourse] = useState(myquiz?.course || "人工智能基础");
  const [quizDuration, setQuizDuration] = useState(myquiz?.duration || "60");
  const [quizDescription, setQuizDescription] = useState(myquiz?.description || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      question: "什么是监督学习？",
      options: ["使用标记数据进行训练的学习方法", "不使用标记数据的学习方法", "强化学习的一种形式", "深度学习的特殊情况"],
      correctAnswer: "0",
      type: "single",
      uuid: "",
      q_score: ""
    }
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["选项A", "选项B", "选项C", "选项D"],
      correctAnswer: "0",
      type: "single",
      uuid: "",
      q_score: ""
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
          correctAnswer: parseInt(q.correctAnswer) >= optionIndex && parseInt(q.correctAnswer) > 0 ? (parseInt(q.correctAnswer) - 1).toString() : q.correctAnswer
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "文件已选择",
        description: `已选择文件: ${file.name}`
      });
    }
  };

  async function handleSave() {
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
    let quizs = []
    for (let q of questions) {
      quizs.push({
        uuid: q.uuid,
        quiz_id: myquiz.id,
        quiz_name: myquiz.title,
        quiz_time: myquiz.duration,
        quiz_score: myquiz.score.toString(),
        quiz_status: myquiz.status,
        quiz_question_number: myquiz.questions,
        q_question: q.question,
        q_options: q.options,
        q_correct_answer: q.correctAnswer.toString(),
        q_type: q.type,
        q_score: q.q_score
      })
    }
    console.log(quizs);
    console.log(myquiz);
    let res = await axios.post("/api/updatequizq", {
      id: myquiz.id,
      name: myquiz.title,
      time: myquiz.duration,
      score: myquiz.score.toString(),
      status: myquiz.status,
      description: myquiz.description,
      questions_number: myquiz.questions,
      quizzes: quizs
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(res.data);
    // TODO: 调用API保存数据
    toast({
      title: "保存成功",
      description: "测验已成功保存"
    });
    navigate("/quizzes");
  };
  async function fetchQuizDetails() {
    let res = await axios.post("/api/selectquizbyid",{
      quiz_id: myquiz.id
    },{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(res.data);
    let i=1;
    setQuestions(res.data.quizzes.map((q:any) => ({
      id: (i++).toString(),
      question: q.q_question,
      options: q.q_options,
      correctAnswer: q.q_correct_answer,
      type: q.q_type,
      uuid: q.uuid,
      q_score: q.q_score
    })));
  }

  async function aigenerateQuestions(questionId: string) {
    console.log(questionId)
    const question = questions.find(q => q.id === questionId);
    console.log(question)
    if (!question) return;

    if (!selectedFile) {
      toast({
        title: "请先上传文件",
        description: "需要上传文件才能使用AI生成题目",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AI生成中...",
      description: "正在为您生成题目，请稍候"
    });

    try {
      // 先上传文件
      const uploadRes = await axios.post("/api/file_upload", {
        file_name: selectedFile.name,
        class_id: "",
        user_id: "",
        description: "AI出题文件"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      await axios.put(uploadRes.data.file_upload_url, selectedFile);

      // 调用AI生成题目接口
      const aiRes = await axios.post("/api/generate_single_question", {
        url: uploadRes.data.file_name,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log(aiRes.data.response)
      // 更新当前题目
      if (aiRes.data.response) {
        const aiQuestion = aiRes.data.response;
        setQuestions(questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              question: aiQuestion.question || q.question,
              options: aiQuestion.options || q.options,
              correctAnswer: aiQuestion.correct_answer?.toString() || q.correctAnswer,
              q_score: aiQuestion.score?.toString() || q.q_score
            };
          }
          return q;
        }));
        
        toast({
          title: "生成成功",
          description: "AI已为您生成题目"
        });
      }
    } catch (error) {
      console.error("AI生成失败:", error);
      toast({
        title: "生成失败",
        description: "AI生成题目失败，请重试",
        variant: "destructive"
      });
    }
  }
  useEffect(() => {
    fetchQuizDetails();
  }, []);

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

      {/* AI出题 */}
      <Card>
        <CardHeader>
          <CardTitle>AI出题</CardTitle>
          <CardDescription>上传文件让AI自动生成测验题目</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="ai-file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="ai-file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedFile ? (
                    <span className="text-foreground font-medium">{selectedFile.name}</span>
                  ) : (
                    "点击上传文件或拖拽文件到此处"
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  支持 PDF, DOC, DOCX, TXT 格式
                </p>
              </label>
            </div>
            {selectedFile && (
              <Button className="w-full" variant="default">
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile.name} 可以生成题目...
              </Button>
            )}
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      aigenerateQuestions(question.id);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI生成
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuestion(question.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>题目分值</Label>
                <Textarea
                  value={question.q_score}
                  onChange={(e) => updateQuestion(question.id, "q_score", e.target.value)}
                  placeholder="请输入题目分值"
                  rows={2}
                />
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
                      checked={parseInt(question.correctAnswer) === optIndex}
                      onChange={() => updateQuestion(question.id, "correctAnswer", optIndex.toString())}
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
