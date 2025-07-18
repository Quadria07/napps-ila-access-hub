import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, Calendar, Clock, MapPin, Users, Award, Search, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface RegistrationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  schoolName: string;
  position: string;
  lgaTown: string;
  howHeard: string;
}

const Index = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    schoolName: "",
    position: "",
    lgaTown: "",
    howHeard: "",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate access code and insert registration
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_access_code');
      
      if (codeError) {
        throw codeError;
      }

      const { error } = await supabase
        .from("registrations")
        .insert({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email.toLowerCase(),
          school_name: formData.schoolName,
          position: formData.position,
          lga_town: formData.lgaTown,
          how_heard: formData.howHeard,
          access_code: codeData,
        });

      if (error) {
        if (error.code === '23505' && error.message.includes('email')) {
          toast({
            title: "Email Already Registered",
            description: "This email address is already registered for the workshop.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Call edge function to send email notification
      const { error: emailError } = await supabase.functions.invoke('send-registration-email', {
        body: {
          ...formData,
          accessCode: codeData,
        }
      });

      if (emailError) {
        console.warn("Email notification failed:", emailError);
        // Don't show error to user as registration was successful
      }

      setRegistered(true);
      toast({
        title: "Registration Successful!",
        description: "Your access code will be sent to your email before the event date.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-medium">
          <CardContent className="text-center p-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for registering! Your access code will be sent to your email before the event date. 
              Please check your inbox closer to the day.
            </p>
            <div className="space-y-3">
              <Link to="/napps-ila-code-lookup">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Search className="mr-2 h-4 w-4" />
                  Check Your Access Code
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  setRegistered(false);
                  setFormData({
                    fullName: "",
                    phoneNumber: "",
                    email: "",
                    schoolName: "",
                    position: "",
                    lgaTown: "",
                    howHeard: "",
                  });
                }}
                variant="ghost"
                className="w-full"
              >
                Register Another Person
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header with Logo */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img 
              src="https://btexloopacademy.com.ng/wp-content/uploads/2025/04/bl.png" 
              alt="Btexloop Academy" 
              className="h-12 md:h-16"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-brand-orange bg-clip-text text-transparent">
            NAPPS ILA Tech Workshop for Proprietors
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Empowering Schools with Robotics, AI & Coding
          </p>
          <p className="text-lg text-muted-foreground">
            Organized by Btexloop Academy in collaboration with NAPPS Ila Local Government Chapter
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Benefits Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                What You'll Gain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Experience real student projects in Robotics, AI & Web that captivate parents</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Learn proven tech strategies top schools use to gain competitive advantage</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Discover how tech directly improves student learning outcomes</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Leave with ready-to-implement ideas for your next academic session</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Receive a Certificate of Participation to showcase your school's innovation drive</p>
              </div>
            </CardContent>
          </Card>

          {/* Workshop Details */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Workshop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">To Be Announced</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">To Be Announced</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">To Be Announced</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Audience</p>
                  <p className="text-sm text-muted-foreground">School Proprietors, Heads & Education Leaders</p>
                </div>
              </div>
              <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-lg p-4">
                <p className="text-sm font-medium text-brand-orange-dark">
                  📌 Entry: Strictly by access code (sent before event date)
                </p>
                <p className="text-xs text-brand-orange-dark mt-1">
                  First Come, First Served • FREE Registration Required
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register for the Workshop</CardTitle>
            <p className="text-center text-muted-foreground">
              Secure your spot - registration is free but required
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="e.g., +234 801 234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium mb-2">
                    School Name *
                  </label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange("schoolName", e.target.value)}
                    placeholder="Enter your school name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-2">
                    Position *
                  </label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="e.g., Proprietor, VP, Head Teacher"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lgaTown" className="block text-sm font-medium mb-2">
                  LGA / Town *
                </label>
                <Input
                  id="lgaTown"
                  value={formData.lgaTown}
                  onChange={(e) => handleInputChange("lgaTown", e.target.value)}
                  placeholder="Enter your LGA or town"
                  required
                />
              </div>

              <div>
                <label htmlFor="howHeard" className="block text-sm font-medium mb-2">
                  How did you hear about this workshop? *
                </label>
                <Select value={formData.howHeard} onValueChange={(value) => handleInputChange("howHeard", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NAPPS Chairman">NAPPS Chairman</SelectItem>
                    <SelectItem value="WhatsApp Group">WhatsApp Group</SelectItem>
                    <SelectItem value="Btexloop Team">Btexloop Team</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-brand-orange-dark hover:from-brand-orange-dark hover:to-primary shadow-orange text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Now - FREE"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/napps-ila-code-lookup">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Search className="mr-2 h-4 w-4" />
                  Already Registered? Check Your Access Code
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <div className="bg-card rounded-lg p-6 shadow-soft">
            <h3 className="font-semibold mb-4">Get in touch</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+234 813 122 6618, +234 903 218 8542</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@btexloopacademy.com.ng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
