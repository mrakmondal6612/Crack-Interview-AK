"use client";
import React from "react";
import { motion } from "framer-motion";

const reviews = [
	{
		name: "Sarah M.",
		verified: true,
		text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
	},
	{
		name: "Alex K.",
		verified: true,
		text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
	},
	{
		name: "James L.",
		verified: true,
		text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
	},
];

const cardVariants = {
	offscreen: { opacity: 0, y: 60 },
	onscreen: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			bounce: 0.3,
			duration: 0.8,
		},
	},
};

export default function ReviewsSection() {
	return (
		<section className="w-full bg-gradient-to-br from-primary-50 to-primary-100 py-16 px-4 flex flex-col items-center">
			<h2 className="text-4xl font-extrabold mb-12 text-primary-900 tracking-tight drop-shadow-lg">
				Customer Reviews
			</h2>
			<div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
				{reviews.map((review, idx) => (
					<motion.div
						key={idx}
						className="rounded-2xl border border-dark-700 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 shadow-xl p-8 w-full md:w-1/3 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative"
						style={{ minHeight: 220 }}
						initial="offscreen"
						whileInView="onscreen"
						viewport={{ once: true, amount: 0.4 }}
						variants={cardVariants}
					>
						<div className="flex items-center gap-2 mb-3">
							{[...Array(5)].map((_, i) => (
								<svg
									key={i}
									width="22"
									height="22"
									fill="#FFD600"
									viewBox="0 0 24 24"
								>
									<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
								</svg>
							))}
						</div>
						<div className="flex items-center gap-2 mb-2">
							<span className="font-bold text-lg text-primary-900 drop-shadow-sm">
								{review.name}
							</span>
							{review.verified && (
								<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">
									<svg
										width="16"
										height="16"
										fill="none"
										viewBox="0 0 16 16"
									>
										<circle cx="8" cy="8" r="8" fill="#22C55E" />
										<path
											d="M5 8.5l2 2 4-4"
											stroke="#fff"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							)}
						</div>
						<p className="text-primary-700 text-base leading-relaxed font-medium">
							{review.text}
						</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}
