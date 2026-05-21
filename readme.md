**Project Name:DocAppoint — Doctor Appointment Manager.


** Server-live-site:https://doc-appoint-three.vercel.app

Backend Key Features:
**.JWT-Based Security & Middleware Protection: Secure token verification implemented using jose-cjs and JSON Web Key Sets (JWKS). Critical routes like fetching user bookings, creating, updating, or deleting appointments are protected via an advanced verifyToken middleware to prevent unauthorized access.

**.Optimized MongoDB Regex Search API: Built a case-insensitive search mechanism ($regex with $options: "i") inside the /doctor endpoint. It dynamically processes query parameters to filter and return medical professionals matching the search criteria perfectly from the database.

**.Dynamic CRUD Operations for Booking Management: Features robust RESTful APIs (GET, POST, PATCH, DELETE) tailored for appointment management. The system allows users to seamlessly book slots, update their schedules via $set filters, and handle structural cancellations directly on the MongoDB layer.

**.High-Performance Ranking & Sorting Algorithm: Implemented a backend data filtration technique within the /top-doctors endpoint. It queries the database, sorts doctors based on their ratings in descending order, and limits the output (.limit(3)) to minimize payload delivery and boost performance.

**.Scalable Architecture & Data Integrity: Configured with decoupled environment variables using dotenv for securing database URI and client origins. The system enforces data integrity by validating parameters like bookingId or userId using MongoDB's ObjectId casting, paired with structured 401, 403, and 500 HTTP status code responses.