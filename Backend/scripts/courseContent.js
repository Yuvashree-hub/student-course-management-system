// backend/scripts/courseContent.js
// Sample lessons (4 modules) and a 5-question quiz for each of the 5 starter courses.
// Admins can change all of this later from Admin -> Manage Courses.
const q = (question, options, correctIndex) => ({ question, options, correctIndex });
const m = (title, content) => ({ title, content, videoUrl: '' });

export const courseContent = {
  'Frontend Web Development': {
    modules: [
      m('HTML Foundations',
        'HTML describes the structure of a web page using elements such as headings, paragraphs, links, images and lists.\n\nSemantic elements - header, nav, main, section, article and footer - tell browsers, search engines and screen readers what each part of the page means, which improves accessibility and SEO.\n\nForms collect user input with input, label, select and button elements. Always connect a label to its input so the form is usable with keyboards and assistive technology.'),
      m('CSS Styling and Layout',
        'CSS controls how HTML looks. A selector chooses elements and a set of properties styles them.\n\nThe box model describes every element as a box: content, then padding, then border, then margin on the outside.\n\nFlexbox lays items out in one direction (a row or a column), while CSS Grid handles rows and columns together. Media queries such as @media (max-width: 600px) apply styles only on certain screen sizes, which is the basis of responsive design.'),
      m('JavaScript Essentials',
        'JavaScript adds behaviour to a page. Declare variables with let (can change) or const (cannot be reassigned), and group logic into functions.\n\nThe DOM is the browser\'s model of the page. JavaScript can select elements, change them, and react to events such as clicks and key presses with event listeners.\n\nThe fetch function requests data from a server and returns a Promise. Using async/await lets you write this asynchronous code in a readable, step-by-step way.'),
      m('React Basics',
        'React builds user interfaces from small reusable components. Props pass data from a parent component to a child.\n\nState holds data that changes over time. When you update state created with the useState hook, React re-renders the component automatically. The useEffect hook runs side effects such as fetching data after a render.\n\nReact Router maps URLs to components so a single-page app can have many pages without reloading the browser.'),
    ],
    quiz: [
      q('Which HTML element is the semantic choice for the main navigation links of a page?', ['<div class="menu">', '<nav>', '<span>', '<b>'], 1),
      q('In the CSS box model, which part sits directly OUTSIDE the border?', ['Padding', 'Margin', 'Content', 'Outline text'], 1),
      q('Which CSS feature applies styles only at certain screen widths?', ['Flexbox', 'Media queries', 'Selectors', 'Colors'], 1),
      q('Which keyword declares a variable that cannot be reassigned?', ['var', 'let', 'const', 'function'], 2),
      q('In React, which hook stores data that triggers a re-render when it changes?', ['useEffect', 'useState', 'useRoute', 'useStyle'], 1),
    ],
  },

  'Data Science Fundamentals': {
    modules: [
      m('What is Data Science?',
        'Data science extracts useful knowledge from data. A typical workflow is: define the question, collect data, clean it, explore it, build a model, and communicate the results.\n\nData comes in different types. Numerical data (such as price or age) can be measured, while categorical data (such as city or colour) places items into groups. Knowing the type decides which analysis and charts make sense.'),
      m('Python Tools for Data',
        'NumPy provides fast arrays for numerical computing. pandas builds on it and offers the DataFrame, a table with rows and labelled columns.\n\nWith pandas you can load a file using read_csv, look at the first rows with head, summarise columns with describe, and group rows with groupby. Matplotlib draws charts such as lines, bars and histograms from your data.'),
      m('Cleaning and Exploring Data',
        'Real data is messy: values are missing, rows are duplicated and columns have the wrong type. You can drop bad rows, fill gaps with the mean or median, remove duplicates and convert types.\n\nExploratory data analysis uses summary statistics (mean, median, standard deviation) and charts. A histogram shows how one variable is distributed, and a scatter plot shows the relationship between two variables.'),
      m('Introduction to Machine Learning',
        'Supervised learning learns from labelled examples. Classification predicts a category (spam or not spam) and regression predicts a number (a house price). Unsupervised learning finds structure in unlabelled data, for example clustering customers into groups.\n\nAlways split your data into a training set and a test set. Testing on unseen data shows whether the model generalises. A model that memorises the training data but fails on new data is overfitted.'),
    ],
    quiz: [
      q('Which Python library provides the DataFrame for working with tabular data?', ['NumPy', 'pandas', 'Matplotlib', 'Flask'], 1),
      q('Which step normally comes FIRST in the data science workflow?', ['Train the model', 'Define the question', 'Deploy the app', 'Draw the final chart'], 1),
      q('Which chart is best for showing the distribution of one numeric variable?', ['Histogram', 'Gantt chart', 'Organisation chart', 'Sitemap'], 0),
      q('Predicting the price of a house (a number) is which kind of task?', ['Classification', 'Regression', 'Clustering', 'Sorting'], 1),
      q('Why do we split data into training and test sets?', ['To make the file smaller', 'To check the model on unseen data', 'To remove missing values', 'To speed up charts'], 1),
    ],
  },

  'Artificial Intelligence': {
    modules: [
      m('What is Artificial Intelligence?',
        'Artificial intelligence (AI) is the field of building systems that perform tasks which normally need human intelligence, such as understanding language, recognising images and making decisions.\n\nToday\'s systems are narrow AI: each is good at one task. Machine learning is a part of AI, and deep learning is a part of machine learning that uses large neural networks.'),
      m('Machine Learning Basics',
        'Instead of following hand-written rules, a machine learning system learns patterns from data. In supervised learning the data has labels, in unsupervised learning it does not, and in reinforcement learning an agent learns by trial and error using rewards and penalties.\n\nThe quality of training data matters: if the data is biased or incomplete, the predictions will be too.'),
      m('Neural Networks',
        'A neural network is made of layers of connected neurons. Each neuron computes a weighted sum of its inputs and passes it through an activation function.\n\nTraining adjusts the weights to reduce the error, called the loss, using backpropagation and gradient descent. Networks with many layers are called deep networks and power image recognition (CNNs) and language models (transformers).'),
      m('Responsible AI',
        'AI systems affect real people, so they must be built responsibly. Key concerns are bias and fairness, privacy of personal data, transparency about how decisions are made, and safety.\n\nTest models on different groups of people, protect personal data, explain decisions where possible, and keep humans in charge of high-stakes choices such as medical or legal decisions.'),
    ],
    quiz: [
      q('Which of these is the BROADEST term?', ['Deep learning', 'Machine learning', 'Artificial intelligence', 'Neural network'], 2),
      q('Which type of learning uses rewards and penalties from trial and error?', ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Manual programming'], 2),
      q('During training, what does a neural network adjust to reduce its error?', ['The weights', 'The screen resolution', 'The file names', 'The keyboard layout'], 0),
      q('Biased training data most likely leads to what?', ['Faster training', 'Unfair predictions', 'A smaller model', 'Lower electricity use'], 1),
      q('How does a single neuron produce its output?', ['A weighted sum of inputs passed through an activation function', 'It picks a random number', 'It copies the previous neuron', 'It only reads the last input'], 0),
    ],
  },

  'Python Programming': {
    modules: [
      m('Python Basics',
        'Python is a readable, beginner-friendly language. Variables are created by assigning a value, and Python works out the type: int, float, str (text) or bool (True/False).\n\nUse print to show output and input to read it. Python uses indentation, not braces, to mark blocks of code. Decisions are made with if, elif and else.'),
      m('Loops and Collections',
        'A for loop repeats over a sequence, and a while loop repeats as long as a condition is true. range generates a sequence of numbers.\n\nA list is an ordered, changeable collection; a tuple is ordered but cannot be changed; a dictionary stores key-value pairs; a set keeps unique items. A list comprehension such as [x * x for x in range(5)] builds a list in one line.'),
      m('Functions and Modules',
        'A function groups reusable code. Define it with the def keyword, give it parameters, and send a result back with return. Parameters can have default values.\n\nA module is a Python file you can import, for example import math. Splitting code into functions and modules keeps programs organised and easy to test.'),
      m('Files and Error Handling',
        'Use with open("notes.txt") as f to read a file; the with statement closes the file automatically. Modes include r (read), w (write) and a (append).\n\nErrors do not have to crash your program. Put risky code in a try block and handle problems in an except block, for example ZeroDivisionError. A finally block runs whether or not an error occurred.'),
    ],
    quiz: [
      q('Which symbol starts a single-line comment in Python?', ['//', '#', '--', '/*'], 1),
      q('Which of these data types is immutable (cannot be changed after creation)?', ['list', 'dict', 'tuple', 'set'], 2),
      q('What does len([4, 8, 15]) return?', ['2', '3', '15', '27'], 1),
      q('Which keyword defines a function in Python?', ['func', 'function', 'def', 'fun'], 2),
      q('Which pair of blocks handles an error without crashing the program?', ['try / except', 'if / else', 'for / while', 'import / as'], 0),
    ],
  },

  'Backend with Node.js & Express': {
    modules: [
      m('Node.js and npm',
        'Node.js runs JavaScript outside the browser, using Google\'s V8 engine. npm is its package manager: packages you install are listed in package.json and stored in node_modules.\n\nScripts such as npm start run your app. Secrets like database passwords belong in environment variables loaded from a .env file with dotenv, never in your source code.'),
      m('Express and REST APIs',
        'Express is a small framework for building servers. A route such as app.get("/api/courses", handler) runs a function when that URL and method are requested.\n\nMiddleware are functions that run in order before your route, for example express.json(), which parses JSON request bodies. REST maps HTTP methods to actions: GET reads, POST creates, PUT or PATCH updates and DELETE removes. Status codes tell the client what happened: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found and 500 Server Error.'),
      m('MongoDB and Mongoose',
        'MongoDB stores data as JSON-like documents inside collections. Mongoose adds schemas, validation and models on top of it.\n\nYou connect with a connection string, then use model methods: create to insert, find to read, findByIdAndUpdate to change and deleteOne to remove. Schema rules such as required and unique protect your data from bad input.'),
      m('Authentication with JWT',
        'Never store plain-text passwords: hash them with bcrypt. After a successful login the server signs a JSON Web Token (JWT) and returns it.\n\nThe client sends the token in the Authorization header as "Bearer <token>". Authentication middleware verifies the token on each request and answers 401 Unauthorized if it is missing, invalid or expired. Role checks then decide what each user is allowed to do.'),
    ],
    quiz: [
      q('Which HTTP method is normally used to CREATE a new resource?', ['GET', 'POST', 'DELETE', 'HEAD'], 1),
      q('Which status code means the request was not authenticated (missing or invalid token)?', ['200', '201', '401', '404'], 2),
      q('What does the express.json() middleware do?', ['Parses JSON request bodies', 'Encrypts passwords', 'Starts the database', 'Compresses images'], 0),
      q('Why are passwords hashed with bcrypt before saving?', ['So plain-text passwords are never stored', 'To make the database faster', 'To shorten the password', 'To remove special characters'], 0),
      q('Where does a client normally send a JWT?', ['In the Authorization header as a Bearer token', 'Inside the CSS file', 'In an image alt text', 'In the page title'], 0),
    ],
  },
};
