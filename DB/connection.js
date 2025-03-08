import mongoose from 'mongoose';

const db_connection = (connectionStr) => {
  console.log(connectionStr);
  mongoose
    .connect(connectionStr, {
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected successfully ✅');
    })
    .catch((error) => {
      console.log('Error in database connection ', error);
    });
};

export default db_connection;
