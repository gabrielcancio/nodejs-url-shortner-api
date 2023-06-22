export interface ShortnedUrlRepository {
  save(params: { url: string, generatedUrl: string; expiresAt: string; isAliased: boolean}): Promise<void>;
  getByShortnedUrl(shortnedUrl: string): Promise<object | undefined>;
}