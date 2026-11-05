import { content } from "@/content";
import { contentFr } from "@/content.fr";
import { testimonials, type Testimonial } from "@/testimonials";
import { testimonialsFr } from "@/testimonials.fr";
import type { Locale } from "./config";

export const getContent = (locale: Locale) => (locale === "fr" ? contentFr : content);

// Французские отзывы лежат по имени автора; порядок, фото и набор берутся из английского списка.
// Если перевода для кого-то нет, остаётся оригинал.
const testimonialsFrList: Testimonial[] = testimonials.map((t) => ({ ...t, ...testimonialsFr[t.name] }));

export const getTestimonials = (locale: Locale) => (locale === "fr" ? testimonialsFrList : testimonials);
