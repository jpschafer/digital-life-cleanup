import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function HomePage() {
  const [pages, setPages] = React.useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPages() {
      setLoading(true);
      const { api } = window as any;
      const pages = await api.fetchLikedPages();
      setPages(pages);
      setLoading(false);
    }
    fetchPages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head>
        <title>Facebook Liked Pages</title>
      </Head>
      <h1 className="text-3xl font-bold text-center mb-6">Facebook Liked Pages</h1>
      
      {loading ? (
        <div className="text-center text-xl font-semibold">Loading pages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(pages).map(([category, pages]) => (
            <div key={category} className="bg-white shadow-lg rounded-2xl p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">{category}</h2>
              <div className="space-y-4">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center space-x-4 border-b pb-2 last:border-b-0">
                    <Image src={page.pictureUrl} alt={page.name} width={50} height={50} className="rounded-full" />
                    <a href={page.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{page.name}</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
