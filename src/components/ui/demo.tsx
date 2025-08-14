import { PulseBeams } from "@/components/ui/pulse-beams";
import { Component } from "@/components/ui/image-auto-slider";

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
];

function DemoPulseBeams() {
  return (
    <PulseBeams beams={beams} className="bg-slate-950" />
  );
}

export { DemoPulseBeams };


const DemoOne = () => {
  return <Component />;
};

export { DemoOne };

