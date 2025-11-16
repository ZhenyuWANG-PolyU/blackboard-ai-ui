import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Upload, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { title } from "process";
import { randomUUID } from "crypto";

type QuestionType = "single" | "multiple" | "text" | "rating";

interface SurveyQuestion {
  uuid: any;
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
}

const SurveyEditor = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const location = useLocation();
  const surveyData = location.state;
  const { toast } = useToast();
  console.log(surveyData)
  const [surveyTitle, setSurveyTitle] = useState(surveyData?.title);
  const [surveyCourse, setSurveyCourse] = useState(surveyData?.course);
  const [surveyDescription, setSurveyDescription] = useState(surveyData?.description);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiGenerateCount, setAiGenerateCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    {
      id: "1",
      type: "single",
      question: "您对本课程的整体满意度如何？",
      required: true,
      options: ["非常满意", "满意", "一般", "不满意", "非常不满意"],
      uuid: "",
    }
  ]);

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: "single",
      question: "",
      required: true,
      options: ["选项1", "选项2", "选项3"],
      uuid: ""
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "文件已上传",
        description: `已选择: ${file.name}`
      });
    }
  };

  const handleAIGenerate = async () => {
    if (!uploadedFile) {
      toast({
        title: "请先上传文件",
        description: "需要上传文件后才能使用AI生成功能",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: 调用AI生成API，传入文件和生成数量
      toast({
        title: "AI生成功能开发中",
        description: `将生成 ${aiGenerateCount} 个问题`
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: "AI生成问题时出错",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateQuestion = (id: string, field: keyof SurveyQuestion, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        // 如果改变题型，需要处理options
        if (field === "type") {
          if (value === "text") {
            return { ...q, [field]: value, options: undefined };
          } else if (value === "rating") {
            return { ...q, [field]: value, options: ["1", "2", "3", "4", "5"] };
          } else if (!q.options) {
            return { ...q, [field]: value, options: ["选项1", "选项2", "选项3"] };
          }
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return { ...q, options: [...q.options, `选项${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
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
        description: "至少需要保留一个问题",
        variant: "destructive"
      });
    }
  };

  async function handleSave() {
    let s = {
      id: surveyData.id,
      name: surveyTitle,
      course: surveyCourse,
      description: surveyDescription,
    }
    let res = await axios.post("/api/updatesurveybyid", {
      course_week_id: "",
      surveys: [s]
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data);
    const hasEmptyQuestion = questions.some(q => !q.question.trim());
    const hasEmptyOption = questions.some(q =>
      q.options && q.options.some(opt => !opt.trim())
    );

    if (!surveyTitle.trim()) {
      toast({
        title: "保存失败",
        description: "请填写问卷标题",
        variant: "destructive"
      });
      return;
    }

    if (hasEmptyQuestion) {
      toast({
        title: "保存失败",
        description: "请完善所有问题内容",
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
    let sur=[]
    for (let q of questions){
      sur.push({
        uuid:q.uuid ? q.uuid : "",
        suvery_id:surveyData.id,
        suvery_name:surveyTitle,
        suvery_time:"2025-11-16",
        suvery_score:"0",
        suvery_status:"未完成",
        suvery_question_number:"",
        q_question:q.question,
        q_options:q.options,
        q_correct_answer:"",
        q_type:"single",
        q_score:"10"
      })
    }
    console.log(sur)
    let res2 = await axios.post("/api/add_suvery_q", {
      id: surveyData.id,
      name: surveyTitle,
      course: surveyCourse,
      description: surveyDescription,
      course_id: surveyData.course_id,
      course_name: surveyData.course,
      teacher_name: surveyData.teacher_name,
      suverys: sur
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res2.data);
    // TODO: 调用API保存数据
    // console.log(questions)
    toast({
      title: "保存成功",
      description: "问卷已成功保存"
    });
    navigate("/surveys");
  };

  async function fetchSurveyData() {
    let res = await axios.post("/api/get_suvery_q_by_suvery_id", {
      survey_id: surveyData.id
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(res.data);
    if (res.data.code === 20000) {
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
      setQuestions(qs);
    }
  }

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels: Record<QuestionType, string> = {
      single: "单选题",
      multiple: "多选题",
      text: "问答题",
      rating: "评分题"
    };
    return labels[type];
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/surveys")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">编辑问卷</h1>
          <p className="text-muted-foreground">添加和编辑问卷问题</p>
        </div>
      </div>

      {/* 问卷基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>设置问卷的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">问卷标题</Label>
            <Input
              id="title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="请输入问卷标题"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">所属课程</Label>
            <Input
              id="course"
              value={surveyCourse}
              onChange={(e) => setSurveyCourse(e.target.value)}
              placeholder="请输入课程名称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">问卷说明</Label>
            <Textarea
              id="description"
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="请输入问卷说明"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI生成配置 */}
      <Card>
        <CardHeader>
          <CardTitle>AI生成问题</CardTitle>
          <CardDescription>上传文件，让AI帮你生成问卷问题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">上传文件</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="flex-1"
              />
              {uploadedFile && (
                <Badge variant="secondary" className="gap-1">
                  <Upload className="h-3 w-3" />
                  {uploadedFile.name}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              支持 PDF、Word、文本文件
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="generate-count">生成问题数量</Label>
            <Select
              value={aiGenerateCount.toString()}
              onValueChange={(value) => setAiGenerateCount(parseInt(value))}
            >
              <SelectTrigger id="generate-count">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 个问题</SelectItem>
                <SelectItem value="3">3 个问题</SelectItem>
                <SelectItem value="5">5 个问题</SelectItem>
                <SelectItem value="10">10 个问题</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleAIGenerate} 
            className="w-full gap-2"
            disabled={!uploadedFile || isGenerating}
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "生成中..." : "AI生成问题"}
          </Button>
        </CardContent>
      </Card>

      {/* 问题列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">问题列表</h2>
          <Badge variant="secondary">{questions.length} 个问题</Badge>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={question.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <span className="font-semibold text-lg">问题 {qIndex + 1}</span>
                  {question.required && (
                    <Badge variant="destructive" className="text-xs">必答</Badge>
                  )}
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
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label>问题类型</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: QuestionType) =>
                      updateQuestion(question.id, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">单选题</SelectItem>
                      <SelectItem value="multiple">多选题</SelectItem>
                      <SelectItem value="text">问答题</SelectItem>
                      <SelectItem value="rating">评分题</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div className="space-y-2">
                  <Label>是否必答</Label>
                  <div className="flex items-center h-10 gap-2">
                    <Switch
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(question.id, "required", checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {question.required ? "必答" : "选答"}
                    </span>
                  </div>
                </div> */}
              </div>

              <div className="space-y-2">
                <Label>问题内容</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                  placeholder="请输入问题内容"
                  rows={2}
                />
              </div>

              {question.type !== "text" && question.options && (
                <div className="space-y-3">
                  <Label>
                    {question.type === "rating" ? "评分选项" : "选项"}
                  </Label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-8">
                        {question.type === "rating" ? `${optIndex + 1}分` : `${optIndex + 1}.`}
                      </span>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        placeholder={`选项 ${optIndex + 1}`}
                        className="flex-1"
                        disabled={question.type === "rating"}
                      />
                      {question.type !== "rating" && question.options!.length > 2 && (
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
                  {question.type !== "rating" && question.options.length < 10 && (
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
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full h-20 border-dashed"
          onClick={addQuestion}
        >
          <Plus className="h-5 w-5 mr-2" />
          添加新问题
        </Button>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 z-50">
        <div className="container max-w-4xl mx-auto flex justify-between items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/surveys")}>
            取消
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            保存问卷
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyEditor;
