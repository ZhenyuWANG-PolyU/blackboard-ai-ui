import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText, User, Award, MessageSquare, Download } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const GradingDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submissionData = location.state;
  const [downloadurl, setDownloadurl] = useState("");

  async function getFile() {
    let res = await axios.post("/api/file_download",{
      file_name:submissionData.file_url
    },{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.file_download_url);
    setDownloadurl(res.data.file_download_url);
  }
  useEffect(() => {
    getFile();
  }, []);

  if (!submissionData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>未找到批改详情</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              返回
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回作业详情
        </Button>
        <h1 className="text-3xl font-bold">批改详情</h1>
      </div>

      <div className="grid gap-6">
        {/* 基本信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>提交信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">提交时间:</span>
                <span className="font-medium">{submissionData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">用户ID:</span>
                <span className="font-medium">{submissionData.user_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">提交文件:</span>
                <span className="font-medium">{submissionData.file}</span>
              </div>
              {submissionData.file_url && (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={downloadurl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    下载作业文件
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 成绩卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              评分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">
                {submissionData.score}
              </div>
              <Badge variant="secondary" className="text-lg">
                分
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 反馈卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              教师反馈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-foreground">
                {submissionData.feedback || "暂无反馈"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 作业描述卡片 */}
        {submissionData.assign_description && (
          <Card>
            <CardHeader>
              <CardTitle>作业简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {submissionData.assign_description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GradingDetail;
