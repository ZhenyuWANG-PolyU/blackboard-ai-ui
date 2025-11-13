import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Mail,
  Smartphone,
  Eye,
  Save
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // 通知设置
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    gradeAlerts: true,
    systemMessages: false,
  });

  // 隐私设置
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  // 外观设置
  const [appearance, setAppearance] = useState({
    darkMode: false,
    language: "zh-CN",
    fontSize: "medium",
  });

  const handleSaveSettings = (settingType: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "设置已保存",
        description: `您的${settingType}已更新`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">设置</h1>
        <p className="text-muted-foreground text-lg">管理您的账户和偏好设置</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="account">账户</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="privacy">隐私</TabsTrigger>
          <TabsTrigger value="appearance">外观</TabsTrigger>
        </TabsList>

        {/* 账户设置 */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>密码和安全</CardTitle>
                  <CardDescription>更新您的密码和安全设置</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">当前密码</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="输入当前密码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="输入新密码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="再次输入新密码"
                />
              </div>
              <Button 
                onClick={() => handleSaveSettings("密码设置")}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Lock className="w-4 h-4 mr-2" />
                更新密码
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>邮箱绑定</CardTitle>
                  <CardDescription>管理您的邮箱地址</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">zhangsan@example.com</p>
                  <p className="text-sm text-muted-foreground">主邮箱 • 已验证</p>
                </div>
                <Button variant="outline" size="sm">修改</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>手机号绑定</CardTitle>
                  <CardDescription>管理您的手机号码</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">138****8888</p>
                  <p className="text-sm text-muted-foreground">已绑定</p>
                </div>
                <Button variant="outline" size="sm">修改</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>通知偏好</CardTitle>
                  <CardDescription>选择您希望接收的通知类型</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-base">邮件通知</Label>
                  <p className="text-sm text-muted-foreground">接收系统邮件通知</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="course-updates" className="text-base">课程更新</Label>
                  <p className="text-sm text-muted-foreground">课程内容更新时通知我</p>
                </div>
                <Switch
                  id="course-updates"
                  checked={notifications.courseUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, courseUpdates: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="assignment-reminders" className="text-base">作业提醒</Label>
                  <p className="text-sm text-muted-foreground">作业截止日期前提醒我</p>
                </div>
                <Switch
                  id="assignment-reminders"
                  checked={notifications.assignmentReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, assignmentReminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="grade-alerts" className="text-base">成绩通知</Label>
                  <p className="text-sm text-muted-foreground">作业评分后通知我</p>
                </div>
                <Switch
                  id="grade-alerts"
                  checked={notifications.gradeAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, gradeAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-messages" className="text-base">系统消息</Label>
                  <p className="text-sm text-muted-foreground">接收系统维护和更新消息</p>
                </div>
                <Switch
                  id="system-messages"
                  checked={notifications.systemMessages}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, systemMessages: checked })
                  }
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => handleSaveSettings("通知设置")}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 隐私设置 */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>隐私控制</CardTitle>
                  <CardDescription>管理您的隐私和可见性设置</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility" className="text-base">个人资料可见</Label>
                  <p className="text-sm text-muted-foreground">让其他用户查看我的个人资料</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={privacy.profileVisibility}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, profileVisibility: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-email" className="text-base">显示邮箱</Label>
                  <p className="text-sm text-muted-foreground">在个人资料中显示邮箱地址</p>
                </div>
                <Switch
                  id="show-email"
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showEmail: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-phone" className="text-base">显示手机号</Label>
                  <p className="text-sm text-muted-foreground">在个人资料中显示手机号码</p>
                </div>
                <Switch
                  id="show-phone"
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showPhone: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-messages" className="text-base">允许消息</Label>
                  <p className="text-sm text-muted-foreground">允许其他用户向我发送消息</p>
                </div>
                <Switch
                  id="allow-messages"
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowMessages: checked })
                  }
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => handleSaveSettings("隐私设置")}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">危险区域</CardTitle>
              <CardDescription>这些操作无法撤销，请谨慎操作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div>
                  <p className="font-medium text-foreground">删除账户</p>
                  <p className="text-sm text-muted-foreground">永久删除您的账户和所有数据</p>
                </div>
                <Button variant="destructive" size="sm">删除账户</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>主题设置</CardTitle>
                  <CardDescription>自定义应用的外观和感觉</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base">深色模式</Label>
                  <p className="text-sm text-muted-foreground">使用深色主题</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={appearance.darkMode}
                  onCheckedChange={(checked) =>
                    setAppearance({ ...appearance, darkMode: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="font-size" className="text-base">字体大小</Label>
                <p className="text-sm text-muted-foreground mb-3">选择舒适的阅读字体大小</p>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <Button
                      key={size}
                      variant={appearance.fontSize === size ? "default" : "outline"}
                      onClick={() => setAppearance({ ...appearance, fontSize: size })}
                      className={appearance.fontSize === size ? "bg-gradient-to-r from-primary to-accent" : ""}
                    >
                      {size === 'small' && '小'}
                      {size === 'medium' && '中'}
                      {size === 'large' && '大'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => handleSaveSettings("外观设置")}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>语言设置</CardTitle>
                  <CardDescription>选择您的首选语言</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">界面语言</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={appearance.language === 'zh-CN' ? "default" : "outline"}
                    onClick={() => setAppearance({ ...appearance, language: 'zh-CN' })}
                    className={appearance.language === 'zh-CN' ? "bg-gradient-to-r from-primary to-accent" : ""}
                  >
                    简体中文
                  </Button>
                  <Button
                    variant={appearance.language === 'en-US' ? "default" : "outline"}
                    onClick={() => setAppearance({ ...appearance, language: 'en-US' })}
                    className={appearance.language === 'en-US' ? "bg-gradient-to-r from-primary to-accent" : ""}
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
