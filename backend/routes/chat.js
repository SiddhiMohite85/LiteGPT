import express from "express";
import Thread from "../models/Thread.js"
import getGroqAIAPIResponse from "../utils/groqai.js";

const router=express.Router();


//test


router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"abc",
            title:"Testing Thread2"
        });

        const response=await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in Db"});
    }
});

//Get all threads

router.get("/thread",async(req,res)=>{
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});  //-1 means descending order
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to Fetch threads"});
    }
});

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error:"Thread not  found"});
        }res.json(thread.messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to Fetch chat"});
    }
});

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deletedThread=await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to Fetch chat"});
    }
});

router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.body;

    if(!threadId || !message){
        res.status(400).json({error:"Missing required fields"});
    }


    try{
       let thread=await Thread.findOne({threadId});

       if(!thread){
        //create new thread in DB

        thread=new Thread({
            threadId,
            title:message.substring(0, 30),
            messages:[{role:"user",content:message}]
        });
       }else{
        thread.messages.push({role:"user",content:message});
       }
       const assistantReply=await getGroqAIAPIResponse(message);

       thread.messages.push({role:"assistant",content:assistantReply});
       thread.updatedAt=new Date();
       await thread.save();
       res.json({reply:assistantReply});


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
})

export default router;