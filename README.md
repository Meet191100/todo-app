# todo-app


Welcome to the Todo List REST API built with Node.js, ExpressJS, Mongoose, MongoDB, and TypeScript. This project provides a robust backend solution for managing todo items efficiently. With this API, users can organize their tasks, track deadlines, and ensure productivity with ease.

### How it Works:

1. **Authentication:** Users can sign up using their email and password, and then log in to obtain an access token. This token is required to access the CRUD operations for todo items.

2. **CRUD Operations:** Once authenticated, users can create new todo items, view their existing tasks, update task details, and delete tasks as needed. All operations are performed securely and are associated with the user's account.

3. **CRON Job:** The CRON job runs automatically every day at midnight. It identifies todo items with expired due dates and updates their completion status to indicate that they are overdue. This ensures that users can focus on current tasks without worrying about overdue items.

### Steps to Run the Application

1. **Clone the Repository**:
   ```
   git clone https://github.com/your_username/todo-app.git
   ```

2. **Navigate to the Project Directory**:
   ```
   cd todo-app
   ```

3. **Check for the Node Versoin**:
    ```
    node -v

    This Project is build in Node Version - v19
    ```

3. **Install Dependencies**:
   ```
   npm install
   ```

4. **Run the Application**:
   ```
   npm run dev
   ```

### API Endpoints

#### Authentication:

- **SignUp:** `POST /api/signup`
  - Register a new user.

- **Login:** `POST /api/login`
  - Log in an existing user. You will receive an `AccessToken` upon successful login.

#### Todo Operations:
Each request in the collection secure with `AccessToken`. Make sure to add `AccessToken` with the actual values obtained during runtime.

- **Create Todo:** `POST /api/todos`
  - Create a new todo item.

- **Get Todo:** `GET /api/todos`
  - Retrieve all todo items for the authenticated user.

- **Update Todo:** `PUT /api/todos/{_id}`
  - Update an existing todo item.

- **Delete Todo:** `DELETE /api/todos/{_id}`
  - Delete an existing todo item.

### Postman Collection

To test the APIs, you can use the provided Postman collection. Here are the steps to use it:

1. **Download Postman**: If you haven't already, check the `todo-app.postman_collection.json` in the project.

2. **Import the Collection**:
   - Open Postman.
   - Click on "Import" in the top left corner.
   - Select the downloaded JSON file (`todo-app.postman_collection.json`).
   - Click on "Open".

3. **Update Environment Variables**:
   - Set the `URL` variable in your Postman environment to the base URL where your server is running (e.g., `http://localhost:3000`).

4. **Run Requests**:
   - You can now run the requests in the collection.
   - Make sure to update the `Token` variable with the JWT token obtained after signing up or logging in.