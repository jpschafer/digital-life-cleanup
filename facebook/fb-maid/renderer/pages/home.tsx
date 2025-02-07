import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [pages, setPages] = React.useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = React.useState(true); // 🔹 Add loading state

  React.useEffect(() => {
    async function fetchPages() {
      setLoading(true); // Start loading
      const { api } = window as any;
      const pages = await api.fetchLikedPages(); // Wait for the response
      setPages(pages); // Set the data
      setLoading(false); // Stop loading
    }
    fetchPages();
  }, []);

  return (
      <div className="container">
          <h1>Facebook Liked Pages</h1>
          
          {loading ? (
              // 🔹 Show a loading spinner while fetching
              <div className="loader">
                  <p>Loading pages...</p>
              </div>
          ) : (
              Object.entries(pages).map(([category, pages]) => (
                  <div key={category}>
                      <h2>{category}</h2>
                      <ul>
                          {pages.map((page) => (
                              <li key={page.id}>
                                  <a href={page.link} target="_blank">{page.name}</a>
                              </li>
                          ))}
                      </ul>
                  </div>
              ))
          )}

          <style jsx>{`
              .container {
                  padding: 20px;
                  text-align: center;
              }
              .loader {
                  font-size: 18px;
                  font-weight: bold;
              }
          `}</style>
      </div>
  );
}
