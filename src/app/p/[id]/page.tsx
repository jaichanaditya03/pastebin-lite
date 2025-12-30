import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export default async function PastePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const headersList = headers();
  const host = headersList.get('host');
  const protocol =
    headersList.get('x-forwarded-proto') ?? 'https';

  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const paste = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Paste</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              {paste.remaining_views !== null && (
                <div className="flex items-center">
                  <span className="font-medium">Remaining views:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {paste.remaining_views}
                  </span>
                </div>
              )}
              {paste.expires_at && (
                <div className="flex items-center">
                  <span className="font-medium">Expires at:</span>
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    {new Date(paste.expires_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-900">
              {paste.content}
            </pre>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
            >
              Create New Paste
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
