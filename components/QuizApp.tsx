import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const questions = [
  {
    question: "Who confirmed Indian fighter jet losses during Operation Sindoor?",
    options: ["Air Marshal A.K. Bharti", "CDS General Anil Chauhan", "General Shamshad Mirza", "Amit Shah"],
    answer: 1,
  },
  {
    question: "What was the objective of Operation Sindoor?",
    options: ["Air strike on China", "Evacuation from Afghanistan", "Retaliation against the Pahalgam terror attack", "Rescue from floods in Northeast India"],
    answer: 2,
  },
  // Add remaining questions here...
];

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const handleSubmit = () => {
    setAnswers([...answers, selected]);
    setSelected(null);
    setCurrent(current + 1);
  };

  const summary = () => {
    let correct = 0, incorrect = 0, unattempted = 0;
    questions.forEach((q, i) => {
      if (answers[i] === undefined || answers[i] === null) unattempted++;
      else if (answers[i] === q.answer) correct++;
      else incorrect++;
    });
    return { correct, incorrect, unattempted };
  };

  const pieData = Object.entries(summary()).map(([name, value]) => ({ name, value }));
  const COLORS = ["#22c55e", "#ef4444", "#eab308"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {current < questions.length ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Question {current + 1} of {questions.length}</h2>
              <p className="text-lg font-medium mb-4">{questions[current].question}</p>
              <div className="space-y-2">
                {questions[current].options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant={selected === idx ? "default" : "outline"}
                    className={\`w-full justify-start \${selected !== null && idx === questions[current].answer ? "border-green-500" : ""} \${selected !== null && idx === selected && idx !== questions[current].answer ? "border-red-500" : ""}\`}
                    onClick={() => setSelected(idx)}
                    disabled={selected !== null}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              {selected !== null && (
                <Button className="mt-6 w-full" onClick={handleSubmit}>
                  Next Question
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {Object.entries(summary()).map(([key, val], i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 shadow">
                  <p className="text-xl font-semibold capitalize">{key}</p>
                  <p className="text-2xl font-bold">{val}</p>
                </div>
              ))}
            </div>
            <PieChart width={300} height={250}>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </motion.div>
        )}
      </div>
    </div>
  );
}
