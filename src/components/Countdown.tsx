import { useState, useEffect } from 'react';

export const Countdown = () => {
  // Set target date to 30 days from now (you can change this)
  const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
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
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-brand-orange/10 border border-primary/20 rounded-xl p-8 text-center">
      <h3 className="text-2xl font-bold text-primary mb-6">Event Countdown</h3>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
            DAYS
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
            HOURS
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-bold text-primary mb-2">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
            MINUTES
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-pulse">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
            SECONDS
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-6">
        Don't miss out on this exclusive tech workshop!
      </p>
    </div>
  );
};