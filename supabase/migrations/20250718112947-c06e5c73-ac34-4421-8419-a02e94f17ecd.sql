-- Create registrations table for NAPPS ILA workshop
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  position TEXT NOT NULL,
  lga_town TEXT NOT NULL,
  how_heard TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public registration form)
CREATE POLICY "Anyone can insert registrations" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view registrations by email" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique access codes
CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate a 8-character alphanumeric code
    code := UPPER(
      SUBSTRING(
        MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) 
        FROM 1 FOR 8
      )
    );
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_check 
    FROM public.registrations 
    WHERE access_code = code;
    
    -- Exit loop if code is unique
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;