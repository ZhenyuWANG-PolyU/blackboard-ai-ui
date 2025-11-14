import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, IdCard, Save, Upload } from "lucide-react";
import axios from "axios";
import { set } from "date-fns";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 个人资料状态
  const [profile, setProfile] = useState({
    avatar: "",
    name: "张三",
    email: "zhangsan@example.com",
    studentId: "2024001",
    phone: "138****8888",
    bio: "热爱学习，积极向上的学生",
    major: "计算机科学与技术",
    grade: "2024级",
  });

  useEffect(() => {
    async function fetchData() {
      let token = localStorage.getItem('token')
      const res = await axios.post('/api/user_verify', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.payload)
      if(res.data.code==20000){
        setProfile({
          avatar: "",
          name: res.data.payload.user_name,
          email: res.data.payload.user_email,
          studentId: res.data.payload.user_id,
          phone: res.data.payload.user_phone, 
          bio: res.data.payload.user_bio, 
          major: res.data.payload.user_major,
          grade: res.data.payload.user_grade,
        })
      }
    }
    fetchData()
  }, [])

  // 编辑状态的临时数据
  const [editForm, setEditForm] = useState(profile);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsSaving(true);

    // 模拟保存操作
    setTimeout(() => {
      setProfile(editForm);
      setIsEditing(false);
      setIsSaving(false);
      toast({
        title: "保存成功",
        description: "您的个人资料已更新",
      });
    }, 1000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">个人资料</h1>
          <p className="text-muted-foreground text-lg">管理您的个人信息</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            编辑资料
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  保存中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  保存
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：头像卡片 */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>头像</CardTitle>
            <CardDescription>上传您的个人头像</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={isEditing ? editForm.avatar : profile.avatar} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                {(isEditing ? editForm.name : profile.name).charAt(0)}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <div className="w-full">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-border rounded-lg hover:bg-secondary transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>上传头像</span>
                  </div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </Label>
              </div>
            )}

            <div className="text-center w-full pt-4 border-t border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {isEditing ? editForm.name : profile.name}
              </h3>
              <p className="text-sm text-muted-foreground">{profile.studentId}</p>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：详细信息 */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>您的个人详细信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  姓名
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  邮箱
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-primary" />
                  学号
                </Label>
                {isEditing ? (
                  <Input
                    id="studentId"
                    value={editForm.studentId}
                    onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.studentId}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  手机号
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">专业</Label>
                {isEditing ? (
                  <Input
                    id="major"
                    value={editForm.major}
                    onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.major}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">年级</Label>
                {isEditing ? (
                  <Input
                    id="grade"
                    value={editForm.grade}
                    onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                  />
                ) : (
                  <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground">
                    {profile.grade}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                  placeholder="介绍一下自己..."
                />
              ) : (
                <div className="px-3 py-2 bg-secondary/50 rounded-md text-foreground min-h-[100px]">
                  {profile.bio}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 学习统计卡片 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>学习统计</CardTitle>
          <CardDescription>您的学习数据概览</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
              <div className="text-sm text-muted-foreground">进行中的课程</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-600 mb-1">28</div>
              <div className="text-sm text-muted-foreground">收藏的资料</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="text-3xl font-bold text-green-600 mb-1">15</div>
              <div className="text-sm text-muted-foreground">完成的作业</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-600 mb-1">156</div>
              <div className="text-sm text-muted-foreground">学习时长(小时)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
