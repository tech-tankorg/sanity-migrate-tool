import type { NewsNewsLetter, OldNewsletter } from "../types/projectTypes";
import { new_newsletter } from "../constants/consts";

import { randomUUID } from "node:crypto";

interface Props {
  title: string;
  description: string;
  community_member_name?: string;
  community_member_description?: string;
}

const parseLink = (content: string) => {
  const regex = /<https:\/\/[^>]+>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const link = match[0].slice(1, -1).split("|");

    content = content.replace(match[0], `[${link[1]}](${link[0]})`);
  }

  return content;
};

const transformToMarkdown = (content: Props | Array<Props>) => {
  if (!Array.isArray(content)) {
    if (content === null) return "";

    const sanitize_description = parseLink(
      content.community_member_description ?? ""
    );
    return `This month's community highlight goes to ${content.community_member_name}!!\n\n${sanitize_description}`;
  }

  return content
    .map((item) => {
      const sanitize_description = parseLink(item.description);

      return `### ${item.title}\n\n${sanitize_description}`;
    })
    .join("\n");
};

export const transform = (old_newsletter: OldNewsletter): NewsNewsLetter => {
  const community_highlight = transformToMarkdown(
    old_newsletter.letter_member_highlight
  );

  const letter_info = transformToMarkdown(old_newsletter.letter_info);
  const letter_fyi = transformToMarkdown(old_newsletter.letter_fyi);

  const content = `## Community highlight \n${community_highlight} \n## In case you missed it \n${letter_info}\n## For you Information\n${letter_fyi}`;

  new_newsletter.scheduled_date = old_newsletter.scheduled_post_date;
  new_newsletter.title = old_newsletter.letter_title;
  new_newsletter.description = old_newsletter.letter_description;
  new_newsletter.slug = old_newsletter.slug;
  new_newsletter.content = content.replace("\n", "");
  new_newsletter._id = randomUUID();
  return new_newsletter;
};
