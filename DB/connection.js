import mongoose from 'mongoose';

// const DB = process.env.DATABASE_CONNECTION.replace(
//   "<db_password>",
//   process.env.DATABASE_PASSWORD
// );

export const db_connection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Database connected successfully ✅');
    })
    .catch((error) => {
      console.log('Error in database connection ', error.message);
    });
};

export default db_connection;
