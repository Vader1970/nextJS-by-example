import { readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";

export interface Review {
  slug: string;
  title: string;
  date: string;
  image: string;
  body: string;
}

export async function getReview(slug: string): Promise<Review> {
  const text = await readFile(`./content/reviews/${slug}.md`, "utf8");
  const {
    content,
    data: { title, date, image },
  } = matter(text);
  const body = await marked(content);
  return { slug, title, date, image, body };
}

export async function getReviews(): Promise<Review[]> {
  const files = await readdir("./content/reviews");
  const slugs = files.filter((file) => file.endsWith(".md")).map((file) => file.slice(0, -".md".length));
  //   console.log("files:", files);
  //   console.log("slugs:", slugs);
  const reviews: Review[] = [];
  for (const slug of slugs) {
    const review = await getReview(slug);
    reviews.push(review);
  }
  return reviews;
}
