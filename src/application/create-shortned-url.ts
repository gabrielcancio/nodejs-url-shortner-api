import { ShortnedUrlRepository } from "./shortned-url-repository";
import { Alias } from "../domain/alias";
import { ShortnedURL } from "../domain/shortned-url";

class CreateShortnedUrl {
  constructor(private readonly shortnedUrlRepository: ShortnedUrlRepository) {}

  public async execute({ url, alias: aliasGivenByUser }: Input) {
    const alias = new Alias(aliasGivenByUser);
    const shortenedUrl = new ShortnedURL(url, alias);
    if(!alias.isEmpty()) {
      const shortnedUrlFromDatabase = await this.shortnedUrlRepository.getByShortnedUrl(shortenedUrl.get());
      if(shortnedUrlFromDatabase) throw new Error("The alias is already used");
    }

    const dto = {
      url, 
      generatedUrl: shortenedUrl.get(), 
      expiresAt: shortenedUrl.getExpirationDate(), 
      isAliased: !alias.isEmpty()
    }
    await this.shortnedUrlRepository.save(dto);
    return { generatedUrl: dto.generatedUrl, expiresAt: dto.expiresAt };
  }
}


type Input = {
  url: string;
  alias?: string;
}

export { CreateShortnedUrl };