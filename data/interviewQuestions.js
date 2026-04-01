export const interviewQuestions = {
  easy: [
    {
      question: "What is HTML?",
      answer: "HTML (HyperText Markup Language) is the standard language used to structure content on web pages using elements like headings, paragraphs, and links.",
    },
    {
      question: "What is CSS?",
      answer: "CSS (Cascading Style Sheets) is used to style and layout web pages, for example to change colors, fonts, and spacing.",
    },
    {
      question: "What is JavaScript?",
      answer: "JavaScript is a programming language used to make web pages interactive, such as handling events, animations, and dynamic content.",
    },
    {
      question: "What is a variable?",
      answer: "A variable is a container used to store data values that can be used and modified in a program.",
    },
    {
      question: "What is a function?",
      answer: "A function is a block of code designed to perform a specific task and can be reused multiple times.",
    },
    {
      question: "What is React?",
      answer: "React is a JavaScript library used for building user interfaces, especially single-page applications, using components.",
    },
    {
      question: "What is Git?",
      answer: "Git is a version control system used to track changes in code and collaborate with other developers.",
    },
  ],

  medium: [
    {
      question: "Explain closures in JavaScript",
      answer: "A closure is a function that retains access to variables from its outer scope even after the outer function has finished executing.",
    },
    {
      question: "What is useEffect?",
      answer: "useEffect is a React hook used to perform side effects such as data fetching, subscriptions, or updating the DOM.",
    },
    {
      question: "Difference between var, let, const",
      answer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned.",
    },
    {
      question: "What is event delegation?",
      answer: "Event delegation is a technique where a parent element handles events for its child elements using event bubbling.",
    },
    {
      question: "Explain promises",
      answer: "A promise is an object representing the eventual completion or failure of an asynchronous operation, with states: pending, fulfilled, and rejected.",
    },
    {
      question: "What is REST API?",
      answer: "A REST API is a web service that follows REST principles, allowing communication between client and server using HTTP methods like GET, POST, PUT, DELETE.",
    },
  ],

  hard: [
    {
      question: "Explain virtual DOM",
      answer: "The virtual DOM is a lightweight copy of the real DOM used by React to efficiently update the UI by minimizing direct DOM manipulations.",
    },
    {
      question: "How does React reconciliation work?",
      answer: "Reconciliation is React’s process of comparing the virtual DOM with the previous version to determine what changes are needed and updating only those parts in the real DOM.",
    },
    {
      question: "Explain debounce vs throttle",
      answer: "Debounce delays execution until a function stops being called for a specified time, while throttle ensures a function executes at most once in a given time interval.",
    },
    {
      question: "How JS event loop works?",
      answer: "The event loop handles asynchronous operations by continuously checking the call stack and task queue, executing tasks when the stack is empty.",
    },
    {
      question: "Optimize performance in React",
      answer: "Performance can be optimized using techniques like memoization (React.memo, useMemo), lazy loading, code splitting, and avoiding unnecessary re-renders.",
    },
  ],
};