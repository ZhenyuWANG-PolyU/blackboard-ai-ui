import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ClipboardCheck,
  HelpCircle,
  Download,
  Play,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Upload,
  Edit2,
  Save,
  X
} from "lucide-react";
import axios from "axios";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // 从导航状态中获取颜色，如果没有则使用默认颜色
  const passedColor = location.state?.color || "from-blue-500 to-cyan-500";

  // 课程数据状态
  const [course, setCourse] = useState({
    id: courseId,
    title: "加载中...",
    instructor: "",
    description: "",
    progress: 0,
    totalWeeks: 16,
    currentWeek: 1,
    students: 0,
    color: passedColor,
  });

  // 每周课程内容
  const weeklyContent = [
    {
      week: 1,
      title: "人工智能概述",
      date: "2024-03-01",
      materials: [
        { id: 1, name: "第一章课件.pdf", type: "PDF", size: "2.3 MB", completed: true },
        { id: 2, name: "AI发展历史.pptx", type: "PPT", size: "5.1 MB", completed: true },
        { id: 3, name: "课程介绍视频.mp4", type: "视频", size: "120 MB", completed: true },
      ],
      assignments: [
        { id: 1, name: "第一周作业：AI概念理解", deadline: "2024-03-08", status: "已完成", score: 95 },
      ],
      quizzes: [
        { id: 1, name: "第一周测验", questions: 10, time: "30分钟", status: "已完成", score: 90 },
      ],
      surveys: [
        { id: 1, name: "课程满意度调查", status: "已完成" },
      ],
    },
    {
      week: 2,
      title: "机器学习基础",
      date: "2024-03-08",
      materials: [
        { id: 4, name: "机器学习导论.pdf", type: "PDF", size: "3.5 MB", completed: true },
        { id: 5, name: "监督学习算法.pptx", type: "PPT", size: "4.8 MB", completed: true },
        { id: 6, name: "Python基础回顾.ipynb", type: "Notebook", size: "1.2 MB", completed: true },
      ],
      assignments: [
        { id: 2, name: "第二周作业：线性回归实现", deadline: "2024-03-15", status: "已完成", score: 88 },
      ],
      quizzes: [
        { id: 2, name: "第二周测验", questions: 15, time: "40分钟", status: "已完成", score: 85 },
      ],
      surveys: [],
    },
    {
      week: 3,
      title: "神经网络入门",
      date: "2024-03-15",
      materials: [
        { id: 7, name: "神经网络基础.pdf", type: "PDF", size: "4.2 MB", completed: true },
        { id: 8, name: "感知机模型.pptx", type: "PPT", size: "3.9 MB", completed: false },
        { id: 9, name: "实验演示视频.mp4", type: "视频", size: "85 MB", completed: false },
      ],
      assignments: [
        { id: 3, name: "第三周作业：神经网络实现", deadline: "2024-03-22", status: "进行中", score: null },
      ],
      quizzes: [
        { id: 3, name: "第三周测验", questions: 12, time: "35分钟", status: "未开始", score: null },
      ],
      surveys: [],
    },
    {
      week: 4,
      title: "深度学习框架",
      date: "2024-03-22",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 5,
      title: "卷积神经网络",
      date: "2024-03-29",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 6,
      title: "循环神经网络",
      date: "2024-04-05",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 7,
      title: "注意力机制与Transformer",
      date: "2024-04-12",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 8,
      title: "期中复习与测试",
      date: "2024-04-19",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 9,
      title: "生成对抗网络",
      date: "2024-04-26",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 10,
      title: "强化学习基础",
      date: "2024-05-03",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 11,
      title: "自然语言处理",
      date: "2024-05-10",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 12,
      title: "计算机视觉应用",
      date: "2024-05-17",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
    {
      week: 13,
      title: "课程总结与展望",
      date: "2024-05-24",
      materials: [],
      assignments: [],
      quizzes: [],
      surveys: [],
    },
  ];

  const [weeklyContentState, setWeeklyContentState] = useState(() =>
    JSON.parse(JSON.stringify(weeklyContent))
  );

  async function getCourseDetail() {
    try {
      const res = await axios.post("/api/get_course_by_id", {
        course_id: courseId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log('获取到的课程详情:', res.data);

      if (res.data && res.data.course) {
        const courseData = res.data.course;
        setCourse({
          id: courseId,
          title: courseData.course_name || "未命名课程",
          instructor: courseData.teacher_name || "未知教师",
          description: courseData.course_info || "",
          progress: courseData.progress || 0,
          totalWeeks: courseData.total_weeks || 13,
          currentWeek: courseData.current_week || 11,
          students: courseData.students || 0,
          color: passedColor, // 使用传递过来的颜色
        });
      }
    } catch (error) {
      console.error('获取课程详情失败:', error);
      toast({
        title: "加载失败",
        description: "无法获取课程信息，请稍后重试",
        variant: "destructive",
      });
    }
  }

  async function getWeekDetail() {
    const res = await axios.post("/api/getweekbycourseid", {
      course_id: courseId
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    console.log(res.data.weeks);

    // 深拷贝 weeklyContent 避免引用污染
    const weeklyContentCopy = JSON.parse(JSON.stringify(weeklyContent));

    for (let week of res.data.weeks) {
      for (let wc of weeklyContentCopy) {
        if (week.week_id === wc.week.toString()) {
          wc.title = week.title;
          wc.date = week.date;
          wc.materials = week.materials || [];
          wc.assignments = week.assignments || [];
          wc.quizzes = week.quizzes || [];
          wc.surveys = week.surveys || [];
        }
      }
    }
    console.log(weeklyContentCopy);
    setWeeklyContentState(weeklyContentCopy);
  }

  useEffect(() => {
    getCourseDetail();
    getWeekDetail();
  }, [courseId]);

  // 模拟用户角色 - 在实际应用中应该从认证系统获取
  const [isTeacher] = useState(true); // 改为 false 可查看学生视图

  // 对话框状态
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);

  // 表单状态
  const [materialForm, setMaterialForm] = useState({
    name: "",
    type: "PDF",
    file: null as File | null,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    name: "",
    deadline: "",
    description: "",
  });

  const [quizForm, setQuizForm] = useState({
    name: "",
    questions: "",
    time: "",
  });

  const [surveyForm, setSurveyForm] = useState({
    name: "",
    description: "",
  });




  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isEditingWeek, setIsEditingWeek] = useState(false);
  const [editWeekForm, setEditWeekForm] = useState({
    title: "",
    date: "",
  });
  const currentWeekContent = weeklyContentState.find(w => w.week === selectedWeek);

  // 发布资料
  async function handlePublishMaterial() {
    // 获取当前选择周次的标题和时间
    const currentWeekTitle = currentWeekContent?.title || "";
    const currentWeekDate = currentWeekContent?.date || "";
    const res = await axios.post("/api/weekupdatetitle", {
      course_week_id: "97",
      course_id: courseId,
      week_id: selectedWeek.toString(),
      title: currentWeekTitle,
      date: currentWeekDate
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (!materialForm.name) {
      toast({
        title: "请填写资料名称",
        variant: "destructive",
      });
      return;
    }

    if (!materialForm.file) {
      toast({
        title: "请选择文件",
        variant: "destructive",
      });
      return;
    }

    try {
      // 获取原始文件的扩展名
      const originalFileName = materialForm.file.name;
      const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));

      // 确保文件名包含扩展名
      let fullFileName = materialForm.name;
      if (!fullFileName.includes('.')) {
        fullFileName = fullFileName + fileExtension;
      }

      // 第一步：获取上传URL
      const res = await axios.post("/api/file_upload", {
        file_name: fullFileName,
        class_id: courseId?.toString() || "",
        user_id: localStorage.getItem("user_id")?.toString() || "",
        description: materialForm.type.toString(),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log('获取上传URL:', res.data.file_upload_url);
      const uploadurl = res.data.file_upload_url;

      // 第二步：使用PUT方法上传文件到uploadurl
      // 不设置 Content-Type 以避免触发 CORS preflight
      const res2 = await axios.put(uploadurl, materialForm.file);
      let file_url = res.data.file_name
      let file_name = fullFileName
      let file_type = materialForm.type.toString()
      // 将字节转换为 MB
      let file_size = (materialForm.file.size / (1024 * 1024)).toFixed(2) + " MB"

      const res3 = await axios.post("/api/updatematerials", {
        course_week_id: courseId + selectedWeek.toString(),
        materials: [
          {
            id: file_url,
            name: file_name,
            type: file_type,
            size: file_size,
            completed: "true",
            update_time: new Date().toISOString(),
            course_name: course.title,
            course_teacher: course.instructor,
            look_times: "0",
            download_times: "0",
            score: "10",
          }
        ]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast({
        title: "资料发布成功",
        description: `${materialForm.name} 已发布到第 ${selectedWeek} 周`,
      });

      // 刷新页面数据以显示新添加的材料
      await getWeekDetail();

      setMaterialForm({ name: "", type: "PDF", file: null });
      setIsMaterialDialogOpen(false);
    } catch (error) {
      console.error('上传失败:', error);
      toast({
        title: "上传失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 发布作业
  const handlePublishAssignment = () => {
    if (!assignmentForm.name || !assignmentForm.deadline) {
      toast({
        title: "请填写完整信息",
        description: "作业名称和截止日期不能为空",
        variant: "destructive",
      });
      return;
    }


    toast({
      title: "作业发布成功",
      description: `${assignmentForm.name} 已发布到第 ${selectedWeek} 周`,
    });

    setAssignmentForm({ name: "", deadline: "", description: "" });
    setIsAssignmentDialogOpen(false);
  };

  // 发布测验
  const handlePublishQuiz = () => {
    if (!quizForm.name || !quizForm.questions || !quizForm.time) {
      toast({
        title: "请填写完整信息",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "测验发布成功",
      description: `${quizForm.name} 已发布到第 ${selectedWeek} 周`,
    });

    setQuizForm({ name: "", questions: "", time: "" });
    setIsQuizDialogOpen(false);
  };

  // 发布问卷
  const handlePublishSurvey = () => {
    if (!surveyForm.name) {
      toast({
        title: "请填写问卷名称",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "问卷发布成功",
      description: `${surveyForm.name} 已发布到第 ${selectedWeek} 周`,
    });

    setSurveyForm({ name: "", description: "" });
    setIsSurveyDialogOpen(false);
  };

  // 开始编辑周次信息
  const handleStartEditWeek = () => {
    if (currentWeekContent) {
      setEditWeekForm({
        title: currentWeekContent.title,
        date: currentWeekContent.date,
      });
      setIsEditingWeek(true);
    }
  };

  // 保存周次信息
  async function handleSaveWeek() {
    if (!editWeekForm.title.trim()) {
      toast({
        title: "请填写周次标题",
        variant: "destructive",
      });
      return;
    }

    if (!editWeekForm.date.trim()) {
      toast({
        title: "请选择日期",
        variant: "destructive",
      });
      return;
    }
    const res = await axios.post("/api/weekupdatetitle", {
      course_week_id: "97",
      course_id: courseId,
      week_id: selectedWeek.toString(),
      title: editWeekForm.title,
      date: editWeekForm.date
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setWeeklyContentState(prev =>
      prev.map(week =>
        week.week === selectedWeek
          ? { ...week, title: editWeekForm.title, date: editWeekForm.date }
          : week
      )
    );

    toast({
      title: "保存成功",
      description: `第 ${selectedWeek} 周信息已更新`,
    });

    setIsEditingWeek(false);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditingWeek(false);
    setEditWeekForm({ title: "", date: "" });
  };

  // 处理材料点击事件（播放或下载）
  async function handleMaterialClick(materialId: string | number) {
    const res = await axios.post("/api/file_download", {
      file_name: materialId.toString()
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const downloadurl = res.data.file_download_url;

    // 在新标签页中打开下载链接
    window.open(downloadurl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-500";
      case "进行中":
        return "bg-orange-500";
      case "未开始":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮和课程标题 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-muted-foreground text-lg">授课教师：{course.instructor}</p>
        </div>
      </div>

      {/* 课程概览卡片 */}
      <Card className="border-border/50">
        <CardHeader>
          <div className={`w-full h-48 rounded-lg bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center`}>
            <BookOpen className="w-24 h-24 text-white" />
          </div>
          <CardTitle>课程简介</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{course.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.students}</div>
              <div className="text-sm text-muted-foreground">学生人数</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.totalWeeks}</div>
              <div className="text-sm text-muted-foreground">总周数</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-1">{course.currentWeek}</div>
              <div className="text-sm text-muted-foreground">当前周</div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">课程进度</span>
              <span className="font-medium text-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* 周次选择 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>选择周次</CardTitle>
          <CardDescription>查看每周的学习内容</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {weeklyContent.map((week) => (
              <Button
                key={week.week}
                variant={selectedWeek === week.week ? "default" : "outline"}
                onClick={() => setSelectedWeek(week.week)}
                className={selectedWeek === week.week ? "bg-gradient-to-r from-primary to-accent" : ""}
              >
                第 {week.week} 周
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 周内容详情 */}
      {currentWeekContent && (
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditingWeek ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="week-title" className="text-sm text-muted-foreground mb-1">周次标题</Label>
                      <Input
                        id="week-title"
                        value={editWeekForm.title}
                        onChange={(e) => setEditWeekForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="输入周次标题"
                        className="text-xl font-semibold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="week-date" className="text-sm text-muted-foreground mb-1">日期</Label>
                      <Input
                        id="week-date"
                        type="date"
                        value={editWeekForm.date}
                        onChange={(e) => setEditWeekForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-auto"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={handleSaveWeek}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">第 {currentWeekContent.week} 周：{currentWeekContent.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      {currentWeekContent.date}
                    </CardDescription>
                  </>
                )}
              </div>
              {!isEditingWeek && (
                <div className="flex items-center gap-2">
                  {isTeacher && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleStartEditWeek}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      编辑
                    </Button>
                  )}
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    第 {currentWeekContent.week} 周
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="materials" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="materials">
                  <FileText className="w-4 h-4 mr-2" />
                  资料
                </TabsTrigger>
                <TabsTrigger value="assignments">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  作业
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  测验
                </TabsTrigger>
                <TabsTrigger value="surveys">
                  <BookOpen className="w-4 h-4 mr-2" />
                  问卷
                </TabsTrigger>
              </TabsList>

              {/* 学习资料 */}
              <TabsContent value="materials" className="space-y-4">
                {isTeacher && (
                  <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" />
                        发布学习资料
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                      <DialogHeader>
                        <DialogTitle>发布学习资料</DialogTitle>
                        <DialogDescription>
                          为第 {selectedWeek} 周添加学习资料
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="material-name">资料名称 *</Label>
                          <Input
                            id="material-name"
                            value={materialForm.name}
                            onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                            placeholder="例如：第一章课件.pdf"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="material-type">资料类型</Label>
                          <select
                            id="material-type"
                            value={materialForm.type}
                            onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          >
                            <option value="PDF">PDF</option>
                            <option value="PPT">PPT</option>
                            <option value="视频">视频</option>
                            <option value="Notebook">Notebook</option>
                            <option value="其他">其他</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="material-file">上传文件</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="material-file"
                              type="file"
                              onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files?.[0] || null })}
                            />
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMaterialDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handlePublishMaterial} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          发布
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {currentWeekContent.materials.length > 0 ? (
                  currentWeekContent.materials.map((material) => (
                    <Card key={material.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{material.name}</h4>
                                {material.completed && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <Badge variant="secondary">{material.type}</Badge>
                                <span>{material.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {material.type === "视频" ? (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                onClick={() => handleMaterialClick(material.id)}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                播放
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMaterialClick(material.id)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                下载
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无学习资料
                  </div>
                )}
              </TabsContent>

              {/* 作业 */}
              <TabsContent value="assignments" className="space-y-4">
                {isTeacher && (
                  <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" />
                        发布作业
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                      <DialogHeader>
                        <DialogTitle>发布作业</DialogTitle>
                        <DialogDescription>
                          为第 {selectedWeek} 周添加作业
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignment-name">作业名称 *</Label>
                          <Input
                            id="assignment-name"
                            value={assignmentForm.name}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, name: e.target.value })}
                            placeholder="例如：第一周作业：AI概念理解"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-deadline">截止日期 *</Label>
                          <Input
                            id="assignment-deadline"
                            type="date"
                            value={assignmentForm.deadline}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-description">作业说明</Label>
                          <Textarea
                            id="assignment-description"
                            value={assignmentForm.description}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                            placeholder="描述作业要求和注意事项..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handlePublishAssignment} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          发布
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {currentWeekContent.assignments.length > 0 ? (
                  currentWeekContent.assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${assignment.status === "已完成" ? "from-green-500/20 to-emerald-500/20" : "from-orange-500/20 to-red-500/20"
                              } flex items-center justify-center`}>
                              <ClipboardCheck className={`w-6 h-6 ${assignment.status === "已完成" ? "text-green-600" : "text-orange-600"
                                }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{assignment.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>截止: {assignment.deadline}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(assignment.status)}`} />
                                <span>{assignment.status}</span>
                                {assignment.score !== null && (
                                  <span className="font-medium text-green-600">得分: {assignment.score}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={assignment.status === "已完成" ? "outline" : "default"}
                            className={assignment.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {assignment.status === "已完成" ? "查看详情" : "开始作业"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无作业
                  </div>
                )}
              </TabsContent>

              {/* 测验 */}
              <TabsContent value="quizzes" className="space-y-4">
                {isTeacher && (
                  <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" />
                        发布测验
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                      <DialogHeader>
                        <DialogTitle>发布测验</DialogTitle>
                        <DialogDescription>
                          为第 {selectedWeek} 周添加测验
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="quiz-name">测验名称 *</Label>
                          <Input
                            id="quiz-name"
                            value={quizForm.name}
                            onChange={(e) => setQuizForm({ ...quizForm, name: e.target.value })}
                            placeholder="例如：第一周测验"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quiz-questions">题目数量 *</Label>
                          <Input
                            id="quiz-questions"
                            type="number"
                            value={quizForm.questions}
                            onChange={(e) => setQuizForm({ ...quizForm, questions: e.target.value })}
                            placeholder="例如：10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quiz-time">答题时长 *</Label>
                          <Input
                            id="quiz-time"
                            value={quizForm.time}
                            onChange={(e) => setQuizForm({ ...quizForm, time: e.target.value })}
                            placeholder="例如：30分钟"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handlePublishQuiz} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          发布
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {currentWeekContent.quizzes.length > 0 ? (
                  currentWeekContent.quizzes.map((quiz) => (
                    <Card key={quiz.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${quiz.status === "已完成" ? "from-purple-500/20 to-pink-500/20" : "from-blue-500/20 to-cyan-500/20"
                              } flex items-center justify-center`}>
                              <HelpCircle className={`w-6 h-6 ${quiz.status === "已完成" ? "text-purple-600" : "text-blue-600"
                                }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{quiz.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{quiz.questions} 题</span>
                                <span>•</span>
                                <span>{quiz.time}</span>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(quiz.status)}`} />
                                <span>{quiz.status}</span>
                                {quiz.score !== null && (
                                  <span className="font-medium text-purple-600">得分: {quiz.score}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={quiz.status === "已完成" ? "outline" : "default"}
                            className={quiz.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {quiz.status === "已完成" ? "查看结果" : "开始测验"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无测验
                  </div>
                )}
              </TabsContent>

              {/* 问卷 */}
              <TabsContent value="surveys" className="space-y-4">
                {isTeacher && (
                  <Dialog open={isSurveyDialogOpen} onOpenChange={setIsSurveyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" />
                        发布问卷
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                      <DialogHeader>
                        <DialogTitle>发布问卷</DialogTitle>
                        <DialogDescription>
                          为第 {selectedWeek} 周添加问卷
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="survey-name">问卷名称 *</Label>
                          <Input
                            id="survey-name"
                            value={surveyForm.name}
                            onChange={(e) => setSurveyForm({ ...surveyForm, name: e.target.value })}
                            placeholder="例如：课程满意度调查"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="survey-description">问卷说明</Label>
                          <Textarea
                            id="survey-description"
                            value={surveyForm.description}
                            onChange={(e) => setSurveyForm({ ...surveyForm, description: e.target.value })}
                            placeholder="描述问卷目的和内容..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSurveyDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handlePublishSurvey} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          发布
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {currentWeekContent.surveys.length > 0 ? (
                  currentWeekContent.surveys.map((survey) => (
                    <Card key={survey.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{survey.name}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(survey.status)}`} />
                                <span>{survey.status}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={survey.status === "已完成" ? "outline" : "default"}
                            className={survey.status === "已完成" ? "" : "bg-gradient-to-r from-primary to-accent hover:opacity-90"}
                          >
                            {survey.status === "已完成" ? "查看问卷" : "填写问卷"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    暂无问卷
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDetail;
