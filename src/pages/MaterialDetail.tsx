import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Share2,
  Calendar,
  User,
  BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const MaterialDetail = () => {
  const { materialTitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mymaterial = location.state;

  // 模拟资料详情数据
  const [material, setMaterial] = useState({
    id: mymaterial?.id || 1,
    name: mymaterial?.title || "unknown",
    course: mymaterial?.course || "unknown",
    instructor: mymaterial?.course_teacher || "unknown",
    type: mymaterial?.type || "unknown",
    size: mymaterial?.size || "unknown",
    uploadDate: mymaterial?.date || "unknown",
    description: "AI总结中...",
    content: "AI预览中...",
    downloads: mymaterial?.download_times || 0,
    views: mymaterial?.look_times || 0,
    score: mymaterial?.score || 0,
  });
  async function getDescription() {
    let res = await axios.post("/api/zongjie_file", {
      url: material.id
    });
    // console.log(res.data.response);
    setMaterial(prevMaterial => ({
      ...prevMaterial,
      description: res.data.response
    }));
  }
  async function getContent() {
    let res = await axios.post("/api/yulan_file", {
      url: material.id
    });
    console.log(res.data.response);
    setMaterial(prevMaterial => ({
      ...prevMaterial,
      content: res.data.response
    }));
  }
  useEffect(() => {
    getDescription();
    getContent();
    // console.log(material)
  }, []);

  return (
    <div className="space-y-6">
      {/* 返回按钮和标题 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/materials")}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">{material.name}</h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{material.course}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{material.instructor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 资料信息卡片 */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{material.name}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary">{material.type}</Badge>
                  <span>{material.size}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>上传于 {material.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Download className="w-4 h-4 mr-2" />
              下载资料
            </Button>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              在线预览
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{material.views}</div>
              <div className="text-sm text-muted-foreground">浏览次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{material.downloads}</div>
              <div className="text-sm text-muted-foreground">下载次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{material.score}</div>
              <div className="text-sm text-muted-foreground">评分</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 资料描述 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>资料描述</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
            <ReactMarkdown>{material.description}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* 内容预览 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>内容预览</CardTitle>
          <CardDescription>以下是资料的部分内容预览</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap bg-secondary/30 p-6 rounded-lg text-sm text-foreground leading-relaxed">
              <ReactMarkdown>{material.content}</ReactMarkdown>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 相关资料推荐 */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>相关资料推荐</CardTitle>
          <CardDescription>您可能也感兴趣的资料</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "监督学习算法.pptx", course: "人工智能基础", type: "PPT" },
              { name: "Python数据处理.pdf", course: "数据分析", type: "PDF" },
              { name: "神经网络基础.pdf", course: "深度学习", type: "PDF" },
            ].map((item, index) => (
              <Card key={index} className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground mb-1 truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.course}</span>
                        <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialDetail;
