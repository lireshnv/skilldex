import { AssessmentDef, AssessmentResult } from "../types";
import { makeRng } from "./seed";
import { students } from "./students";
import { skillName } from "./skills";

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

const pythonQuestions: QuizQuestion[] = [
  { id: "q1", text: "What is the output of len([1, 2, [3, 4]])?", options: ["4", "3", "2", "Error"], correctIndex: 1 },
  { id: "q2", text: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "lambda"], correctIndex: 1 },
  { id: "q3", text: "What does the 'self' keyword refer to in a class method?", options: ["The class itself", "The current instance", "A static variable", "The parent class"], correctIndex: 1 },
  { id: "q4", text: "Which data structure does Python's 'dict' implement?", options: ["Array", "Hash map", "Linked list", "Tree"], correctIndex: 1 },
  { id: "q5", text: "What is the time complexity of list indexing in Python?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 2 },
  { id: "q6", text: "Which of these is used for exception handling?", options: ["try/except", "catch/throw", "on error", "handle/raise"], correctIndex: 0 },
  { id: "q7", text: "What does list comprehension [x*2 for x in range(3)] produce?", options: ["[0, 2, 4]", "[1, 2, 3]", "[0, 1, 2]", "[2, 4, 6]"], correctIndex: 0 },
  { id: "q8", text: "Which module is used for working with regular expressions?", options: ["regex", "re", "pyregex", "string"], correctIndex: 1 },
];

const dsaQuestions: QuizQuestion[] = [
  { id: "q1", text: "What is the average time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1 },
  { id: "q2", text: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Heap", "Graph"], correctIndex: 1 },
  { id: "q3", text: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], correctIndex: 2 },
  { id: "q4", text: "Which traversal visits the root node first?", options: ["Inorder", "Postorder", "Preorder", "Level order"], correctIndex: 2 },
  { id: "q5", text: "A hash table provides average-case lookup in:", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 2 },
  { id: "q6", text: "Which algorithm is used to find the shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's algorithm", "Bubble sort"], correctIndex: 2 },
  { id: "q7", text: "A balanced binary search tree guarantees a height of:", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 1 },
  { id: "q8", text: "Dynamic programming is most useful when a problem has:", options: ["Random inputs", "Overlapping subproblems", "No recursion", "Only sorting needs"], correctIndex: 1 },
];

const sqlQuestions: QuizQuestion[] = [
  { id: "q1", text: "Which SQL clause is used to filter grouped results?", options: ["WHERE", "HAVING", "GROUP", "FILTER"], correctIndex: 1 },
  { id: "q2", text: "Which JOIN returns all rows from both tables, matching where possible?", options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], correctIndex: 2 },
  { id: "q3", text: "Which normal form eliminates transitive dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2 },
  { id: "q4", text: "What does the SQL 'INDEX' primarily improve?", options: ["Data integrity", "Query read performance", "Storage compression", "Write speed only"], correctIndex: 1 },
  { id: "q5", text: "Which command removes a table's structure and data entirely?", options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], correctIndex: 1 },
  { id: "q6", text: "A primary key constraint ensures:", options: ["Nullability", "Uniqueness and non-null", "Foreign reference", "Sorting"], correctIndex: 1 },
];

