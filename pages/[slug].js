import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Container from '@/components/container';
import Header from '@/components/header';
import Layout from '@/components/layout';
import { getAllPagesWithSlug, getPage } from '@/lib/api';

import Head from 'next/head';
import { CMS_NAME } from '@/lib/constants';

export default function Pge({ page, preview }) {
  const router = useRouter();
  console.log(!router.isFallback);
  console.log(!page?.slug);
  if (!router.isFallback && !page?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <div>Loading…</div>
        ) : (
          <>
            <section>
              <Head>
                <title>
                  {page.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={page.featured_image} />
              </Head>

              <div>{page.name}</div>
              <div
                dangerouslySetInnerHTML={{ __html: page.fields.readme }}
              ></div>
            </section>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = null }) {
  const page = await getPage(params.slug, preview);

  return {
    props: {
      preview,
      page,
    },
  };
}

export async function getStaticPaths() {
  const allPages = await getAllPagesWithSlug();
  const paths = allPages?.map((page) => ({ params: { slug: page.slug } }));
  return {
    paths: paths || [],
    fallback: false,
  };
}
