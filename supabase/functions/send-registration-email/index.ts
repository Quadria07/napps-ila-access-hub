import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationEmailRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  schoolName: string;
  position: string;
  lgaTown: string;
  howHeard: string;
  accessCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const registrationData: RegistrationEmailRequest = await req.json();

    console.log("Processing registration email for:", registrationData.email);

    // Send copy to admin (btexloopacademy@gmail.com)
    const adminEmailResponse = await resend.emails.send({
      from: "NAPPS ILA Workshop <noreply@btexloopacademy.com.ng>",
      to: ["btexloopacademy@gmail.com"],
      subject: "New Workshop Registration - NAPPS ILA Tech Workshop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF7947; border-bottom: 2px solid #FF7947; padding-bottom: 10px;">
            New Registration for NAPPS ILA Tech Workshop
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Registration Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Full Name:</td>
                <td style="padding: 8px 0;">${registrationData.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${registrationData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${registrationData.phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">School:</td>
                <td style="padding: 8px 0;">${registrationData.schoolName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Position:</td>
                <td style="padding: 8px 0;">${registrationData.position}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">LGA/Town:</td>
                <td style="padding: 8px 0;">${registrationData.lgaTown}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">How They Heard:</td>
                <td style="padding: 8px 0;">${registrationData.howHeard}</td>
              </tr>
              <tr style="background-color: #FF7947; color: white;">
                <td style="padding: 12px 8px; font-weight: bold;">Access Code:</td>
                <td style="padding: 12px 8px; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${registrationData.accessCode}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #FF7947;">
            <p style="margin: 0; color: #333;">
              <strong>Note:</strong> This registration was automatically processed through the workshop registration system.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>NAPPS ILA Tech Workshop for Proprietors</p>
            <p>Organized by Btexloop Academy</p>
            <p>📞 +234 813 122 6618, +234 903 218 8542 | 📧 info@btexloopacademy.com.ng</p>
          </div>
        </div>
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Failed to send admin notification:", adminEmailResponse.error);
      throw adminEmailResponse.error;
    }

    console.log("Admin notification sent successfully:", adminEmailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Registration email sent successfully",
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-registration-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send registration email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);