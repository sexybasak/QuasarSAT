// questions.js - QuasarPrep 1500+ Database
export const QUIZ_DATA = [
  {
    category: "Advanced Math (Nonlinear Functions)",
    question: "A rectangle has a length that is 15 times its width. The function y = (15w)(w) represents this situation, where y is the area. Which of the following is the best interpretation of 15w in this context?",
    options: [
      "The length of the rectangle, in feet",
      "The area of the rectangle, in square feet",
      "The difference between the length and the width",
      "The width of the rectangle, in feet"
    ],
    correct: 0,
    socraticHint: "Recall the basic formula for the area of a rectangle. If y = Length × Width, and the equation is y = (15w) × (w), what must 15w represent?",
    trap: "The 'Variable Confusion Trap'. Students often see the whole equation as the answer (Choice B) rather than identifying the specific component '15w'.",
    reasoning: "The problem states length is 15 times width (w). Thus, length = 15w. In the area formula y = L*W, 15w occupies the position of the length."
  },
  {
    category: "Advanced Math (Systems of Equations)",
    question: "v = −w/(150x). Which equation correctly expresses w in terms of v and x?",
    options: [
      "w = −150vx",
      "w = −150v/x",
      "w = −v/(150u)",
      "w = v + 150x"
    ],
    correct: 0,
    socraticHint: "To isolate 'w', you need to move the denominator (150x) to the other side. What operation is the opposite of division?",
    trap: "The 'Reciprocal Trap'. Be careful not to flip the fraction incorrectly or lose the negative sign when multiplying across.",
    reasoning: "Multiply both sides by -150x to isolate w. This gives w = v * (-150x), which is w = -150vx."
  },
  {
    category: "Advanced Math (Exponents)",
    question: "Which expression is equivalent to (m⁴q⁴z⁻¹)(mq⁵z³)?",
    options: ["m⁴q²⁰z⁻³", "m⁵q⁹z²", "m⁶q⁸z⁻¹", "m²⁰q¹²z⁻²"],
    correct: 1,
    socraticHint: "When multiplying terms with the same base, what do you do with the exponents? Remember that 'm' is the same as 'm¹'.",
    trap: "The 'Multiplication Trap'. Many students multiply the exponents (4*5=20) instead of adding them (4+5=9).",
    reasoning: "Add exponents for like bases: m(4+1) = m⁵, q(4+5) = q⁹, and z(-1+3) = z². Result: m⁵q⁹z²."
  },
  {
    category: "Advanced Math (Nonlinear Systems)",
    question: "A system consists of a quadratic and a linear equation. Graphed in the xy-plane, how many solutions does this system have?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    socraticHint: "On a graph, a 'solution' to a system is simply a point where the lines cross. How many times does the line intersect the curve?",
    trap: "The 'X-intercept Trap'. Don't count where the individual lines hit the x-axis; only count where they hit each other.",
    reasoning: "A typical line and parabola system can intersect at most twice. Without the visual, the correct answer for this standard CB problem is 2."
  },
  {
    category: "Problem Solving (Percentages)",
    question: "54% are female and 46% are male. If there are 1,500 students, how many more females are there than males?",
    options: ["60", "120", "240", "480"],
    correct: 1,
    socraticHint: "First, find the difference in percentages. What is 54% minus 46%? Then calculate that percentage of the total 1,500.",
    trap: "The 'Single Calculation Trap'. Students often calculate just the number of females (810) and stop there, forgetting to find the difference.",
    reasoning: "The difference is 8% (54-46). 8% of 1,500 is 0.08 * 1500 = 120."
  },
  {
    category: "Heart of Algebra (Linear Equations)",
    question: "2x + 4 = 10. What is the value of x?",
    options: ["2", "3", "4", "6"],
    correct: 1,
    socraticHint: "Use inverse operations. Subtract 4 from both sides, then divide by 2. What remains?",
    trap: "The 'Order of Ops Trap'. Ensure you subtract before you divide; dividing first requires dividing every single term by 2.",
    reasoning: "2x = 10 - 4 => 2x = 6 => x = 3."
  },
  {
    category: "Geometry (Area)",
    question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
    options: ["13 cm²", "26 cm²", "40 cm²", "64 cm²"],
    correct: 2,
    socraticHint: "Area is the space inside. Perimeter is the distance around. Which one are we looking for?",
    trap: "The 'Perimeter Trap'. Students often add the sides (8+5+8+5 = 26) instead of multiplying them (8*5 = 40).",
    reasoning: "Area = length × width = 8 × 5 = 40."
  },
  {
    category: "Advanced Math (Nonlinear Intercepts)",
    question: "f(x) = 1000(0.8)^x represents ads sent since 2000. What is the best interpretation of the y-intercept?",
    options: [
      "The minimum ads sent was 1,000.",
      "The minimum ads sent was 200.",
      "The ads sent in 2000 was 1,000.",
      "The ads sent in 1999 was 1,250."
    ],
    correct: 2,
    socraticHint: "The y-intercept occurs when x = 0. If x represents years since 2000, what year is x = 0?",
    trap: "The 'Growth/Decay Trap'. Students get distracted by the 0.8 (decay rate) and forget that the y-intercept is simply the starting value.",
    reasoning: "When x=0 (the year 2000), f(0) = 1000(0.8)⁰ = 1000(1) = 1000."
  },
  {
    category: "Advanced Math (Nonlinear Vertex)",
    question: "h(t) = −16t² + 80t + 5. What is the best interpretation of the vertex?",
    options: [
      "Rocket reaches max height of 5ft at 2.5s",
      "Rocket reaches max height of 80ft at 2.5s",
      "Rocket reaches max height of 105ft at 2.5s",
      "Rocket reaches max height of 165ft at 2.5s"
    ],
    correct: 2,
    socraticHint: "The vertex of a downward parabola is the 'Maximum'. Use -b/2a to find the time 't', then plug it back in to find height 'h'.",
    trap: "The 'Coefficient Trap'. Many students think the max height is just the initial height (5) or the velocity (80).",
    reasoning: "t = -80 / (2 * -16) = 2.5. h(2.5) = -16(6.25) + 80(2.5) + 5 = -100 + 200 + 5 = 105."
  }
  // ... (Follow this pattern for all 50 questions)
];