const aptitudeQuestions: QuizQuestion[] = [
  { id: "q1", text: "If a train travels 60 km in 45 minutes, its speed in km/h is:", options: ["70", "80", "75", "90"], correctIndex: 1 },
  { id: "q2", text: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["40", "42", "36", "44"], correctIndex: 1 },
  { id: "q3", text: "A can complete a task in 10 days, B in 15 days. Together they take:", options: ["6 days", "5 days", "8 days", "12 days"], correctIndex: 0 },
  { id: "q4", text: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls?", options: ["15", "20", "25", "18"], correctIndex: 1 },
  { id: "q5", text: "Simple interest on ₹5000 at 10% for 2 years is:", options: ["₹500", "₹1000", "₹1500", "₹5500"], correctIndex: 1 },
];
const commQuestions: QuizQuestion[] = [
  { id: "q1", text: "In a professional email, which tone is most appropriate?", options: ["Casual and abrupt", "Clear, polite and concise", "Overly formal jargon", "Emoji-heavy"], correctIndex: 1 },
  { id: "q2", text: "Active listening primarily involves:", options: ["Waiting for your turn to speak", "Fully concentrating and responding thoughtfully", "Interrupting to clarify", "Taking notes only"], correctIndex: 1 },
  { id: "q3", text: "The best way to handle disagreement in a team meeting is to:", options: ["Avoid the topic entirely", "State your view respectfully with reasoning", "Argue until you win", "Escalate immediately to a manager"], correctIndex: 1 },
  { id: "q4", text: "A strong elevator pitch should be:", options: ["Long and detailed", "Vague but friendly", "Concise, specific and confident", "Purely technical jargon"], correctIndex: 2 },
];

export function questionsFor(skillId: string): QuizQuestion[] {
  if (skillId === "sk-python") return pythonQuestions;
  if (skillId === "sk-dsa") return dsaQuestions;
  if (skillId === "sk-sql") return sqlQuestions;
  if (skillId === "sk-communication") return commQuestions;
  if (skillId === "sk-aptitude" || skillId === "aptitude") return aptitudeQuestions;
  // generic fallback bank, flavored by skill name
  const name = skillName(skillId);
  return Array.from({ length: 6 }, (_, i) => ({
    id: `gq${i + 1}`,
    text: `Which of the following best reflects a core best practice in ${name}?`,
    options: [
      `Applying ${name} concepts without validation`,
      `Following documented best practices and testing thoroughly`,
      `Skipping edge cases to save time`,
      `Avoiding ${name} tools entirely`,
    ],
    correctIndex: 1,
  }));
}

const categories: AssessmentDef["category"][] = ["Technical", "Aptitude", "Soft Skills", "Domain"];
const difficulties: AssessmentDef["difficulty"][] = ["Beginner", "Intermediate", "Advanced"];

const featured: { id: string; title: string; category: AssessmentDef["category"]; skillId: string; difficulty: AssessmentDef["difficulty"] }[] = [
  { id: "asm-01", title: "Python Programming Assessment", category: "Technical", skillId: "sk-python", difficulty: "Intermediate" },
  { id: "asm-02", title: "Data Structures & Algorithms", category: "Technical", skillId: "sk-dsa", difficulty: "Advanced" },
  { id: "asm-03", title: "SQL & Database Fundamentals", category: "Technical", skillId: "sk-sql", difficulty: "Intermediate" },
  { id: "asm-04", title: "Quantitative Aptitude", category: "Aptitude", skillId: "sk-problem-solving", difficulty: "Beginner" },
  { id: "asm-05", title: "Workplace Communication", category: "Soft Skills", skillId: "sk-communication", difficulty: "Beginner" },
  { id: "asm-06", title: "System Design Fundamentals", category: "Technical", skillId: "sk-system-design", difficulty: "Advanced" },
  { id: "asm-07", title: "Java Programming Assessment", category: "Technical", skillId: "sk-java", difficulty: "Intermediate" },
  { id: "asm-08", title: "React & Frontend Engineering", category: "Technical", skillId: "sk-react", difficulty: "Intermediate" },
  { id: "asm-09", title: "Machine Learning Foundations", category: "Technical", skillId: "sk-ml", difficulty: "Advanced" },
  { id: "asm-10", title: "Cloud Computing Essentials", category: "Technical", skillId: "sk-cloud", difficulty: "Intermediate" },
  { id: "asm-11", title: "Data Analytics with Excel & SQL", category: "Technical", skillId: "sk-data-analytics", difficulty: "Beginner" },
  { id: "asm-12", title: "Leadership & Teamwork", category: "Soft Skills", skillId: "sk-teamwork", difficulty: "Beginner" },
  { id: "asm-13", title: "Logical Reasoning", category: "Aptitude", skillId: "sk-critical-thinking", difficulty: "Intermediate" },
  { id: "asm-14", title: "Verbal Ability", category: "Aptitude", skillId: "sk-communication", difficulty: "Beginner" },
  { id: "asm-15", title: "Cybersecurity Fundamentals", category: "Technical", skillId: "sk-cyber", difficulty: "Intermediate" },
  { id: "asm-16", title: "DevOps & CI/CD Practices", category: "Technical", skillId: "sk-devops", difficulty: "Advanced" },
  { id: "asm-17", title: "UI/UX Design Principles", category: "Domain", skillId: "sk-uiux", difficulty: "Beginner" },
  { id: "asm-18", title: "Product Management Basics", category: "Domain", skillId: "sk-productmgmt", difficulty: "Beginner" },
  { id: "asm-19", title: "Software Testing Fundamentals", category: "Technical", skillId: "sk-testing", difficulty: "Beginner" },
  { id: "asm-20", title: "Time Management & Productivity", category: "Soft Skills", skillId: "sk-time-mgmt", difficulty: "Beginner" },
];

export const assessmentDefs: AssessmentDef[] = featured.map((f) => {
  const q = questionsFor(f.skillId);
  return {
    id: f.id,
    title: f.title,
    category: f.category,
    skillId: f.skillId,
    questionCount: Math.max(q.length, 10),
    duration: f.difficulty === "Advanced" ? 35 : f.difficulty === "Intermediate" ? 25 : 15,
    difficulty: f.difficulty,
  };
});

export function assessmentById(id: string) {
  return assessmentDefs.find((a) => a.id === id);
}

const strengthsPool = ["Strong problem decomposition", "Good syntax fluency", "Fast recall of concepts", "Solid fundamentals", "Efficient debugging approach"];
const weaknessPool = ["Edge case handling", "Time complexity optimization", "Advanced concepts need practice", "Speed under time pressure", "Applied problem-solving"];

export const assessmentResults: AssessmentResult[] = students.slice(0, 20).flatMap((student, si) => {
  const rng = makeRng(3000 + si * 9);
  const count = rng.int(1, 3);
  return rng.pickMany(assessmentDefs, count).map((def, ai) => ({
    id: `res-${student.id}-${ai}`,
    studentId: student.id,
    assessmentId: def.id,
    score: rng.int(45, 98),
    accuracy: rng.int(50, 99),
    takenOn: `2026-0${rng.int(1, 8)}-${String(rng.int(1, 27)).padStart(2, "0")}`,
    strengths: rng.pickMany(strengthsPool, 2),
    weaknesses: rng.pickMany(weaknessPool, 2),
  }));
});

export function resultsByStudent(studentId: string) {
  return assessmentResults.filter((r) => r.studentId === studentId);
}

export { categories, difficulties };
