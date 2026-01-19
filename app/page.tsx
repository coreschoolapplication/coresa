"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const onboardingSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  teamSize: z
    .string()
    .min(1, "Team size is required")
    .refine((value) => Number(value) > 0, "Team size must be greater than 0")
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const fetchHighlights = async () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        "Unified workspace for projects, tasks, and insights",
        "Real-time analytics powered by TanStack Query",
        "Guided onboarding with RHF + Zod validation"
      ]);
    }, 400);
  });
};

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ["highlights"],
    queryFn: fetchHighlights
  });

  const defaultValues = useMemo(
    () => ({
      companyName: "",
      email: "",
      teamSize: ""
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues
  });

  const onSubmit = (values: OnboardingFormValues) => {
    console.log("Onboarding submitted", values);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Coresa Frontend
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Launch a complete client experience with Next.js, Tailwind, and shadcn/ui.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            This starter UI ships with production-ready building blocks: TanStack Query for data
            workflows, React Hook Form with Zod validation, and accessible components powered by
            shadcn/ui.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Start onboarding</Button>
            <Button variant="outline">View documentation</Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Product highlights</CardTitle>
              <CardDescription>Powered by TanStack Query.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {(data ?? ["Loading highlights..."]).map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-md border border-border bg-background p-4 text-sm"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Swap the query function with your API client to stream real data into the UI.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding form</CardTitle>
              <CardDescription>Validated with React Hook Form + Zod.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input id="companyName" placeholder="Coresa Labs" {...register("companyName")} />
                  {errors.companyName ? (
                    <p className="text-xs text-red-500">{errors.companyName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="team@company.com" {...register("email")} />
                  {errors.email ? (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Input id="teamSize" type="number" placeholder="12" {...register("teamSize")} />
                  {errors.teamSize ? (
                    <p className="text-xs text-red-500">{errors.teamSize.message}</p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full">
                  Submit onboarding
                </Button>
                {isSubmitSuccessful ? (
                  <p className="rounded-md border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
                    Thanks! Your onboarding details were captured.
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
