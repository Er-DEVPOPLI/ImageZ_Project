//
// import mongoose from "mongoose";

// const connectDB = async () => {

//         mongoose.connection.on('connected', ()=>{
//            console.log("✅ Database Connected Successfully"); 
//         })
//         await mongoose.connect(`${process.env.MONGODB_URL}/ImageZ`)

        
// }

// export default connectDB;




import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Database Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

