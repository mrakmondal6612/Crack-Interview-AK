import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import RetakeInterviewButton from "@/app/components/RetakeInterviewButton";
import { InterviewCardProps } from "@/types";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
  candidateName,
  candidatePhotoUrl,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType as "Behavioral" | "Mixed" | "Technical"] || "bg-light-600";

  const formattedDate = dayjs(
    (feedback && feedback.createdAt) || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-full max-w-[360px] min-w-[280px] sm:min-w-[320px] flex-1 max-sm:w-full min-h-96 mx-auto">
      <div className="card-interview flex flex-col h-full justify-between">
        <div className="flex flex-row gap-3 sm:gap-4 items-center mb-2">
          {/* Interviewer (AI) */}
          <div className="flex flex-col items-center">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 640px) 32px, 40px"
              />
            </div>
            <span className="text-xs mt-1 text-center hidden sm:block">AI Interviewer</span>
            <span className="text-xs mt-1 text-center sm:hidden">AI</span>
          </div>
          {/* Candidate */}
          {candidatePhotoUrl && (
            <div className="flex flex-col items-center ml-3 sm:ml-4">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src={candidatePhotoUrl}
                  alt={candidateName || "Candidate"}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 640px) 32px, 40px"
                />
              </div>
              <span className="text-xs mt-1 text-center truncate max-w-[60px] sm:max-w-none">{candidateName}</span>
            </div>
          )}
        </div>

        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-2 sm:px-4 py-1 sm:py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text text-xs sm:text-sm">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={70}
            height={70}
            className="rounded-full object-fit size-[70px] sm:size-[90px]"
            style={{ width: "auto", height: "auto" }}
          />

          {/* Interview Role */}
          <h3 className="mt-4 sm:mt-5 capitalize text-sm sm:text-base">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-3 sm:gap-5 mt-2 sm:mt-3">
            <div className="flex flex-row gap-1 sm:gap-2">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                alt="calendar"
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ width: "auto", height: "auto" }}
              />
              <p className="text-xs sm:text-sm">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-1 sm:gap-2 items-center">
              <Image
                src="/star.svg"
                width={18}
                height={18}
                alt="star"
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ width: "auto", height: "auto" }}
              />
              <p className="text-xs sm:text-sm">{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-3 sm:mt-5 text-xs sm:text-sm">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 gap-3">
          <DisplayTechIcons techStack={techstack} />
          <div className="flex flex-col gap-2 items-end w-full sm:w-auto">
            <Button className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-2 sm:py-3">
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
              >
                {feedback ? "Check Feedback" : "View Interview"}
              </Link>
            </Button>
            {/* Retake Button */}
            <RetakeInterviewButton interviewId={interviewId} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
