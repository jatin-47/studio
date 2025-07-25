
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login, sendOtp } from "@/actions/auth";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
});

const DrishtiLogo = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M12 2.25C6.072 2.25 2.25 4.095 2.25 8.625V15.375C2.25 19.905 6.072 21.75 12 21.75C17.928 21.75 21.75 19.905 21.75 15.375V8.625C21.75 4.095 17.928 2.25 12 2.25Z"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function handleSendOtp() {
    const email = form.getValues("email");
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      form.setError("email", { message: "Please enter a valid email address." });
      return;
    }
    
    setIsSendingOtp(true);
    const response = await sendOtp(email);
    if (response.success) {
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "A mock OTP has been sent (use 123456)." });
    } else {
      toast({ variant: "destructive", title: "Error", description: response.error });
    }
    setIsSendingOtp(false);
  }

  async function handleLogin(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await login(values.email, values.otp);

    if (response.success) {
        router.push("/");
    } else {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: response.error,
        });
    }
    setIsLoading(false);
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40">
        <div className="flex flex-col items-center justify-center space-y-4">
            <a href="#" className="flex items-center gap-2 font-semibold font-headline text-2xl mb-4">
                <DrishtiLogo />
                <span>Drishti</span>
            </a>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your email to receive an OTP to login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                          <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Email ID</FormLabel>
                                  <div className="flex gap-2">
                                      <FormControl>
                                      <Input placeholder="Enter your email" {...field} disabled={otpSent || isSendingOtp} />
                                      </FormControl>
                                      <Button type="button" onClick={handleSendOtp} disabled={isSendingOtp || otpSent}>
                                          {isSendingOtp ? <Loader2 className="animate-spin"/> : (otpSent ? 'Sent' : 'Send OTP')}
                                      </Button>
                                  </div>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />

                          {otpSent && (
                              <FormField
                                  control={form.control}
                                  name="otp"
                                  render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>One-Time Password</FormLabel>
                                      <FormControl>
                                      <Input type="text" placeholder="Enter your OTP" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
                          )}
                          <Button type="submit" className="w-full" disabled={isLoading || !otpSent}>
                              {isLoading ? <Loader2 className="animate-spin"/> : 'Login'}
                          </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
