"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: string;
  questions: string[];
  userPhotoUrl?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  userPhotoUrl,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("VAPI Error:", error);
      // Handle call errors gracefully
      if (error.message.includes("ejection") || error.message.includes("ended")) {
        setCallStatus(CallStatus.FINISHED);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  // Separate effect for handling call finish and feedback generation
  useEffect(() => {
    // Only handle when call is finished and it's an interview (not generate)
    if (callStatus !== CallStatus.FINISHED) return;
    
    // For generate type, redirect to interviews list
    if (type === "generate") {
      router.push("/interview");
      return;
    }

    // Interview finished - generate feedback
    const handleGenerateFeedback = async () => {
      console.log("handleGenerateFeedback", { messagesCount: messages.length, userId, interviewId });
      setIsGeneratingFeedback(true);

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        console.log("Feedback result:", { success, id });

        if (success && id) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.log("Feedback generation returned false, redirecting anyway");
          router.push(`/interview/${interviewId}/feedback`);
        }
      } catch (error) {
        console.error("Error in feedback generation:", error);
        router.push(`/interview/${interviewId}/feedback`);
      } finally {
        setIsGeneratingFeedback(false);
      }
    };

    handleGenerateFeedback();
  }, [callStatus, type, interviewId, router, messages, userId, feedbackId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            {userPhotoUrl ? (
              <Image
                src={userPhotoUrl}
                alt="profile-image"
                width={120}
                height={120}
                className="rounded-full object-cover size-[120px]"
              />
            ) : (
              <Image
                src="/user-avatar.png"
                alt="profile-image"
                width={120}
                height={120}
                className="rounded-full object-cover size-[120px]"
              />
            )}
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {isGeneratingFeedback && (
        <div className="w-full flex flex-col items-center justify-center gap-4 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-100"></div>
          <p className="text-primary-200 text-center">
            Generating feedback... Please wait.
          </p>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" && !isGeneratingFeedback ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : callStatus === "ACTIVE" ? (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Agent;
