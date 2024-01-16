/**
 * separate types file since we use this on the homepage to type
 * the env var "import" but also so that the generating script
 * can conform to that type
 *
 * (and avoid importing the JSON inadvertently in our web build)
 */

export type PreviewData = {
  martyrListCount: number;
  lastDailyUpdate: string;
  martyred: {
    total: number;
    press: number;
    medical: number;
  };
  injured: {
    total: number;
  };
};