# socket.io (simple chat interface)

A simple real-time chat application built with Node.js, Express, Socket.IO, and PostgreSQL.

## Features
- Real-time messaging with Socket.IO
- Online user list
- Typing indicators
- User join notifications
- Message persistence in PostgreSQL
- Reconnection support with server offset tracking

## Tech Stack
- Node.js
- Express
- Socket.IO
- PostgreSQL
- `pg` Node.js client
- Vanilla HTML, CSS, and JavaScript

## Project Structure
- `index.js` - Express server and Socket.IO setup
- `database.js` - PostgreSQL connection pool
- `db_init.js` - Creates the `messages` table
- `env.js` - Database configuration and fallback URL
- `public/` - Static client assets and chat UI
- `index.html` - Chat interface
- `public/scripts/index.js` - Browser-side Socket.IO event handling

## Development Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure the database connection:
   - Update `DATABASE_URL` in your environment, or use the fallback inside `env.js`.
   - Example:
     ```powershell
     $env:DATABASE_URL = 'postgresql://postgres:pgpassword@localhost:5432/mydb'
     ```

3. Initialize the database:
   ```bash
   pnpm db:init
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open the app in your browser:
   - Visit `http://localhost:3001`

## Notes
- The client prompts for a nickname on load.
- Messages are stored in PostgreSQL with a unique server offset.
- The server serves static files from the `public` folder and handles Socket.IO events for chat interaction.

## License
MIT
