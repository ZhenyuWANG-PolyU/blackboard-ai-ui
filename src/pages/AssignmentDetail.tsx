import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ClipboardCheck,
  Clock,
  Calendar,
  BookOpen,
  User,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Edit,
  Save,
  X
} from "lucide-react";
import axios from "axios";
import { get } from "http";
import { set } from "date-fns";

const AssignmentDetail = () => {
  const { assignmentId, state } = useParams();
  const location = useLocation();
  const myassignment = location.state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 批改相关状态
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState<any>(null);
  const [gradingScore, setGradingScore] = useState("");
  const [gradingFeedback, setGradingFeedback] = useState("");
  const [gradingFile, setGradingFile] = useState<File | null>(null);
  const gradingFileInputRef = useRef<HTMLInputElement>(null);
  const [editedAssignment, setEditedAssignment] = useState({
    name: "",
    description: "",
    deadline: "",
    publishDate: "",
    maxScore: 100,
    requirements: [] as string[],
  });


  // 模拟作业详情数据
  const [assignment, setAssignment] = useState({
    id: assignmentId,
    name: myassignment.title,
    course: myassignment.course,
    instructor: myassignment.teacher_name || "未知教师",
    deadline: myassignment.deadline,
    publishDate: myassignment.fabu_time || "未知日期",
    status: "进行中", // 进行中、已完成、已逾期
    score: myassignment.score || null,
    maxScore: myassignment.maxscore || 100,
    description: myassignment.description || "暂无描述",
    requirements: myassignment.yaoqiu || ["请按时完成作业", "确保代码可运行"],
    submittedCount: 85,
    totalStudents: 120,
    submissions: [
      {
        date: "2024-01-18 14:30",
        file: "张三_作业.zip",
        score: 95,
        feedback: "代码实现优秀，报告分析深入，建议在可视化部分增加更多图表。",
        file_url: "",
        uuid: "",
        assign_id: "",
        user_id: "",
        assign_description: "",
      },
    ],
  });

  async function getAssignSubmit() {
    let res = await axios.post("/api/get_submits_by_assign_id", {
      assign_id: assignment.id
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(res.data.assign_submits);
    let subs = [];
    for (let i = 0; i < res.data.assign_submits.length; i++) {
      let sub = res.data.assign_submits[i];
      subs.push({
        date: sub.submit_date,
        file: sub.file_name,
        score: sub.score,
        feedback: sub.feedback,
        uuid: sub.uuid,
        assign_id: sub.assign_id,
        user_id: sub.user_id,
        file_url: sub.file_url,
        assign_description: sub.assign_description
      })
    }
    setAssignment(prev => ({
      ...prev,
      submissions: subs
    }));
  }
  useEffect(() => {
    getAssignSubmit();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件大小（20MB限制）
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "文件过大",
          description: "文件大小不能超过 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "文件已选择",
        description: file.name,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  async function handleSubmit() {
    if (!submission.trim() || !selectedFile) {
      toast({
        title: "请输入作业内容并上传文件",
        variant: "destructive",
      });
      return;
    }
    let res = await axios.post("/api/file_upload", {
      file_name: selectedFile.name,
      class_id: "",
      user_id: "",
      description: submission
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(res.data);
    const uploadurl = res.data.file_upload_url;
    const res2 = await axios.put(uploadurl, selectedFile);

    const res3 = await axios.post("/api/submit_homework", {
      assign_id: assignment.id,
      user_id: "",
      file_url: res.data.file_name,
      file_name: selectedFile.name,
      submit_date: new Date().toISOString().split('T')[0],
      score: "待批改",
      feedback: "待批改",
      assign_description: submission
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    await getAssignSubmit();

    toast({
      title: "提交成功",
      description: "您的作业已成功提交，等待教师批改",
    });

    setSubmission("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-500";
      case "进行中":
        return "bg-orange-500";
      case "已逾期":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  async function handleEdit() {
    setEditedAssignment({
      name: assignment.name,
      description: assignment.description,
      deadline: assignment.deadline,
      publishDate: assignment.publishDate,
      maxScore: assignment.maxScore,
      requirements: [...assignment.requirements],
    });
    setIsEditing(true);
  };

  async function handleSave() {
    let ass = {
      id: assignment.id,
      name: editedAssignment.name,
      score: assignment.score,
      status: assignment.status,
      yaoqiu: editedAssignment.requirements,
      deadline: editedAssignment.deadline,
      fabu_time: editedAssignment.publishDate,
      course_name: assignment.course,
      description: editedAssignment.description,
      teacher_name: assignment.instructor,
      huanjingyaoqiu: "",
      maxscore: editedAssignment.maxScore
    }
    console.log(ass);
    const res = await axios.post("/api/updateassignment", {
      course_week_id: assignment.id,
      assignments: [ass]
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setAssignment({
      ...assignment,
      ...editedAssignment,
    });
    setIsEditing(false);
    toast({
      title: "保存成功",
      description: "作业信息已更新",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...editedAssignment.requirements];
    newRequirements[index] = value;
    setEditedAssignment({ ...editedAssignment, requirements: newRequirements });
  };

  const handleAddRequirement = () => {
    setEditedAssignment({
      ...editedAssignment,
      requirements: [...editedAssignment.requirements, ""],
    });
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = editedAssignment.requirements.filter((_, i) => i !== index);
    setEditedAssignment({ ...editedAssignment, requirements: newRequirements });
  };

  // 批改相关函数
  const handleOpenGrading = (sub: any) => {
    setCurrentGradingSubmission(sub);
    setGradingScore(sub.score === "待批改" ? "" : sub.score.toString());
    setGradingFeedback(sub.feedback === "待批改" ? "" : sub.feedback);
    setGradingFile(null);
    setIsGradingOpen(true);
  };

  const handleGradingFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "文件过大",
          description: "文件大小不能超过 20MB",
          variant: "destructive",
        });
        return;
      }
      setGradingFile(file);
      toast({
        title: "文件已选择",
        description: file.name,
      });
    }
  };

  const handleGradingUploadClick = () => {
    gradingFileInputRef.current?.click();
  };

  const handleSubmitGrading = async () => {
    // if (!gradingScore || !gradingFeedback) {
    //   toast({
    //     title: "请填写完整信息",
    //     description: "请输入分数和反馈",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      let url1 = "";
      let url2 = currentGradingSubmission.file_url;
      // 如果上传了新文件，先上传文件
      if (gradingFile) {
        const uploadRes = await axios.post("/api/file_upload", {
          file_name: gradingFile.name,
          class_id: "",
          user_id: "",
          description: "批改文件"
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        await axios.put(uploadRes.data.file_upload_url, gradingFile);
        url1 = uploadRes.data.file_name;
      }

      console.log(url1);
      console.log(url2);
      // 提交批改
      toast({
        title: "批改中....",
        description: "作业批改已提交",
      });
      let res3 = await axios.post("/api/grade_assignment", {
        url1: url1,
        url2: url2
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log(res3.data);
      setGradingScore(res3.data.score);
      setGradingFeedback(res3.data.feedback);

      toast({
        title: "批改成功",
        description: "作业批改已提交",
      });

      // 刷新提交列表
      await getAssignSubmit();

      // 关闭对话框
      // setIsGradingOpen(false);
      // setCurrentGradingSubmission(null);
      // setGradingScore("");
      // setGradingFeedback("");
      // setGradingFile(null);
    } catch (error) {
      toast({
        title: "批改失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  async function decisionSubmitGrading() {
    let res = await axios.post("/api/update_submit_by_uuid", {
      uuid: currentGradingSubmission.uuid,
      score: gradingScore.toString(),
      feedback: gradingFeedback.toString()
    },{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    await getAssignSubmit();
    // 关闭对话框
    setIsGradingOpen(false);
    setCurrentGradingSubmission(null);
    setGradingScore("");
    setGradingFeedback("");
    setGradingFile(null);
  }

  const isOverdue = new Date(assignment.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* 返回按钮和标题 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/assignments")}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editedAssignment.name}
              onChange={(e) => setEditedAssignment({ ...editedAssignment, name: e.target.value })}
              className="text-4xl font-bold h-auto py-2 mb-2"
            />
          ) : (
            <h1 className="text-4xl font-bold text-foreground mb-2">{assignment.name}</h1>
          )}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{assignment.course}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{assignment.instructor}</span>
            </div>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="default">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
          </div>
        )}
      </div>

      {/* 作业状态卡片 */}
      <Card className={`border-2 ${assignment.status === "已完成" ? "border-green-500/50 bg-green-500/5" :
        isOverdue ? "border-red-500/50 bg-red-500/5" :
          "border-orange-500/50 bg-orange-500/5"
        }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${assignment.status === "已完成" ? "from-green-500 to-emerald-500" :
                isOverdue ? "from-red-500 to-orange-500" :
                  "from-orange-500 to-yellow-500"
                } flex items-center justify-center`}>
                {assignment.status === "已完成" ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <ClipboardCheck className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">作业状态</h3>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>截止时间: {assignment.deadline}</span>
                  </div>
                  {!isOverdue && daysLeft > 0 && (
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>还剩 {daysLeft} 天</span>
                    </div>
                  )}
                  {isOverdue && (
                    <div className="flex items-center gap-1 text-red-600 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>已逾期</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {assignment.score !== null && (
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">{assignment.score}</div>
                <div className="text-sm text-muted-foreground">/ {assignment.maxScore} 分</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主内容区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 作业要求 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>作业要求</CardTitle>
              <CardDescription>请仔细阅读以下要求并按时完成</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedAssignment.description}
                  onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })}
                  className="min-h-[300px] font-mono"
                  placeholder="输入作业要求..."
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {assignment.description}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* 提交作业 */}
          {assignment.status !== "已完成" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>提交作业</CardTitle>
                <CardDescription>
                  {isOverdue ? "作业已逾期，但仍可提交" : "请在截止日期前提交您的作业"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">作业内容或说明</label>
                  <Textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="输入作业说明或粘贴在线文档链接..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">上传文件</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".zip,.pdf,.docx,.doc,.txt,.ppt,.pptx"
                    className="hidden"
                  />
                  <div
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">点击或拖拽文件到此处上传</p>
                    <p className="text-xs text-muted-foreground mt-1">支持 ZIP, PDF, DOCX 等格式，最大 20MB</p>
                    {selectedFile && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-primary">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  disabled={isOverdue}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isOverdue ? "作业已逾期" : "提交作业"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 教师反馈 */}
          {assignment.submissions.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>教师反馈</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.submissions.map((sub, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{sub.file}</span>
                      </div>
                      <Badge variant="secondary">{sub.date}</Badge>
                    </div>
                  <div 
                    onClick={() => navigate(`/grading-detail/${sub.uuid}`, { 
                      state: {
                        date: sub.date,
                        file: sub.file,
                        score: sub.score,
                        feedback: sub.feedback,
                        uuid: sub.uuid,
                        assign_id: sub.assign_id,
                        user_id: sub.user_id,
                        file_url: sub.file_url,
                        assign_description: sub.assign_description
                      }
                    })}
                    className="cursor-pointer hover:bg-accent/50 transition-colors p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">得分:</span>
                      <span className="text-lg font-bold text-green-600">{sub.score}</span>
                      <span className="text-sm text-muted-foreground">/ {assignment.maxScore}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">反馈: </span>
                      {sub.feedback}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleOpenGrading(sub)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    批改作业
                  </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 基本信息 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">发布时间</span>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedAssignment.publishDate}
                    onChange={(e) => setEditedAssignment({ ...editedAssignment, publishDate: e.target.value })}
                    className="w-auto h-8 text-sm"
                  />
                ) : (
                  <span className="font-medium">{assignment.publishDate}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">截止时间</span>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedAssignment.deadline}
                    onChange={(e) => setEditedAssignment({ ...editedAssignment, deadline: e.target.value })}
                    className="w-auto h-8 text-sm"
                  />
                ) : (
                  <span className="font-medium">{assignment.deadline}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">满分</span>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedAssignment.maxScore}
                    onChange={(e) => setEditedAssignment({ ...editedAssignment, maxScore: parseInt(e.target.value) || 0 })}
                    className="w-20 h-8 text-sm"
                  />
                ) : (
                  <span className="font-medium">{assignment.maxScore} 分</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">提交情况</span>
                <span className="font-medium">
                  {assignment.submittedCount} / {assignment.totalStudents}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 环境要求 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>环境要求</span>
                {isEditing && (
                  <Button onClick={handleAddRequirement} size="sm" variant="outline">
                    添加
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  {editedAssignment.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={req}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="环境要求"
                        className="text-sm"
                      />
                      <Button
                        onClick={() => handleRemoveRequirement(index)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2 text-sm">
                  {assignment.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                下载作业要求
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                查看相关资料
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 批改对话框 */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>批改作业</DialogTitle>
            <DialogDescription>
              为学生的作业打分并提供反馈
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="score">分数</Label>
              <Input
                id="score"
                type="number"
                placeholder={`请输入分数 (0-${assignment.maxScore})`}
                value={gradingScore}
                onChange={(e) => setGradingScore(e.target.value)}
                min="0"
                max={assignment.maxScore}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">反馈</Label>
              <Textarea
                id="feedback"
                placeholder="请输入对学生作业的反馈..."
                value={gradingFeedback}
                onChange={(e) => setGradingFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>上传批改文件（可选）</Label>
              <input
                type="file"
                ref={gradingFileInputRef}
                onChange={handleGradingFileSelect}
                accept=".zip,.pdf,.docx,.doc,.txt,.ppt,.pptx"
                className="hidden"
              />
              <div
                onClick={handleGradingUploadClick}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                {gradingFile ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium">{gradingFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ({(gradingFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      点击上传批改文件
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      支持 ZIP, PDF, DOCX, TXT, PPT 格式，最大 20MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradingOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitGrading}>
              AI批改
            </Button>
            <Button onClick={decisionSubmitGrading}>
              确认批改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentDetail;
