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

- **User Management**
  - Registration with email verification for buyers
  - Secure login and profile management

- **Role-Based Access Control**
  - Admin/Seller: Full control over marketplace
  - Buyer: Shopping and order management access

- **Product Management**
  - Admin/seller can manage products
  - Categorize and feature products

- **Order Processing**
  - Place and track orders
  - View order history

- **Search and Browse**
  - Browse by category
  - Advanced search (category, min price, max price, name)

- **Review and Rating System**
  - Rate and review purchased products with order completed
  - Display reviews and comments as well review owners

- **Notifications**
  - Email notifications for orders
  - Email verification for new accounts (buyers)

- **Admin Controls**
  - Manage users, products, orders, and categories

- **Security Features**
  - JWT-based authentication
  - Role-based authorization
  - Data encryption at rest

- **API Documentation**
  - Swagger Open API

- **Docker Support**
  - Containerized deployment
  - Docker Compose for service management


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
