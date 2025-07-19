import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate?: Date;
}

export const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-primary mb-2">Event Date</h3>
        <p className="text-lg text-muted-foreground">To Be Announced</p>
        <p className="text-sm text-muted-foreground mt-2">
          Access codes will be sent before the event date
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-primary mb-4">Event Countdown</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
          <div className="text-sm text-muted-foreground">Days</div>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
          <div className="text-sm text-muted-foreground">Hours</div>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
          <div className="text-sm text-muted-foreground">Minutes</div>
        </div>
        <div className="bg-background rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
          <div className="text-sm text-muted-foreground">Seconds</div>
        </div>
      </div>
    </div>
  );
};