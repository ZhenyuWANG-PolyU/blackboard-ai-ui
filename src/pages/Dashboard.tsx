import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, ClipboardCheck, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "进行中的课程",
      value: "4",
      description: "本学期课程",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "学习资料",
      value: "28",
      description: "已收藏资料",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "待完成作业",
      value: "3",
      description: "本周截止",
      icon: ClipboardCheck,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "学习进度",
      value: "75%",
      description: "总体完成度",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">欢迎回来！</h1>
        <p className="text-muted-foreground text-lg">继续您的学习之旅</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>您最近的学习记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { course: "人工智能基础", action: "完成了作业", time: "2小时前" },
                { course: "数据结构", action: "观看了视频", time: "昨天" },
                { course: "算法设计", action: "提交了问题", time: "2天前" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.course}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>即将到来的截止日期</CardTitle>
            <CardDescription>请注意以下任务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "机器学习项目报告", course: "人工智能基础", deadline: "3天后", urgent: true },
                { title: "算法分析作业", course: "算法设计", deadline: "5天后", urgent: false },
                { title: "期中考试准备", course: "数据结构", deadline: "1周后", urgent: false },
              ].map((task, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${task.urgent ? 'bg-destructive' : 'bg-primary'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.course}</p>
                  </div>
                  <span className={`text-sm font-medium ${task.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {task.deadline}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
