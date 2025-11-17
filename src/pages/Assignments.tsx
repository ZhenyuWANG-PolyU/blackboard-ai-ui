import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { describe } from "node:test";
import { Description } from "@radix-ui/react-toast";
import { set } from "date-fns";

const Assignments = () => {
  const navigate = useNavigate();

  const [pendingAssignments, setPendingAssignments] = useState([
    {
      title: "机器学习项目实现",
      course: "人工智能基础",
      deadline: "2024-01-20",
      status: "进行中",
      urgent: true,
      id: "0",
      submittedDate: "2024-01-18"
    },
  ]);

  const [completedAssignments, setCompletedAssignments] = useState([
    {
      title: "线性回归分析报告",
      course: "人工智能基础",
      submittedDate: "2024-01-10",
      score: "95",
      id: "0"
    },
    {
      title: "排序算法实现",
      course: "算法设计",
      submittedDate: "2024-01-08",
      score: "88",
      id: "1"
    },
  ]);

  async function fetchAssignments() {
    let res = await axios.post("/api/getallhomework", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.assignments);
    let fetchedAssignments = [];
    let fetchedCompletedAssignments = [];

    let res6 = await axios.post("/api/select_activity_date_by_user_id", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    let activityFinishTimes = res6.data.activity_finish_times;

    for (let i = 0; i < res.data.assignments.length; i++) {
      let asg = res.data.assignments[i];
      asg.status = "未提交";
      asg.urgent = true;
      for (let aft of activityFinishTimes) {
        if (aft.activity_id === asg.id) {
          asg.submit_date = aft.finish_time.split(' ')[0];
          asg.status = "已提交";
          asg.urgent = false;
        }
      }
      if (1 === 1) {
        fetchedAssignments.push({
          title: asg.name,
          course: asg.course_name,
          deadline: asg.deadline,
          status: asg.status,
          urgent: asg.urgent,
          fabu_time: asg.fabu_time,
          huanjingyaoqiu: asg.huanjingyaoqiu1,
          id: asg.id,
          description: asg.description,
          score: "0",
          teacher_name: asg.teacher_name,
          yaoqiu: asg.yaoqiu,
          submittedDate: asg.submit_date
        });
      } else {
        fetchedCompletedAssignments.push({
          title: asg.name,
          course: asg.course_name,
          deadline: asg.deadline,
          status: asg.status,
          urgent: false,
          fabu_time: asg.fabu_time,
          huanjingyaoqiu: asg.huanjingyaoqiu1,
          id: asg.id,
          description: asg.description,
          score: asg.score,
          teacher_name: asg.teacher_name,
          yaoqiu: asg.yaoqiu,
          submittedDate: asg.submit_date
        });
      }

    }
    setCompletedAssignments(fetchedCompletedAssignments);
    setPendingAssignments(fetchedAssignments);
  }

  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">在线作业</h1>
        <p className="text-muted-foreground text-lg">管理您的作业</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        {/* <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">待完成</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList> */}

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.map((assignment, index) => (
            <Card
              key={index}
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/assignments/${assignment.id}`, { state: assignment })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${assignment.urgent ? 'from-red-500 to-orange-500' : 'from-primary to-accent'
                      } flex items-center justify-center flex-shrink-0`}>
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{assignment.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                        <span>{assignment.course}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className={assignment.urgent ? 'text-destructive font-medium' : ''}>
                            截止: {assignment.deadline}
                          </span>
                          {assignment.status === "已提交" && (
                            <>
                              <span>•</span>
                              <span>提交于: {assignment.submittedDate}</span>
                            </>
                          )}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={assignment.urgent ? "destructive" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assignments/${assignment.id}`, { state: assignment });
                    }}
                  >
                    开始作业
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assignments/${assignment.id}`, { state: assignment });
                    }}
                  >
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.map((assignment, index) => (
            <Card
              key={index}
              className="border-border/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/assignments/${assignment.id}`, { state: assignment })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{assignment.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <span>{assignment.course}</span>
                        <span>•</span>
                        <span>提交于: {assignment.submittedDate}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{assignment.score}</div>
                    <div className="text-xs text-muted-foreground">分数</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/assignments/${assignment.id}`, { state: assignment });
                  }}
                >
                  查看评测详情
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
