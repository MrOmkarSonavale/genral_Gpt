import Chat from "../models/chat.js";
import User from "../models/user.js";
import { geminiClient as openai } from "../config/openai.js";



// txt - based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        if (req.user.credits < 1) {
            return res.status(403).json({
                success: false,
                message: "You don't have enough credits"
            });
        }

        const chat = await Chat.findOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.messages = chat.messages || [];

        const userMessage = {
            role: "user",
            content: prompt,
            timeStamp: Date.now(),
            isImage: false
        };

        // 🔹 Build conversation history
        const history = chat.messages.map(m => ({
            role: m.role,
            content: [{ type: "text", text: m.content }]
        }));

        // 🔹 Call Gemini (OpenAI compatible endpoint)
        const aiResponse = await openai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                ...history,
                { role: "user", content: prompt }
            ],
        });

        console.log('this is ai res' + aiResponse);

        // 🔹 Extract reply safely
        const reply = {
            role: aiResponse.choices[0].message.role,
            content: aiResponse.choices[0].message.content,
            timeStamp: Date.now(),
            isImage: false
        };

        chat.messages.push(userMessage, reply);
        await chat.save();

        await User.updateOne(
            { _id: userId },
            { $inc: { credits: -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Message sent",
            reply
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
//image generation controller
// export const imageMessageController = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { prompt, chatId, isPublished } = req.body;

//         if (!prompt || !prompt.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Prompt is required"
//             });
//         }

//         if (req.user.credits < 2) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Not enough credits"
//             });
//         }

//         const chat = await Chat.findOne({ _id: chatId, userId });

//         if (!chat) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Chat not found"
//             });
//         }

//         // Save user message
//         chat.messages.push({
//             role: "user",
//             content: prompt,
//             timeStamp: Date.now(),
//             isImage: false
//         });

//         // 🔥 Generate image using Gemini native SDK
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash-image"
//         });

//         const result = await model.generateContent({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [
//                         { text: `Generate an image of: ${prompt}` }
//                     ]
//                 }
//             ],
//             generationConfig: {
//                 responseModalities: ["IMAGE"]
//             }
//         });

//         const response = await result.response;

//         const imagePart = response.candidates[0].content.parts.find(
//             part => part.inlineData
//         );

//         if (!imagePart) {
//             throw new Error("Image generation failed");
//         }

//         const base64Image = imagePart.inlineData.data;

//         // Upload to ImageKit (CDN storage)
//         const uploadRes = await imageKit.files.upload({
//             file: base64Image,
//             fileName: `${Date.now()}.png`,
//         });

//         const reply = {
//             role: "assistant",
//             content: uploadRes.url,
//             timeStamp: Date.now(),
//             isImage: true,
//             isPublished
//         };

//         chat.messages.push(reply);
//         await chat.save();

//         await User.updateOne(
//             { _id: userId },
//             { $inc: { credits: -2 } }
//         );

//         return res.status(200).json({
//             success: true,
//             reply
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };
