# Online Marketplace API

## Table of Contents
1. [Project Description and Overview](#project-description-and-overview)
2. [Features](#features)

## Project Description and Overview

This project is a comprehensive RESTful API for an online marketplace platform. It enables users to buy and sell products, manage inventory, and process orders efficiently

Key aspects of the marketplace include:

- User roles: 
  - Admin/Seller: Manages the entire application, including user accounts, products, orders, and categories. They are also responsible for selling products.
  - Buyer: Can browse products, place orders, and leave reviews.

- Product management: Allows for creation, updating, and deletion of products, with the ability to categorize them for easy browsing.

- Order processing: Supports order placement, tracking, and status updates.

- Review system: Enables buyers to rate and review products they've purchased and have completed status

- Authentication and Authorization: Implements secure user registration, login, and role-based access control.


## Features

1. User Management
   - User registration with email verification for buyers
   - Secure login system
   - Profile management for users

2. Role-Based Access Control
   - Admin/Seller role: Full control over the marketplace
   - Buyer role: Access to shopping and order management features

3. Product Management
   - Create, update, and delete products (Admin/Seller only)
   - Categorize products for easy navigation
   - Mark products as featured (Admin/Seller only)

4. Order Processing
   - Place orders (Buyers)
   - View order history (Buyers see their ow/ Admin sees all users orders)
   - Track order status (buyers)

5. Search and Browse
   - Browse products by category
   - Advanced search by optional category name, maximum price and minimum price,..

6. Review and Rating System
   - Allow buyers to review and rate purchased products and order marked as complete
   - Display Reviews and comments on a a particular product

7. Notifications
   - Email notifications for order status updates
   - Email verification for new buyer account registration

8. Admin Controls
   - Manage users, products, orders, and categories

9. Security Features
   - JWT-based authentication
   - Role-based authorization for API endpoints
   - Encryption for sensitive data at rest

10. API Documentation
    - Swagger Open API

12. Docker Support
    - Containerized application for easy deployment and scaling
    - Docker Compose setup for managing multiple services

These features create a robust and versatile online marketplace platform, catering to the needs of both sellers and buyers while ensuring scalability and security.
