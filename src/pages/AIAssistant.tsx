import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, Send, User, FileQuestion, BookOpen, TrendingDown, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好！我是 AI 助教，很高兴为您服务。我可以帮助您解答学习问题、提供资料建议，或者协助完成作业。请问有什么可以帮到您的？",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>("general");
  const [isCourseSelectOpen, setIsCourseSelectOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<typeof aiFeatures[0] | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  // 模拟课程数据
  const courses = [
    { id: 1, title: "人工智能基础", instructor: "张教授" },
    { id: 2, title: "数据结构与算法", instructor: "李教授" },
    { id: 3, title: "机器学习实战", instructor: "王教授" },
    { id: 4, title: "深度学习进阶", instructor: "刘教授" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: "我理解您的问题。让我为您详细解答...",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const quickQuestions = [
    "如何开始学习机器学习？",
    "解释一下递归算法",
    "推荐数据结构学习资料",
    "帮我检查作业思路",
  ];

  const aiFeatures = [
    {
      id: "quiz",
      title: "AI 出题自检",
      description: "生成练习题目，检验学习成果",
      icon: FileQuestion,
      color: "from-blue-500 to-cyan-500",
      prompt: "请根据我最近学习的内容，为我出几道练习题来检验学习效果。"
    },
    {
      id: "summary",
      title: "AI 重点摘要",
      description: "自动提取课程核心要点",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      prompt: "请帮我总结最近学习课程的重点内容和核心概念。"
    },
    {
      id: "analysis",
      title: "AI 学习弱点分析",
      description: "分析薄弱环节，针对性提升",
      icon: TrendingDown,
      color: "from-orange-500 to-red-500",
      prompt: "根据我的作业和测验表现，分析我的学习弱点，并提供改进建议。"
    }
  ];

  const startAIFeature = (feature: typeof aiFeatures[0]) => {
    setSelectedFeature(feature);
    setSelectedCourses([]);
    setIsCourseSelectOpen(true);
  };

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleConfirmCourses = () => {
    if (!selectedFeature) return;
    if (selectedCourses.length === 0) {
      return;
    }

    const selectedCourseNames = courses
      .filter(c => selectedCourses.includes(c.id))
      .map(c => c.title)
      .join("、");

    setCurrentMode(selectedFeature.id);
    const featureMessage: Message = { 
      role: "user", 
      content: `${selectedFeature.prompt}（课程范围：${selectedCourseNames}）` 
    };
    setMessages((prev) => [...prev, featureMessage]);
    setIsLoading(true);
    setIsCourseSelectOpen(false);

    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: `好的，我将针对"${selectedCourseNames}"为您提供${selectedFeature.title}服务。让我分析一下...`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">AI 助教</h1>
        <p className="text-muted-foreground text-lg">获得智能学习辅导和答疑</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 flex flex-col h-[600px]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              对话窗口
              {currentMode !== "general" && (
                <Badge variant="secondary" className="ml-auto">
                  {aiFeatures.find(f => f.id === currentMode)?.title}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>与 AI 助教实时对话</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="输入您的问题..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>快速提问</CardTitle>
              <CardDescription>点击快速开始对话</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-secondary"
                  onClick={() => setInput(question)}
                >
                  <span className="text-sm line-clamp-2">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI 智能功能
              </CardTitle>
              <CardDescription>选择 AI 助教特色功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.id}
                    className="border-border/50 cursor-pointer hover:border-primary/50 transition-all group"
                    onClick={() => startAIFeature(feature)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>基础功能</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>解答学习疑问</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>提供学习资料建议</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>协助作业完成</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>知识点总结梳理</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 课程选择对话框 */}
      <Dialog open={isCourseSelectOpen} onOpenChange={setIsCourseSelectOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature && (
                <>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center`}>
                    <selectedFeature.icon className="w-4 h-4 text-white" />
                  </div>
                  {selectedFeature.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              请选择要分析的课程范围，可以选择多个课程
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleCourseToggle(course.id)}
                  >
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{course.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        授课教师：{course.instructor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseSelectOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleConfirmCourses}
              disabled={selectedCourses.length === 0}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              确认（已选 {selectedCourses.length} 门课程）
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
