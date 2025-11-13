import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Target,
  Zap
} from "lucide-react";

const Statistics = () => {
  // 学习时长数据（最近7天）
  const weeklyStudyHours = [
    { day: "周一", hours: 3.5 },
    { day: "周二", hours: 4.2 },
    { day: "周三", hours: 2.8 },
    { day: "周四", hours: 5.1 },
    { day: "周五", hours: 3.9 },
    { day: "周六", hours: 6.5 },
    { day: "周日", hours: 4.3 },
  ];

  // 课程进度数据
  const courseProgress = [
    { name: "人工智能基础", progress: 75, total: 48, completed: 36 },
    { name: "数据结构与算法", progress: 60, total: 40, completed: 24 },
    { name: "机器学习实战", progress: 45, total: 56, completed: 25 },
    { name: "深度学习进阶", progress: 30, total: 60, completed: 18 },
  ];

  // 成就数据
  const achievements = [
    { 
      title: "学习达人", 
      description: "连续7天学习", 
      icon: Target,
      achieved: true,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "作业之星", 
      description: "完成10个作业", 
      icon: Award,
      achieved: true,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "课程探索者", 
      description: "完成1门课程", 
      icon: BookOpen,
      achieved: true,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "百小时挑战", 
      description: "累计学习100小时", 
      icon: Clock,
      achieved: false,
      color: "from-orange-500 to-red-500"
    },
  ];

  const maxHours = Math.max(...weeklyStudyHours.map(d => d.hours));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">学习统计</h1>
        <p className="text-muted-foreground text-lg">追踪您的学习进度和成就</p>
      </div>

      {/* 概览统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本周学习
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">30.3 小时</div>
            <p className="text-xs text-green-600 mt-1">↑ 比上周增加 12%</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总学习时长
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156 小时</div>
            <p className="text-xs text-muted-foreground mt-1">本学期累计</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              完成作业
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">15 / 18</div>
            <p className="text-xs text-muted-foreground mt-1">完成率 83%</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              获得成就
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">3 / 4</div>
            <p className="text-xs text-muted-foreground mt-1">解锁 75%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weekly">本周数据</TabsTrigger>
          <TabsTrigger value="courses">课程进度</TabsTrigger>
          <TabsTrigger value="achievements">成就系统</TabsTrigger>
        </TabsList>

        {/* 本周学习数据 */}
        <TabsContent value="weekly" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>每日学习时长</CardTitle>
                  <CardDescription>最近7天的学习时间分布</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>本周</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStudyHours.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{day.day}</span>
                      <span className="text-muted-foreground">{day.hours} 小时</span>
                    </div>
                    <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${(day.hours / maxHours) * 100}%` }}
                      >
                        <div className="h-full flex items-center justify-end pr-2">
                          {day.hours >= maxHours * 0.3 && (
                            <span className="text-xs font-medium text-white">
                              {day.hours}h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>学习效率</CardTitle>
                <CardDescription>平均每天学习时长</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    4.3
                  </div>
                  <p className="text-lg text-muted-foreground">小时/天</p>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      比上周提升 12%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>学习专注度</CardTitle>
                <CardDescription>连续学习天数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                    7
                  </div>
                  <p className="text-lg text-muted-foreground">天</p>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">
                      保持连续学习
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 课程进度 */}
        <TabsContent value="courses" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>课程学习进度</CardTitle>
              <CardDescription>各门课程的完成情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {courseProgress.map((course) => (
                <div key={course.name} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        已完成 {course.completed}/{course.total} 课时
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{course.progress}%</div>
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">平均进度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">52.5%</div>
                <p className="text-sm text-muted-foreground mt-1">4门课程</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">总课时</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">204</div>
                <p className="text-sm text-muted-foreground mt-1">本学期</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">已完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">103</div>
                <p className="text-sm text-muted-foreground mt-1">课时</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 成就系统 */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>我的成就</CardTitle>
              <CardDescription>您已解锁的学习成就</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                      achievement.achieved
                        ? "border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5"
                        : "border-border/50 bg-secondary/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 ${
                          !achievement.achieved && "grayscale"
                        }`}
                      >
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        {achievement.achieved && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            <Award className="w-3 h-3" />
                            已解锁
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
