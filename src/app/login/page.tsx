
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
import { checkUser, login } from "@/actions/auth";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const otpSchema = z.object({
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
  const [otpSent, setOtpSent] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function handleSendOtp(values: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    setEmail(values.email);
    const response = await checkUser(values.email);
    setIsLoading(false);

    if (response.exists) {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email (simulated).",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: response.error,
      });
    }
  }

  async function handleLogin(values: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    // In a real app, you'd verify the OTP. Here we just log in.
    const response = await login(email); 
    setIsLoading(false);

    if (response.success && response.user) {
      // Store user info in localStorage for this prototype
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: response.error,
      });
    }
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
                    {!otpSent
                        ? "Enter your email to receive an OTP."
                        : "Enter the OTP sent to your email."
                    }
                </CardDescription>
                </CardHeader>
                <CardContent>
                    {!otpSent ? (
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email ID</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin"/> : 'Send OTP'}
                            </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(handleLogin)} className="space-y-4">
                            <FormField
                                control={otpForm.control}
                                name="otp"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                    <Input type="text" placeholder="Enter your OTP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin"/> : 'Login'}
                            </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
