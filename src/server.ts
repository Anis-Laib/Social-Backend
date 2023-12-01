import 'dotenv/config';

import app from './app';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`[SERVER]: API Server is running at https://localhost:${PORT}/api\n[SERVER]: WebSocket Server is running at ws://localhost:${PORT}/ws`);
});