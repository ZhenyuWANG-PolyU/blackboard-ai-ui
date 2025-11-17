import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { describe } from "node:test";
import { Description } from "@radix-ui/react-toast";
import { set } from "date-fns";

const Assignments = () => {
  const navigate = useNavigate();

  const [allAssignments, setAllAssignments] = useState([]);

  async function fetchAssignments() {
    let res = await axios.post("/api/getallhomework", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    console.log(res.data.assignments);
    let fetchedAssignments = [];
    for (let i = 0; i < res.data.assignments.length; i++) {
      let asg = res.data.assignments[i];
      fetchedAssignments.push({
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
        submittedDate: asg.submit_date,
        completed: asg.score !== "未完成"
      });
    }
    setAllAssignments(fetchedAssignments);
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

      <div className="space-y-4">
        {allAssignments.map((assignment, index) => (
          <Card
            key={index}
            className="border-border/50 hover:shadow-md transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                    assignment.completed
                      ? 'from-green-500 to-emerald-500'
                      : assignment.urgent
                      ? 'from-orange-500 to-red-500'
                      : 'from-primary to-accent'
                  } flex items-center justify-center flex-shrink-0`}>
                    {assignment.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{assignment.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                      <span>{assignment.course}</span>
                      {assignment.completed ? (
                        <>
                          <span>•</span>
                          <span>提交时间: {assignment.submittedDate}</span>
                          <span>•</span>
                          <span>分数: {assignment.score}</span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className={assignment.urgent ? 'text-destructive font-medium' : ''}>
                              截止: {assignment.deadline}
                            </span>
                          </div>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={assignment.completed ? "secondary" : assignment.urgent ? "destructive" : "secondary"}>
                  {assignment.completed ? "已完成" : assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {assignment.completed ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/assignments/${assignment.id}/grading`, { state: assignment })}
                  >
                    查看评价详情
                  </Button>
                ) : (
                  <>
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      onClick={() => navigate(`/assignments/${assignment.id}`, { state: assignment })}
                    >
                      开始作业
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/assignments/${assignment.id}`, { state: assignment })}
                    >
                      查看详情
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
