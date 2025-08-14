import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Marquee } from '@/components/ui/3d-testimonails';

const testimonials = [
  { name: 'Ava Green', username: '@ava', body: 'Hirely helped me land interviews in days!', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop', country: '🇦🇺 Australia' },
  { name: 'Ana Miller', username: '@ana', body: 'The resume flow is smooth and intuitive.', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop', country: '🇩🇪 Germany' },
  { name: 'Mateo Rossi', username: '@mat', body: 'Great roles and quick responses from recruiters.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop', country: '🇮🇹 Italy' },
  { name: 'Maya Patel', username: '@maya', body: 'Submitting my resume took less than 3 minutes!', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop', country: '🇮🇳 India' },
  { name: 'Noah Smith', username: '@noah', body: 'Best place to find overseas opportunities.', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop', country: '🇺🇸 USA' },
  { name: 'Lucas Stone', username: '@luc', body: 'Beautiful UI and fast performance.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', country: '🇫🇷 France' },
  { name: 'Haruto Sato', username: '@haru', body: 'Mobile experience is top-notch!', img: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?q=80&w=400&auto=format&fit=crop', country: '🇯🇵 Japan' },
  { name: 'Emma Lee', username: '@emma', body: 'The process feels friendly and professional.', img: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop', country: '🇨🇦 Canada' },
  { name: 'Carlos Ray', username: '@carl', body: 'Highly recommend to job seekers!', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', country: '🇪🇸 Spain' },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50 bg-zinc-900/80 border-white/10 text-white">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium flex items-center gap-1">
              {name} <span className="text-xs text-white/60">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-white/60">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-white/80">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function DemoTestimonials3D() {
  return (
    <div className="border border-white/10 rounded-lg relative flex h-96 w-full max-w-[1000px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div
        className="flex flex-row items-center gap-4 [transform:translateX(-100px)_translateY(0px)_translateZ(-100px)_rotateX(20deg)_rotateY(-10deg)_rotateZ(20deg)]"
      >
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
      </div>
    </div>
  );
}


