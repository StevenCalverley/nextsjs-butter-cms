import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Container from '@/components/container';
import Header from '@/components/header';
import Layout from '@/components/layout';
import { getAllPagesWithSlug, getPage } from '@/lib/api';
import markdownStyles from '@/components/markdown-styles.module.css';

import Head from 'next/head';
import Image from 'next/image';
import { CMS_NAME } from '@/lib/constants';

function renderHero(hero) {
  if (!hero) return null;
  return (
    <div className="relative">
      <div className="absolute w-full h-96">
        <Image src={hero.image} layout="fill" className="object-cover" />
      </div>
    </div>
  );
}

export default function Page({ page, preview }) {
  const router = useRouter();

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
                  {page.name} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={page.featured_image} />
              </Head>

              <div>{renderHero(page.fields.hero)}</div>
              <div
                className={markdownStyles['markdown']}
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
