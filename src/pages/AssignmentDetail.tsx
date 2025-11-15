import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

const AssignmentDetail = () => {
  const { assignmentId, state } = useParams();
  const location = useLocation();
  const myassignment = location.state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
    maxScore: myassignment.max_score || 100,
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
      },
    ],
  });

  const handleSubmit = () => {
    if (!submission.trim()) {
      toast({
        title: "请输入作业内容",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "提交成功",
      description: "您的作业已成功提交，等待教师批改",
    });

    setSubmission("");
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
      name: assignment.name,
      score: assignment.score,
      status: assignment.status,
      yaoqiu: assignment.requirements,
      deadline: assignment.deadline,
      fabu_time: assignment.publishDate,
      course_name: assignment.course,
      description: assignment.description,
      teacher_name: assignment.instructor,
      huanjingyaoqiu: "",
      maxscore: assignment.maxScore
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
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">点击或拖拽文件到此处上传</p>
                    <p className="text-xs text-muted-foreground mt-1">支持 ZIP, PDF, DOCX 等格式，最大 20MB</p>
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">得分:</span>
                      <span className="text-lg font-bold text-green-600">{sub.score}</span>
                      <span className="text-sm text-muted-foreground">/ {assignment.maxScore}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">反馈: </span>
                      {sub.feedback}
                    </div>
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
    </div>
  );
};

export default AssignmentDetail;
