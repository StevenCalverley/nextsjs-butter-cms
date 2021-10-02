import { getPreviewPostBySlug, getPreviewPageBySlug } from '@/lib/api';

export default async function preview(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (
    req.query.secret !== process.env.BUTTERCMS_PREVIEW_SECRET ||
    !req.query.slug ||
    !req.query.type
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  let post;
  let page;
  if (req.query.type === 'post') {
    // Fetch the headless CMS to check if the provided `slug` exists
    post = await getPreviewPostBySlug(req.query.slug);

    // If the slug doesn't exist prevent preview mode from being enabled
    if (!post) {
      return res.status(401).json({ message: 'Invalid slug' });
    }
  } else if (req.query.type === 'page') {
    // Fetch the headless CMS to check if the provided `slug` exists
    page = await getPreviewPageBySlug(req.query.slug);

    // If the slug doesn't exist prevent preview mode from being enabled
    if (!page) {
      return res.status(401).json({ message: 'Invalid slug' });
    }
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  if (req.query.type === 'post') {
    res.writeHead(307, { Location: `/posts/${post.slug}` });
  } else if (req.query.type === 'page') {
    res.writeHead(307, { Location: `/${page.slug}` });
  }
  res.end();
}
