export type MigratedMedia = {
  originalUrl: string; localPath: string; originalFilename: string; filename: string;
  section: MediaSection; fileType: string; width: number; height: number; bytes: number;
  appearsCompressed: boolean; originalRecommended: boolean; confidence: "high" | "low"; intendedUse: string;
};
export type MediaSection = "homepage" | "beyond-rendering" | "profile" | "oaya" | "architecture-of-sustenance" | "bio-design" | "unclassified";

export const carrdMedia: MigratedMedia[] = [];

export const externalMedia = [] as const;

export function mediaFor(section: MediaSection, index = 0) {
  const asset = carrdMedia.filter((item) => item.section === section)[index];
  return asset ? "/" + asset.localPath.replace(/^public\//, "") : undefined;
}
