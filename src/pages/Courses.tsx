import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, Users, Plus, BookmarkPlus, MoreVertical, Trash2, Star } from "lucide-react";
import axios from "axios";
import { set } from "date-fns";

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);

  // 我的课程
  const [myCourses, setMyCourses] = useState([
    // {
    //   id: 1,
    //   title: "人工智能基础",
    //   instructor: "张教授",
    //   progress: 75,
    //   students: 120,
    //   hours: "48小时",
    //   status: "进行中",
    //   color: "from-blue-500 to-cyan-500",
    // },
    // {
    //   id: 2,
    //   title: "数据结构与算法",
    //   instructor: "李教授",
    //   progress: 60,
    //   students: 95,
    //   hours: "40小时",
    //   status: "进行中",
    //   color: "from-purple-500 to-pink-500",
    // },
    // {
    //   id: 3,
    //   title: "机器学习实战",
    //   instructor: "王教授",
    //   progress: 45,
    //   students: 80,
    //   hours: "56小时",
    //   status: "进行中",
    //   color: "from-orange-500 to-red-500",
    // },
    // {
    //   id: 4,
    //   title: "深度学习进阶",
    //   instructor: "刘教授",
    //   progress: 30,
    //   students: 65,
    //   hours: "60小时",
    //   status: "进行中",
    //   color: "from-green-500 to-emerald-500",
    // },
  ]);

  // 所有可用课程
  const [allCourses, setAllCourses] = useState([
    // {
    //   id: 5,
    //   title: "计算机网络",
    //   instructor: "陈教授",
    //   students: 150,
    //   hours: "44小时",
    //   description: "深入学习计算机网络原理和协议",
    //   color: "from-indigo-500 to-purple-500",
    // },
    // {
    //   id: 6,
    //   title: "操作系统原理",
    //   instructor: "赵教授",
    //   students: 130,
    //   hours: "52小时",
    //   description: "系统学习操作系统的设计与实现",
    //   color: "from-pink-500 to-rose-500",
    // },
    // {
    //   id: 7,
    //   title: "数据库系统",
    //   instructor: "孙教授",
    //   students: 110,
    //   hours: "48小时",
    //   description: "掌握数据库设计和SQL查询",
    //   color: "from-teal-500 to-cyan-500",
    // },
  ]);

  const colorArray = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-teal-500 to-cyan-500",
  ];

  // 新课程表单状态
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    hours: "",
    description: "",
  });

  // 将 fetchCourses 提取为独立函数，方便复用
  const fetchCourses = async () => {
    try {
      const res = await axios.post("/api/get_all_courses", {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const res2 = await axios.post("/api//get_selected_courses", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      console.log('获取到的课程数据:', res.data.courses);
      console.log('获取到的已选课程数据:', res2.data.courses);

      if (res.data.courses && res.data.courses.length > 0) {
        let myAllCourses: any[] = [];
        let myMyCourses: any[] = [];

        res.data.courses.forEach((course: any, index: number) => {
          // 确保 course_id 是数字，如果不是则使用 index
          const courseIdNum = typeof course.course_id === 'number'
            ? course.course_id
            : parseInt(course.course_id) || index;

          const colorIndex = courseIdNum % colorArray.length;
          const selectedColor = colorArray[colorIndex];

          // console.log(`课程 ${course.course_name} - courseId: ${courseIdNum}, colorIndex: ${colorIndex}, color: ${selectedColor}`);

          // 为所有课程列表添加
          myAllCourses.push({
            id: courseIdNum,
            title: course.course_name || "未命名课程",
            instructor: course.teacher_name || "未知教师",
            students: 0,
            hours: course.bei1 || "0小时",
            description: course.course_info || "",
            color: selectedColor,
            course_id: course.course_id, // 保留原始 course_id
          });
        });
        res2.data.courses.forEach((course: any, index: number) => {
          // 确保 course_id 是数字，如果不是则使用 index
          const courseIdNum = typeof course.course_id === 'number'
            ? course.course_id
            : parseInt(course.course_id) || index;

          const colorIndex = courseIdNum % colorArray.length;
          const selectedColor = colorArray[colorIndex];

          // console.log(`课程 ${course.course_name} - courseId: ${courseIdNum}, colorIndex: ${colorIndex}, color: ${selectedColor}`);

          // 为我的课程列表添加
          myMyCourses.push({
            id: courseIdNum,
            title: course.course_name || "未命名课程",
            instructor: course.teacher_name || "未知教师",
            progress: 0,
            students: 0,
            hours: course.bei1 || "0小时",
            status: "进行中",
            color: selectedColor,
            course_id: course.course_id, // 保留原始 course_id
          });
        });

        console.log('处理后的课程数据:', { myMyCourses, myAllCourses });
        setMyCourses(myMyCourses);
        setAllCourses(myAllCourses);
      }
    } catch (error) {
      console.error('获取课程失败:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 添加课程到系统
  async function handleAddCourse() {
    if (!newCourse.title || !newCourse.instructor || !newCourse.hours) {
      toast({
        title: "请填写完整信息",
        description: "课程名称、授课教师和课时不能为空",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post("/api/add_course", {
        course_id: "",
        course_name: newCourse.title,
        teacher_id: "",
        teacher_name: newCourse.instructor,
        course_info: newCourse.description,
        bei1: newCourse.hours, // 备用字段，课时
      },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log(res.data);

      // 重置表单并关闭对话框
      setNewCourse({ title: "", instructor: "", hours: "", description: "" });
      setIsAddDialogOpen(false);

      // 显示成功提示
      toast({
        title: "课程添加成功",
        description: `${newCourse.title} 已添加到课程库`,
      });

      // 重新获取课程列表
      await fetchCourses();
    } catch (error) {
      console.error('添加课程失败:', error);
      toast({
        title: "添加失败",
        description: "添加课程时发生错误，请重试",
        variant: "destructive",
      });
    }
  };

  // 选课
  async function handleSelectCourse(course: any) {
    // 检查是否已经选过
    if (myCourses.some(c => c.course_id === course.course_id)) {
      toast({
        title: "已选过此课程",
        description: "您已经在学习这门课程了",
        variant: "destructive",
      });
      return;
    }
    const res = await axios.post("/api//add_select_course", {
      course_id: course.course_id,
      user_id: "",
      bei1: "",
      bei2: "",
      bei3: "",
      bei4: "",
      bei5: ""
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const newMyCourse = {
      ...course,
      progress: 0,
      status: "进行中",
    };

    // setMyCourses([...myCourses, newMyCourse]);
    fetchCourses()
    setIsSelectDialogOpen(false);

    toast({
      title: "选课成功",
      description: `已成功加入 ${course.title}`,
    });
  };

  // 移除课程
  const handleRemoveCourse = (courseId: number, courseTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    setMyCourses(myCourses.filter(c => c.id !== courseId));

    toast({
      title: "已移除课程",
      description: `${courseTitle} 已从您的课程列表中移除`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">我的课程</h1>
          <p className="text-muted-foreground text-lg">管理和学习您的课程</p>
        </div>
        <div className="flex gap-2">
          {/* 增加课程对话框 */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                增加课程
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card">
              <DialogHeader>
                <DialogTitle>增加新课程</DialogTitle>
                <DialogDescription>
                  添加新课程到课程库中
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title">课程名称 *</Label>
                  <Input
                    id="course-title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="例如：人工智能基础"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">授课教师 *</Label>
                  <Input
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    placeholder="例如：张教授"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">课时 *</Label>
                  <Input
                    id="hours"
                    value={newCourse.hours}
                    onChange={(e) => setNewCourse({ ...newCourse, hours: e.target.value })}
                    placeholder="例如：48小时"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">课程描述</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="简要描述课程内容..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleAddCourse} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  添加课程
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 选课对话框 */}
          <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                选课
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card">
              <DialogHeader>
                <DialogTitle>选择课程</DialogTitle>
                <DialogDescription>
                  从课程库中选择您想学习的课程
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {allCourses.map((course) => (
                    <Card key={course.id} className="border-border/50 hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                              <CardDescription>授课教师: {course.instructor}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {course.description && (
                          <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{course.students} 学生</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.hours}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSelectCourse(course)}
                            disabled={myCourses.some(c => c.id === course.id)}
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          >
                            {myCourses.some(c => c.course_id === course.course_id) ? "已选" : "选择"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCourses.map((course) => (
          <Card
            key={course.id}
            className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group"
            onClick={() => navigate(`/courses/${course.course_id}`, { state: { color: course.color } })}
          >
            {/* 三点菜单 */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    查看详情
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "功能开发中",
                        description: "收藏功能即将上线",
                      });
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    收藏课程
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={(e) => handleRemoveCourse(course.id, course.title, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    移除课程
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardHeader>
              <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${course.color} mb-4 flex items-center justify-center`}>
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <div className="flex items-start justify-between pr-8">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                  <CardDescription>授课教师: {course.instructor}</CardDescription>
                </div>
                <Badge variant="secondary">{course.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">学习进度</span>
                  <span className="font-medium text-foreground">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} 学生</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.hours}</span>
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/${course.id}`);
                }}
              >
                继续学习
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
