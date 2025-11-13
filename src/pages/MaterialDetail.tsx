import { useParams, useNavigate } from "react-router-dom";
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

const MaterialDetail = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();

  // 模拟资料详情数据
  const material = {
    id: materialId,
    name: "机器学习导论.pdf",
    course: "人工智能基础",
    instructor: "张教授",
    type: "PDF",
    size: "2.3 MB",
    uploadDate: "2024-01-15",
    description: "本资料详细介绍了机器学习的基本概念、核心算法和实际应用。包括监督学习、非监督学习和强化学习三大类别，以及常用的算法如线性回归、决策树、神经网络等。",
    content: `
# 机器学习导论

## 第一章：机器学习概述

### 1.1 什么是机器学习
机器学习是人工智能的一个分支，它使计算机能够从数据中学习并做出决策或预测，而无需明确编程。

### 1.2 机器学习的类型
1. **监督学习**：从标记的训练数据中学习
2. **非监督学习**：从未标记的数据中发现模式
3. **强化学习**：通过与环境交互来学习

### 1.3 机器学习的应用
- 图像识别
- 自然语言处理
- 推荐系统
- 预测分析

## 第二章：线性回归

### 2.1 基本概念
线性回归是一种用于建模因变量和一个或多个自变量之间线性关系的统计方法。

### 2.2 数学模型
y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε

### 2.3 实现步骤
1. 数据收集与预处理
2. 模型训练
3. 参数估计
4. 模型评估
    `,
    downloads: 156,
    views: 523,
  };

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
              <div className="text-2xl font-bold text-primary">4.8</div>
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
          <p className="text-muted-foreground leading-relaxed">{material.description}</p>
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
              {material.content}
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
