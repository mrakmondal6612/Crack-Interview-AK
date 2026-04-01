import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import RetakeInterviewButton from "@/app/components/RetakeInterviewButton";

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
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    (feedback && feedback.createdAt) || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-full max-w-[360px] min-w-[260px] flex-1 max-sm:w-full min-h-96 mx-auto">
      <div className="card-interview flex flex-col h-full justify-between">
        <div className="flex flex-row gap-4 items-center mb-2">
          {/* Interviewer (AI) */}
          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                fill
                className="rounded-full object-cover"
                sizes="40px"
              />
            </div>
            <span className="text-xs mt-1 text-center">AI Interviewer</span>
          </div>
          {/* Candidate */}
          {candidatePhotoUrl && (
            <div className="flex flex-col items-center ml-4">
              <div className="relative w-10 h-10">
                <Image
                  src={candidatePhotoUrl}
                  alt={candidateName || "Candidate"}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
              <span className="text-xs mt-1 text-center">{candidateName}</span>
            </div>
          )}
        </div>

        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text ">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
            style={{ width: "auto", height: "auto" }}
          />

          {/* Interview Role */}
          <h3 className="mt-5 capitalize">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
                style={{ width: "auto", height: "auto" }}
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/star.svg"
                width={22}
                height={22}
                alt="star"
                style={{ width: "auto", height: "auto" }}
              />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-4">
          <DisplayTechIcons techStack={techstack} />
          <div className="flex flex-col gap-2 items-end">
            <Button className="btn-primary">
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
