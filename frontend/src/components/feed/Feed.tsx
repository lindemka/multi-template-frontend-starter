'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import FeedPost from './FeedPost';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  posts: any[];
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: any) => void;
  onShare: (postId: number, platform?: string) => void;
  onPostUpdate?: (post: any) => void;
  onPostDelete?: (postId: number) => void;
  onCommentDelete?: (postId: number, commentId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
}

const Feed: React.FC<FeedProps> = ({
  posts,
  onLike,
  onComment,
  onShare,
  onPostUpdate,
  onPostDelete,
  onCommentDelete,
  onLoadMore,
  hasMore = false,
  loading = false,
  className = ''
}) => {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const handleSave = (postId: number) => {
    console.log('Save post:', postId);
    // TODO: Implement save functionality
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {posts?.map((post, index) => {
        const isLastElement = index === (posts?.length || 0) - 1;

        return (
          <div key={post.id} ref={isLastElement ? lastElementRef : null}>
            <FeedPost
              post={post}
              onLike={() => onLike(post.id)}
              onComment={(comment) => onComment(post.id, comment)}
              onShare={(platform) => onShare(post.id, platform)}
              onSave={() => handleSave(post.id)}
              onUpdate={onPostUpdate ? () => onPostUpdate(post) : undefined}
              onDelete={onPostDelete ? () => onPostDelete(post.id) : undefined}
              onCommentDelete={onCommentDelete ? (commentId) => onCommentDelete(post.id, commentId) : undefined}
            />
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <Button variant="outline" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}

      {!loading && !hasMore && (posts?.length || 0) > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>You've reached the end of the feed</p>
        </div>
      )}
    </div>
  );
};

export default Feed;