import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';

        // Extract access token from cookies
        const accessToken = cookies
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];

        const response = await fetch(
            `http://localhost:8080/api/feed/posts/${params.postId}/comments?page=${page}&size=${size}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to fetch comments' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

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
            `http://localhost:8080/api/feed/posts/${params.postId}/comments`,
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
                { error: data.message || 'Failed to create comment' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
