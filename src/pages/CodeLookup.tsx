import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, CheckCircle, XCircle, Phone, Mail } from "lucide-react";

const CodeLookup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; code?: string } | null>(null);
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your registered email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("access_code")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setResult({ found: true, code: data.access_code });
      } else {
        setResult({ found: false });
      }
    } catch (error) {
      console.error("Error looking up code:", error);
      toast({
        title: "Error",
        description: "An error occurred while looking up your access code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Access Code Lookup
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your registered email to check your access code for the NAPPS ILA Tech Workshop
          </p>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Find Your Access Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Registered Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-brand-orange-dark hover:from-brand-orange-dark hover:to-primary shadow-orange"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Access Code
                  </>
                )}
              </Button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 rounded-lg border">
                {result.found ? (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      Access Code Found!
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-600 mb-2">Your access code is:</p>
                      <p className="text-2xl font-bold text-green-700 tracking-wider">
                        {result.code}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please save this code. You'll need it to enter the workshop.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                      No Registration Found
                    </h3>
                    <p className="text-sm text-red-600 mb-4">
                      We couldn't find a registration for this email address.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Register Now
                    </Button>
                  </div>
                )}
              </div>
            )}
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

export default CodeLookup;