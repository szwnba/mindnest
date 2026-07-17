import zh from "@/locales/zh.json";
import en from "@/locales/en.json";

export type Locale = "zh" | "en";

export const defaultLocale: Locale = "zh";
export const locales: Locale[] = ["zh", "en"];

const messagesMap: Record<Locale, Record<string, unknown>> = {
  zh,
  en,
};

export function getMessages(locale: Locale = defaultLocale) {
  return messagesMap[locale] ?? messagesMap[defaultLocale];
}
