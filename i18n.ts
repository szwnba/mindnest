import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "zh";
  const messages = (await import(`./locales/${locale}.json`)).default;
  return {
    locale,
    messages,
    timeZone: "Asia/Shanghai",
  };
});
