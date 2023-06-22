import "dotenv/config";
import crypto from "node:crypto";
import { ShortnedUrlRepository } from "./shortned-url-repository";

class CreateShortnedUrl {
  private URL_DURATION_TIME = 30;
  private BASE_URL = process.env.BASE_URL;
  constructor(private readonly shortnedUrlRepository: ShortnedUrlRepository) {}

  public async execute({ url, alias }: Input) {
    if(!url) throw new Error("The url should not be empty");
    if(this.isAliasAnEmptyString(alias)) throw new Error("The alias passed should not be empty");
    const generatedUrl = this.getNewUrl(url, alias);
    const isAliased = !!alias;
    if(isAliased) {
      const shortnedUrl = await this.shortnedUrlRepository.getByShortnedUrl(generatedUrl);
      if(shortnedUrl) throw new Error("The alias is already used");
    }
    const expiresAt = this.getExpirationDate();
    await this.shortnedUrlRepository.save({ url, generatedUrl, expiresAt, isAliased });
    return { generatedUrl, expiresAt };
  }

  private isAliasAnEmptyString(alias?: string) {
    return typeof alias === "string" && alias.length === 0;
  }

  private getNewUrl(url: string, alias?: string) {
    if(!alias) return this.normalizeGeneratedUrl(this.createUrlHash(url));
    const sanitazedAlias = alias.trim().replace(/\s+/g, '-');
    return this.normalizeGeneratedUrl(sanitazedAlias);
  }

  private normalizeGeneratedUrl(urlHash: string) {
    return `${this.BASE_URL}/${urlHash}`;
  }

  private createUrlHash(url: string) {
    const toHash = `${url}-${crypto.randomUUID()}`
    const hashedUrl = crypto.createHash("sha256")
      .update(toHash)
      .digest();
    
    const hashEncodedInBase62 = this.encodeInBase62(hashedUrl);
    return hashEncodedInBase62.slice(0, 7);
  }

  private encodeInBase62(content: Buffer) {
    const BASE = 62;
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let contentToInt = this.bufferToInteger(content);
    let encodedContent = "";
    while(contentToInt > 0) {
      const rest = contentToInt % BASE;
      contentToInt = Math.floor(contentToInt / BASE);
      encodedContent += charset[rest]; 
    }
    encodedContent = encodedContent.split('').reverse().join('');
    return encodedContent;
  }

  private bufferToInteger(content: Buffer) {
    const hexadecimalString = content.toString("hex");
    return parseInt(hexadecimalString, 16);
  }

  private getExpirationDate() {
    const date = new Date();
    const futureDate = date.getUTCDate() + this.URL_DURATION_TIME;
    date.setUTCDate(futureDate);
    return date.toISOString();
  }
}


type Input = {
  url: string;
  alias?: string;
}

export { CreateShortnedUrl };