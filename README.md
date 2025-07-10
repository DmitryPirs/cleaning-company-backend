# NestJS Backend Project

## About the Project

This repository contains part of the backend for a real cleaning company, built using the **NestJS** framework. The project reflects real business processes and integrates with external services, providing a modern architecture and enhanced security.

---

## Key Features

- **Routing system:** Modular routing for REST API endpoints.
- **JWT Authentication:** Secure endpoints using JWT tokens, with usage examples provided.
- **Database migrations:** Managed via TypeORM to handle database schema changes.
- **Telegram bot integration:** Notifications sent through a Telegram bot using webhooks.

---

## Quick Start

### 1. Clone and install dependencies

git clone https://github.com/DmitryPirs/cleaning-company-backend.git
cd cleaning-company-backend
npm install

### 2. Configuration

Create a `.env` file based on `.env.example` and fill in the required environment variables such as:

- Database credentials
- JWT secret
- Telegram bot token
- Webhook URL  
  ...and others.

### 3. Run the application

npm run start:dev

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## Working with Routes

Main routes are organized by modules, for example:

- `/books`
- `/users`
- `/orders`

You can test the API using **Swagger UI** at:  
[http://localhost:3000/api](http://localhost:3000/api)

---

## JWT Authentication

- Protected routes require a valid JWT token.
- Obtain a token via the login endpoint: `/auth/sign-in`.
- Include the token in your requests as:

Authorization: Bearer <your_jwt_token>

---

## Database Migrations

TypeORM is used to manage database schema migrations.

### To generate and run migrations:

npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run

### To revert the last migration:

npm run typeorm migration:revert

---

## Telegram Bot Integration (Webhook)

Notifications are sent through the Telegram Bot API.

- Webhook URL is configured via environment variables.
- Set webhook with a request like:

const allowedUpdates = JSON.stringify([
"message", "edited_message", "channel_post", "edited_channel_post",
"inline_query", "chosen_inline_result", "callback_query",
"shipping_query", "pre_checkout_query", "poll", "poll_answer",
"my_chat_member", "chat_member", "chat_join_request"
]);
const webhookUrl = encodeURIComponent(process.env.SET_WEBHOOK_URL);
const url = https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${webhookUrl}&allowed_updates=${encodeURIComponent(allowedUpdates)};

After setup, the bot will receive updates from your application.

---

## Contribution and Development

I am constantly improving my skills and actively developing this project. Future plans include:

- Adding new features
- Code optimization
- Refactoring
- Enhancing architecture and security

Your advice, recommendations, and suggestions on how to optimize and refactor the code are very welcome! Feel free to open issues or submit pull requests.

---

## Contact

For questions, suggestions, or feedback — please open an issue or contact me directly.

Thank you for your interest in the project!
