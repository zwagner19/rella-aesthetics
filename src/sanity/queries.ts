import { groq } from "next-sanity";

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    "authorName": author->name
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    coverImage,
    seoTitle,
    seoDescription,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    "author": author-> {
      name,
      role,
      credentials,
      photo
    }
  }
`;

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(category asc, name asc) {
    _id,
    name,
    slug,
    category,
    shortDescription,
    heroImage,
    "locationNames": locations[]->name
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    category,
    shortDescription,
    heroImage,
    whatItIs,
    whoItsFor,
    whatToExpect,
    pricing,
    faq,
    seoTitle,
    seoDescription,
    "locationNames": locations[]->name
  }
`;

export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    credentials,
    bio,
    photo,
    "locationNames": locations[]->name
  }
`;

export const allLocationsQuery = groq`
  *[_type == "location"] {
    _id,
    name,
    slug,
    address,
    city,
    state,
    zip,
    phone,
    email,
    hours,
    mapEmbed,
    image,
    "serviceNames": services[]->name
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description
  }
`;
