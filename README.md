# Online Marketplace API

## Table of Contents

1. [Project Description and Overview](#project-description-and-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
5. [API Documentation](#api-documentation)

## Project Description and Overview

This project is a comprehensive RESTful API for an online marketplace platform. It enables users to buy and sell products, manage inventory, and process orders efficiently.

Key aspects of the marketplace include:

- **User roles:**
  - **Admin/Seller:** Manages the entire application, including user accounts, products, orders, and categories. They are also responsible for selling products.
  - **Buyer:** Can browse products, place orders, and leave reviews.
- **Product management:** Allows for creation, updating, and deletion of products, with the ability to categorize them for easy browsing.
- **Order processing:** Supports order placement, tracking, and status updates.
- **Review system:** Enables buyers to rate and review products they've purchased and have completed status.
- **Authentication and Authorization:** Implements secure user registration, login, and role-based access control.

## Features

1. **User Management**
   - User registration with email verification for buyers
   - Secure login system
   - Profile management for users
2. **Role-Based Access Control**
   - Admin/Seller role: Full control over the marketplace
   - Buyer role: Access to shopping and order management features
3. **Product Management**
   - Create, update, and delete products (Admin/Seller only)
   - Categorize products for easy navigation
   - Mark products as featured (Admin/Seller only)
4. **Order Processing**
   - Place orders (Buyers)
   - View order history (Buyers see their own / Admin sees all users' orders)
   - Track order status (buyers)
5. **Search and Browse**
   - Browse products by category
   - Advanced search by optional category name, maximum price, and minimum price
6. **Review and Rating System**
   - Allow buyers to review and rate purchased products and order marked as complete
   - Display reviews and comments on a particular product
7. **Notifications**
   - Email notifications for order status updates
   - Email verification for new buyer account registration
8. **Admin Controls**
   - Manage users, products, orders, and categories
9. **Security Features**
   - JWT-based authentication
   - Role-based authorization for API endpoints
   - Encryption for sensitive data at rest
10. **API Documentation**
   - Swagger Open API
11. **Docker Support**
   - Containerized application for easy deployment and scaling
   - Docker Compose setup for managing multiple services

## Technologies Used

- **Backend Frameworks:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** Swagger / OpenAPI 3.0
- **Containerization:** Docker
- **Build Tool:** npm (Node Package Manager)

## Getting Started

There are two ways to run this application: the standard method and using Docker.

### Environment Setup

1. Rename the `.env.example` file to `.env`.
2. Edit the `.env` file:
   - For standard method: Set `HOST=localhost`.
   - For Docker method: Set `HOST=db`.

### Option 1: Standard Method

**Prerequisites:**

- Node.js
- npm
- PostgreSQL 16

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/online-marketplace-api.git
    cd online-marketplace-api
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up PostgreSQL:
   - Ensure PostgreSQL 16 is installed and running.
   - Create a new server and database for the project.
   - Edit the `.env` file to match your PostgreSQL credentials:

    ```env
    HOST=localhost
    DB_USER=your_postgres_username
    DB_PORT=5432
    PASSWORD=your_postgres_password
    DATABASE_NAME=your_database_name
    ```

4. Start the application:

    ```sh
    nodemon app.js
    # or
    node app.js
    ```

5. The API will be accessible at `http://localhost:3000`.

Note: The application uses Sequelize ORM, which will automatically create the necessary database tables on startup.

### Option 2: Using Docker

This is a multi-container application using PostgreSQL 16.3 and Node.js 21-alpine.

1. Navigate to the parent directory containing the `.env` and `docker-compose.yml` files.
2. Set up the `.env` file as described in the Environment Setup section.
3. Run the following command:

    ```sh
    docker-compose up
    ```

This command will:
- Download the PostgreSQL 16.3 image
- Pull the custom Node.js image from Docker Hub
- Set up and run the containers

4. The application will be available at `http://localhost:3000`.

## API Documentation

Once the application is running (using either method), you can access the Swagger documentation at:

`http://localhost:3000/api-docs`

## Troubleshooting

If only the database container starts, you can try the following:

a. Restart all services:

    ```sh
    docker-compose restart
    ```

b. If the above doesn't work, stop all containers and start again:

    ```sh
    docker-compose down
    docker-compose up
    ```

c. To see logs and identify any issues:

    ```sh
    docker-compose logs
    ```

d. If problems persist, you can try rebuilding the containers:

    ```sh
    docker-compose up --build
    ```

These commands should help ensure both the database and application containers start properly.
