"use client";

import { useState } from "react";
import { Send, Mail, Phone, MapPin, Globe } from "lucide-react";
import { LinkedIn } from "@/components/ui/icons/LinkedIn";
import { GitHub } from "@/components/ui/icons/GitHub";
import { getProfile } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { ContactForm } from "@/lib/types";

export function Contact() {
  const profile = getProfile();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <SectionWrapper id="contact">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Get In Touch
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Open for freelance opportunities, collaborations, and interesting projects.
        </p>
      </AnimatedSection>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Contact Info */}
        <AnimatedSection delay={0.1}>
          <div className="space-y-8">
            <ContactInfoItem
              icon={<Mail size={20} />}
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            <ContactInfoItem
              icon={<Phone size={20} />}
              label="Phone"
              value={profile.phone}
              href={`tel:${profile.phone}`}
            />
            <ContactInfoItem
              icon={<MapPin size={20} />}
              label="Location"
              value={profile.location}
            />

            <div className="mt-8 flex gap-3">
              <SocialButton
                href={profile.socialLinks.linkedin}
                icon={<LinkedIn className="h-[18px] w-[18px]" />}
                label="LinkedIn"
              />
              <SocialButton
                href={profile.socialLinks.github}
                icon={<GitHub className="h-[18px] w-[18px]" />}
                label="GitHub"
              />
              <SocialButton
                href={profile.socialLinks.portfolio}
                icon={<Globe size={18} />}
                label="Portfolio"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="rounded-default border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] md:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full rounded-default border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-default border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={5}
                  className="w-full resize-none rounded-default border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>

              {status === "success" && (
                <p className="text-center text-sm text-primary">
                  Message sent successfully!
                </p>
              )}

              {status === "error" && (
                <p className="text-center text-sm text-error">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}

function ContactInfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-on-surface">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group transition-colors duration-200 hover:text-primary"
      >
        {content}
      </a>
    );
  }

  return content;
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-on-surface-variant transition-all duration-300 hover:border-primary/40 hover:text-primary"
    >
      {icon}
    </a>
  );
}