// questions.js - QuasarPrep 1500+ Cognitive Database
export const QUIZ_DATA = [
  {
    id: "CB_MATH_001",
    domain: "Advanced Math",
    skill: "Nonlinear functions",
    question_text: "A rectangle has a length that is $15$ times its width. The function $y = (15w)(w)$ represents this situation, where $y$ is the area, in square feet, of the rectangle and $y > 0$.",
    question: "Which of the following is the best interpretation of $15w$ in this context?",
    choices: {
      "A": "The length of the rectangle, in feet",
      "B": "The area of the rectangle, in square feet",
      "C": "The difference between the length and the width, in feet",
      "D": "The width of the rectangle, in feet"
    },
    correct_answer: "A",
    socraticHint: "The area of a rectangle is defined as $Area = Length \\times Width$. If the equation is $y = (15w) \\times (w)$, which part corresponds to the length?",
    trap: "The 'Equation Confusion Trap'. Students often see the whole function and pick 'Area', but the question asks only for the component $15w$.",
    reasoning: "Given $Length = 15 \\times Width$ and $Width = w$, it follows that $Length = 15w$. In the area formula $L \\cdot W$, $15w$ is the length."
  },
  {
    id: "CB_MATH_002",
    domain: "Advanced Math",
    skill: "Nonlinear equations",
    question_text: "The relationship between variables is given by $v = -\\frac{w}{150x}$, where $v, w,$ and $x$ are distinct positive numbers.",
    question: "Which equation correctly expresses $w$ in terms of $v$ and $x$?",
    choices: {
      "A": "$w = -150vx$",
      "B": "$w = -\\frac{150v}{x}$",
      "C": "$w = -\\frac{v}{150x}$",
      "D": "$w = v + 150x$"
    },
    correct_answer: "A",
    socraticHint: "To isolate $w$, you must 'undo' the division by $150x$ and the negative sign. What operation is the inverse of division?",
    trap: "The 'Fraction Flip Trap'. Students often accidentally move variables to the denominator when they should be in the numerator during cross-multiplication.",
    reasoning: "Multiply both sides by $150x$ to get $150vx = -w$. Multiply by $-1$ to get $w = -150vx$."
  },
  {
    id: "CB_MATH_003",
    domain: "Advanced Math",
    skill: "Equivalent expressions",
    question_text: "Consider the expression $(m^4 q^4 z^{-1})(m q^5 z^3)$, where $m, q,$ and $z$ are positive numbers.",
    question: "Which of the following is equivalent to the expression above?",
    choices: {
      "A": "$m^4 q^{20} z^{-3}$",
      "B": "$m^5 q^9 z^2$",
      "C": "$m^6 q^8 z^{-1}$",
      "D": "$m^{20} q^{12} z^{-2}$"
    },
    correct_answer: "B",
    socraticHint: "When multiplying terms with the same base, such as $m^4$ and $m^1$, what is the rule for their exponents?",
    trap: "The 'Multiplication Mistake'. A common error is multiplying exponents ($4 \\times 5 = 20$) instead of adding them ($4 + 5 = 9$).",
    reasoning: "Add exponents for like bases: $m^{(4+1)} = m^5$, $q^{(4+5)} = q^9$, and $z^{(-1+3)} = z^2$. This yields $m^5 q^9 z^2$."
  },
  {
    id: "CB_MATH_004",
    domain: "Advanced Math",
    skill: "Systems of equations",
    question_text: "A system consists of a quadratic equation and a linear equation graphed in the $xy$-plane.",
    question: "If the line and the parabola intersect at two distinct points, how many solutions does this system have?",
    choices: {
      "A": "$0$",
      "B": "$1$",
      "C": "$2$",
      "D": "$3$"
    },
    correct_answer: "C",
    socraticHint: "Recall that in a coordinate plane, the 'solutions' to a system of equations correspond to the points of intersection. How many intersections are described?",
    trap: "The 'Intercept Distraction'. Do not confuse the $x$-intercepts of the individual graphs with the solutions of the system.",
    reasoning: "The points where the two graphs intersect are the only points that satisfy both equations simultaneously. Two intersections mean two solutions."
  },
  {
    id: "CB_MATH_007",
    domain: "Data Analysis",
    skill: "Percentages",
    question_text: "In a school of $1,500$ students, $54\\%$ are female and $46\\%$ are male.",
    question: "How many more female students are there than male students?",
    choices: {
      "A": "$60$",
      "B": "$120$",
      "C": "$240$",
      "D": "$480$"
    },
    correct_answer: "B",
    socraticHint: "You could calculate the total number of females and males separately, OR find the percentage difference first. What is $54\\% - 46\\%$?",
    trap: "The 'Partial Step Trap'. Many students calculate the number of females ($810$) and stop there, forgetting the question asks for the *difference*.",
    reasoning: "The difference in percentage is $8\\%$. $0.08 \\times 1,500 = 120$."
  },
  {
    id: "CB_MATH_011",
    domain: "Advanced Math",
    skill: "Quadratic Equations",
    question_text: "Consider the quadratic equation $x^2 - 5x + 6 = 0$.",
    question: "Which values of $x$ satisfy the equation?",
    choices: {
      "A": "$2$ and $4$",
      "B": "$2$ and $3$",
      "C": "$3$ and $4$",
      "D": "$1$ and $6$"
    },
    correct_answer: "B",
    socraticHint: "Look for two numbers that multiply to $+6$ and add to $-5$. What are the factors of $(x - r_1)(x - r_2)$?",
    trap: "The 'Sign Swap Trap'. Students often find the factors $(x-2)(x-3)$ and mistakenly choose $-2$ and $-3$ as the solutions.",
    reasoning: "Factoring gives $(x-2)(x-3)=0$. Setting each factor to zero gives $x=2$ and $x=3$."
  },
  {
    id: "CB_MATH_012",
    domain: "Advanced Math",
    skill: "Discriminants",
    question_text: "Examine the equation $x^2 - 4x + 4 = 0$.",
    question: "How many distinct real solutions are there to this equation?",
    choices: {
      "A": "Exactly one",
      "B": "Exactly two",
      "C": "Infinitely many",
      "D": "Zero"
    },
    correct_answer: "A",
    socraticHint: "Calculate the discriminant $b^2 - 4ac$. If the discriminant is zero, what does that tell you about the number of roots?",
    trap: "The 'Quadratic Assumption'. Students often assume all quadratics have two solutions without checking if it's a perfect square.",
    reasoning: "Discriminant: $(-4)^2 - 4(1)(4) = 16 - 16 = 0$. A discriminant of $0$ indicates exactly one unique real solution."
  },
  {
    id: "CB_MATH_013",
    domain: "Passport to Advanced Math",
    skill: "Radical Equations",
    question_text: "Given the equation $\\sqrt{x + 5} = 3$.",
    question: "What is the value of $x$?",
    choices: {
      "A": "$1$",
      "B": "$2$",
      "C": "$3$",
      "D": "$4$"
    },
    correct_answer: "D",
    socraticHint: "How do you 'undo' a square root? Apply that operation to both sides of the equation first.",
    trap: "The 'Square Root Confusion'. Some students subtract $5$ before squaring, which violates the order of operations for radical isolation.",
    reasoning: "Square both sides: $x + 5 = 3^2 \\Rightarrow x + 5 = 9$. Subtracting $5$ gives $x = 4$."
  },
  {
    id: "CB_MATH_015",
    domain: "Advanced Math",
    skill: "Function Evaluation",
    question_text: "If $f(x) = 2x^2 - 3x + 5$.",
    question: "What is the value of $f(3)$?",
    choices: {
      "A": "$12$",
      "B": "$14$",
      "C": "$16$",
      "D": "$18$"
    },
    correct_answer: "B",
    socraticHint: "Replace every $x$ in the expression with a $3$. Remember to square the $3$ before multiplying by $2$.",
    trap: "The 'PEMDAS Error'. Students often multiply $2 \\times 3$ first and then square it, leading to $6^2 = 36$. Always square before multiplying.",
    reasoning: "$f(3) = 2(3^2) - 3(3) + 5 = 2(9) - 9 + 5 = 18 - 9 + 5 = 14$."
  },
  {
    id: "CB_MATH_019",
    domain: "Advanced Math",
    skill: "Nonlinear functions",
    question_text: "The function $h$ is defined as $h(x) = (x - 2)(x - t)$. The graph of $y = h(x)$ intersects the $x$-axis at $(2, 0)$ and $(8, 0)$.",
    question: "What is the value of the constant $t$?",
    choices: {
      "A": "$1$",
      "B": "$2$",
      "C": "$4$",
      "D": "$8$"
    },
    correct_answer: "D",
    socraticHint: "The $x$-intercepts of a factored quadratic $(x - r_1)(x - r_2)$ are $r_1$ and $r_2$. If one intercept is $8$, what must $t$ be?",
    trap: "The 'Sign Flip Trap'. Be careful to distinguish between the factor $(x - t)$ and the root $t$.",
    reasoning: "The roots are the values of $x$ that make $h(x) = 0$. Since the graph hits the axis at $x=8$, then $(8-t)$ must equal $0$, so $t=8$."
  },
  {
    id: "CB_MATH_022",
    domain: "Passport to Advanced Math",
    skill: "Functions",
    question_text: "Let $f(x) = 3x - 2$ and $g(x) = x + 5$.",
    question: "What is the value of $f(g(2))$?",
    choices: {
      "A": "$15$",
      "B": "$17$",
      "C": "$19$",
      "D": "$21$
    },
    correct_answer: "C",
    socraticHint: "This is a nested function. Work from the 'inside out'. First, what is $g(2)$? Then plug that result into $f(x)$.",
    trap: "The 'Order of Operations'. Many students try to multiply $f$ and $g$ instead of substituting one into the other.",
    reasoning: "$g(2) = 2 + 5 = 7$. Now find $f(7)$: $3(7) - 2 = 21 - 2 = 19$."
  },
  {
    id: "CB_MATH_023",
    domain: "Advanced Math",
    skill: "Equivalent expressions",
    question_text: "Which of the following is equivalent to $(x + 3)^2$?",
    choices: {
      "A": "$x^2 + 6x + 9$",
      "B": "$x^2 + 9$",
      "C": "$x^2 + 3x + 9$",
      "D": "$x^2 + 6x$"
    },
    correct_answer: "A",
    socraticHint: "Expanding a binomial $(a + b)^2$ results in $a^2 + 2ab + b^2$. What is $2 \\times x \\times 3$?",
    trap: "The 'Exponent Distribution Trap'. The most common error in high-level SAT math is assuming $(x+3)^2 = x^2 + 3^2$. You must include the middle term!",
    reasoning: "$(x+3)(x+3) = x^2 + 3x + 3x + 9 = x^2 + 6x + 9$."
  },
  {
    id: "CB_MATH_027",
    domain: "Geometry",
    skill: "Triangles",
    question_text: "A triangle has interior angles measuring $45^{\\circ}, 60^{\\circ},$ and $x^{\\circ}$.",
    question: "What is the value of $x$?",
    choices: {
      "A": "$60$",
      "B": "$75$",
      "C": "$90$",
      "D": "$105$"
    },
    correct_answer: "B",
    socraticHint: "What is the universal constant for the sum of all interior angles in any triangle?",
    trap: "The 'Arithmetic Oversight'. Ensure you subtract the sum of the known angles from $180$ correctly.",
    reasoning: "The sum of angles is $180^{\\circ}$. $180 - (45 + 60) = 180 - 105 = 75$."
  },
  {
    id: "CB_MATH_030",
    domain: "Advanced Math",
    skill: "Exponents and Radicals",
    question_text: "Consider the radical expression $\\sqrt[3]{8x^3}$.",
    question: "Which of the following is equivalent to the expression above?",
    choices: {
      "A": "$2x$",
      "B": "$2x^{1/3}$",
      "C": "$8x$",
      "D": "$2^3x$"
    },
    correct_answer: "A",
    socraticHint: "The cube root $\\sqrt[3]{\\dots}$ asks: 'What multiplied by itself three times equals this?' What is the cube root of $8$ and the cube root of $x^3$?",
    trap: "The 'Square Root Habit'. Students often see a root and think 'square root', leading them to pick $4$ or keep the exponent $1/3$ unnecessarily.",
    reasoning: "$\\sqrt[3]{8} = 2$ because $2 \\times 2 \\times 2 = 8$. $\\sqrt[3]{x^3} = x$. Thus, the result is $2x$."
  },
  {
    id: "CB_MATH_032",
    domain: "Advanced Math",
    skill: "Polynomials",
    question_text: "The function $f(x) = ax^2 + bx + c$ is given. In which form is the $y$-coordinate of the $y$-intercept displayed as a constant?",
    question: "I. $f(0) = c$ | II. $f(0) = \\frac{pq}{a}$",
    choices: {
      "A": "I only",
      "B": "II only",
      "C": "I and II",
      "D": "Neither I nor II"
    },
    correct_answer: "A",
    socraticHint: "The $y$-intercept occurs where $x = 0$. If you plug $0$ into $ax^2 + bx + c$, which term remains as a visible constant?",
    trap: "The 'Complexity Trap'. Choice II looks sophisticated, but the standard form $ax^2 + bx + c$ explicitly shows the intercept as the constant term $c$.",
    reasoning: "In $f(x) = ax^2 + bx + c$, $f(0) = a(0)^2 + b(0) + c = c$. Thus, $c$ is the $y$-intercept."
  },
  {
    id: "CB_MATH_035",
    domain: "Advanced Math",
    skill: "Equivalent expressions",
    question_text: "Which of the following is equivalent to $x^2 - 9$?",
    choices: {
      "A": "$(x - 3)^2$",
      "B": "$(x - 3)(x + 3)$",
      "C": "$(x - 9)(x + 1)$",
      "D": "$(x + 3)^2$"
    },
    correct_answer: "B",
    socraticHint: "This is a 'Difference of Squares' pattern: $a^2 - b^2$. How does that pattern factor?",
    trap: "The 'Perfect Square Confusion'. Students often confuse $x^2 - 9$ (Difference of Squares) with $(x-3)^2$ (Perfect Square Trinomial).",
    reasoning: "$x^2 - 9 = x^2 - 3^2$. The factoring pattern is $(a-b)(a+b)$, so $(x-3)(x+3)$."
  },
  {
    id: "CB_MATH_037",
    domain: "Heart of Algebra",
    skill: "Linear Equations",
    question_text: "A line passes through the points $(1, 2)$ and $(3, 8)$.",
    question: "What is the slope ($m$) of this line?",
    choices: {
      "A": "$2$",
      "B": "$3$",
      "C": "$4$",
      "D": "$6$"
    },
    correct_answer: "B",
    socraticHint: "Slope is defined as $\\frac{rise}{run}$, or $\\frac{y_2 - y_1}{x_2 - x_1}$. What is the difference in $y$ divided by the difference in $x$?",
    trap: "The 'Reciprocal Slope Trap'. Be careful not to put the change in $x$ over the change in $y$.",
    reasoning: "Slope $m = \\frac{8 - 2}{3 - 1} = \\frac{6}{2} = 3$."
  },
  {
    id: "CB_MATH_040",
    domain: "Advanced Math",
    skill: "Nonlinear Equations",
    question_text: "Determine the number of distinct real solutions for $x^2 - 4x + 5 = 0$.",
    choices: {
      "A": "Exactly two",
      "B": "Exactly one",
      "C": "Zero",
      "D": "Infinitely many"
    },
    correct_answer: "C",
    socraticHint: "Check the discriminant $b^2 - 4ac$ again. What does it mean for the solutions if the result is negative?",
    trap: "The 'Real vs Imaginary Trap'. Students often solve the quadratic and forget that a square root of a negative number means no *real* solutions.",
    reasoning: "Discriminant: $(-4)^2 - 4(1)(5) = 16 - 20 = -4$. Since the discriminant is negative, there are no real solutions."
  },
  {
    id: "CB_MATH_043",
    domain: "Advanced Math",
    skill: "Factoring",
    question_text: "Which of the following are factors of $x^2 - x - 6$?",
    question: "I. $(x - 3)$ | II. $(x + 2)$?",
    choices: {
      "A": "I only",
      "B": "II only",
      "C": "I and II",
      "D": "Neither I nor II"
    },
    correct_answer: "C",
    socraticHint: "Find two numbers that multiply to $-6$ and add to $-1$. What are they?",
    trap: "The 'Sign Error'. Many students use $+3$ and $-2$, which would result in $+x$ as the middle term, not $-x$.",
    reasoning: "Factoring $x^2 - x - 6$ gives $(x - 3)(x + 2)$. Both are factors."
  },
  {
    id: "CB_MATH_046",
    domain: "Passport to Advanced Math",
    skill: "Exponents",
    question_text: "Simplify the expression $x^{1/2} \\times x^{1/3}$.",
    choices: {
      "A": "$x^{1/5}$",
      "B": "$x^{5/6}$",
      "C": "$x^{1/6}$",
      "D": "$x^{2/3}$"
    },
    correct_answer: "B",
    socraticHint: "Multiplying terms with the same base means adding their exponents. What is $\\frac{1}{2} + \\frac{1}{3}$?",
    trap: "The 'Common Denominator Error'. Students often add numerators and denominators directly to get $2/5$ or $1/5$. You must find a common denominator (6).",
    reasoning: "$\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$. Thus, $x^{5/6}$."
  }
];
