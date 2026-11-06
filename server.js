import 'dotenv/config';
import app from './index.js';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
