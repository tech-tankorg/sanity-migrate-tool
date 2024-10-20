import { transform } from "../utils/parsers/newsletter_transformer";
import type {
  OldNewsletter,
  NewsNewsLetter,
} from "../utils/types/projectTypes";

import { createClient } from "@sanity/client";

import { config } from "dotenv";
import { writeFileSync } from "fs";

config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATA_SET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: "2021-10-21", // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

const uploadContent = async (newsletter: NewsNewsLetter) => {
  const mutations = [
    {
      createOrReplace: newsletter,
    },
  ];

  try {
    const upload = await fetch(
      `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2024-09-05/data/mutate/${process.env.SANITY_DATA_SET}`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.NEW_SANITY_AUTHTOKEN}`,
        },
        body: JSON.stringify({ mutations }),
      }
    );
    console.log(upload);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

const writeFile = (content: string, name: string) => {
  writeFileSync(`./out/${name}.json`, content);
};

const handler = async () => {
  const date = "2024-08-01";
  const query = `*[_type=="letter" && scheduled_post_date=="${date}"]{letter_info[]->{title,description,images},letter_fyi[]->{title,description},letter_title,letter_description,"slug":letter_slug.current,scheduled_post_date,letter_member_highlight, letter_tech_insights[]->{title,description}}`;

  const results = await client.fetch(query);

  const newsletter = results[0] as OldNewsletter;

  const new_newsletter = transform(newsletter);

  writeFile(JSON.stringify(new_newsletter), date);
};

handler();
