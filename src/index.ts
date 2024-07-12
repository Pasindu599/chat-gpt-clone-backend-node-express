import app from "./app";
import { connectToDB } from "./db/connection";

const PORT = process.env.PORT || 5000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
