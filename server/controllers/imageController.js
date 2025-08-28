

// import userModel from "../models/userModel.js"
// import FormData from "form-data"
// import axios from "axios"



// export const generateImage = async (req, res) => {
//     try {
//         const {userId, prompt} = req.body

//         const user = await userModel.findById(userId)

//         if (!user || !prompt) {
//             return res.json({ success: false, message: 'Missing Details'})
//         }

//         if (user.creditBalance === 0 || userModel.creditBalance <   0){
//             return res.json({success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
//         } 

//         const formData = new FormData()
//         formData.append('prompt', prompt)

//         const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
//             headers: {
//                 //'x-api-key': process.env.CLIPDROP_API,
//               'x-api-key' : "95907d4553b46623e894b7244956e6fef3a06d9b15ae31d62938b5a0ff2712dcad9fe4b4a20bd1af48e37c4231467037",
//               },
//               responseType : 'arraybuffer'
//         })

//         const base64Image = Buffer.from(data, 'binary').toString('base64')
//         const resultImage = `data:image/png;base64,${base64Image}`

//         await userModel.findByIdAndUpdate(user._id, {creditBalance:user.creditBalance - 1})

//         res.json({success:true, message:"Image Generated", 
//         creditBalance: user.creditBalance -1 , resultImage})
//     } catch (error) {
//          console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY ,
          ...formData.getHeaders(), // ✅ required
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error("❌ Clipdrop Error:", error.response?.status, error.response?.data?.toString() || error.message);
    res.json({ success: false, message: error.message });
  }
};
