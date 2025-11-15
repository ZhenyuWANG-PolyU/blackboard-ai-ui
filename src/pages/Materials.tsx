import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Materials = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([
    { title: "机器学习导论.pdf", course: "人工智能基础", size: "2.3 MB", date: "2024-01-15" },
    { title: "算法设计课件.pptx", course: "算法设计", size: "5.1 MB", date: "2024-01-14" },
    { title: "数据结构笔记.docx", course: "数据结构", size: "1.8 MB", date: "2024-01-13" },
    { title: "Python编程实战.pdf", course: "编程基础", size: "4.2 MB", date: "2024-01-12" },
    { title: "深度学习论文集.pdf", course: "深度学习", size: "8.7 MB", date: "2024-01-11" },
    { title: "线性代数复习资料.pdf", course: "数学基础", size: "3.5 MB", date: "2024-01-10" },
  ]);

  async function fetchMaterials() {
    const res = await axios.post("/api/getallmaterials",{},{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.materials);
    let fetchedMaterials = [];
    for (let i=0;i<res.data.materials.length;i++) {
      let mat = res.data.materials[i];
      if(mat.id) {
        fetchedMaterials.push({
          title: mat.name,
          course: mat.course_name,
          size: mat.size,
          date: mat.update_time ? mat.update_time.split('T')[0] : '',
          id: mat.id,
          type: mat.type,
          score: mat.score,
          completed: mat.completed,
          look_times: mat.look_times,
          course_teacher: mat.course_teacher,
          download_times: mat.download_times,
        });
      }
    }
    setMaterials(fetchedMaterials);
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">学习资料</h1>
        <p className="text-muted-foreground text-lg">查找和管理您的课程资料</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索资料..."
                className="pl-10"
              />
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {materials.map((material, index) => (
          <Card
            key={index}
            className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/materials/${material.title}`, { state: material })}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 truncate">{material.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span>{material.course}</span>
                    <span>•</span>
                    <span>{material.size}</span>
                    <span>•</span>
                    <span>{material.date}</span>
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 下载逻辑
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Materials;
