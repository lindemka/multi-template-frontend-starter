'use client';

import React, { useState, useEffect } from 'react';
import Feed from '@/components/feed/Feed';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    author: {
        id: number;
        username: string;
        email: string;
        displayName: string;
        avatarUrl?: string;
        title?: string;
        company?: string;
    };
    likeCount: number;
    commentCount: number;
    shareCount: number;
    comments: any[];
    createdAt: string;
    updatedAt: string;
    liked: boolean;
    saved: boolean;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

    // Temporarily bypass authentication for testing
    useEffect(() => {
        setAuthStatus('authenticated');
    }, []);

    const fetchPosts = async (pageNum = 0, append = false) => {
        try {
            console.log('Fetching posts...');
            const response = await fetch(`/api/feed/posts?page=${pageNum}&size=10`);

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            console.log('Posts response:', data);

            if (data.success) {
                const newPosts = data.data.posts;
                console.log('New posts:', newPosts);
                if (append) {
                    setPosts(prev => [...prev, ...newPosts]);
                } else {
                    setPosts(newPosts);
                }
                setHasMore(data.data.hasNext);
                setPage(pageNum);
            } else {
                throw new Error(data.message || 'Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchPosts(page + 1, true);
        }
    };

    const refreshFeed = () => {
        setRefreshing(true);
        setPage(0);
        setHasMore(true);
        fetchPosts(0, false);
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
        setShowCreateModal(false);
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts(prev => prev.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));
    };

    const handlePostDeleted = (postId: number) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
    };

    const handleLikeToggle = async (postId: number) => {
        try {
            const response = await fetch(`/api/feed/posts/${postId}/like`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            // Update the post in the local state
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !post.liked,
                        likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentCreated = (postId: number, newComment: any) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [newComment, ...post.comments],
                    commentCount: post.commentCount + 1,
                };
            }
            return post;
        }));
    };

    const handleCommentDeleted = (postId: number, commentId: number) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter(comment => comment.id !== commentId),
                    commentCount: post.commentCount - 1,
                };
            }
            return post;
        }));
    };

    const handleShare = async (postId: number, platform = 'internal') => {
        try {
            const response = await fetch(`/api/feed/posts/${postId}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sharePlatform: platform }),
            });

            if (!response.ok) {
                throw new Error('Failed to share post');
            }

            // Update share count
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        shareCount: post.shareCount + 1,
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    useEffect(() => {
        if (authStatus === 'authenticated') {
            fetchPosts();
        }
    }, [authStatus]);

    // Show loading while checking authentication
    if (authStatus === 'checking') {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (authStatus === 'unauthenticated') {
        return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Feed</h1>
                    <p className="text-muted-foreground">Stay updated with the latest posts from your network</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshFeed}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                    </Button>
                </div>
            </div>

            {/* Feed Content */}
            {loading && posts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading posts...</p>
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Be the first to share something with your network!
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Post
                    </Button>
                </div>
            ) : (
                <Feed
                    posts={posts}
                    onLike={handleLikeToggle}
                    onComment={handleCommentCreated}
                    onShare={handleShare}
                    onPostUpdate={handlePostUpdated}
                    onPostDelete={handlePostDeleted}
                    onCommentDelete={handleCommentDeleted}
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    loading={loading}
                />
            )}

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}
        </div>
    );
}
