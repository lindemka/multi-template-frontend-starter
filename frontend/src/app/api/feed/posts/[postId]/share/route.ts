import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        // Check for access token in cookies
        const cookies = request.headers.get('cookie') || '';
        const hasAccessToken = cookies.includes('accessToken=');
        
        if (!hasAccessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Extract access token from cookies
        const accessToken = cookies
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        const response = await fetch(
            `http://localhost:8080/api/feed/posts/${params.postId}/share`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to share post' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sharing post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
