import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar, NotFound, LoaderLight, CommentPrompt, CommentList, BookAnimation, Footer } from '@/components'
import useNovel from '@/hooks/useNovel'
import { getUserSessionServerSideProps } from '@/lib/sessionProps'
import type { NextPageWithLayout } from '@/pages/_app'
import { ProfileProps, CommentProps, ButtonAction } from '@/types'
import useCommentList from '@/hooks/useCommentList'

// Protecting routes by fetching user session on client side
export const getServerSideProps = getUserSessionServerSideProps;

const BlogId: NextPageWithLayout<ProfileProps>  = ({ session }) => {
   const router = useRouter();
   const novelId = router.query.novelId as string;

   const { data: fetchedNovel, isLoading: loadNovel, error: errorNovel } = useNovel(novelId);
   const { data: fetchedComments, isLoading: loadComments, mutate: mutateComments } = useCommentList();

   const [messageBody, setMessageBody] = useState('');
   const [parentMessageId, setParentMessageId] = useState<string | null>(null);

   const [editingComment, setEditingComment] = useState<CommentProps | null>(null);
   const [replyingComment, setReplyingComment] = useState<CommentProps | null>(null);
   const handleEdit = (comment: CommentProps) => setEditingComment(comment);
   const handleReply = (comment: CommentProps) => setReplyingComment(comment);
   
   const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
   const [btnAction, setBtnAction] = useState<ButtonAction>(null);
   const handleCommentClick = (commentId: string | null, action: ButtonAction) => {
      setSelectedCommentId(commentId);
      setBtnAction(action);
   };

   const cancelSend = () => {
      setParentMessageId(null);
      setEditingComment(null);
      setReplyingComment(null);   
      setSelectedCommentId(null);
      setBtnAction(null);
      setMessageBody('');
   };

   if (errorNovel || !novelId) { return <NotFound/> }
   if (loadNovel) { return <LoaderLight /> } 

  return (
    <div className='pt-20 bg-primary-lighter'>
      <Navbar isUser={!!session?.email} isAdmin={!!session?.adminId} />
      <BookAnimation novel={fetchedNovel} />
      <CommentList 
         comments={fetchedComments} 
         loading={loadComments} 
         mutate={mutateComments} 
         onReply={handleReply}
         onEdit={handleEdit}
         authUser={session.id}
         buttonSelection={{
            handleCommentClick,
            selectedCommentId,
            btnAction,
         }} />
      <CommentPrompt 
         novel={fetchedNovel}
         mutate={mutateComments} 
         replyingComment={replyingComment}
         setReplyingComment={setReplyingComment}
         editingComment={editingComment} 
         setEditingComment={setEditingComment}
         cancelSend={cancelSend}
         authUser={session.id} 
         messageBody={messageBody}
         setMessageBody={setMessageBody}
         parentMessageId={parentMessageId}
         setParentMessageId={setParentMessageId}
         buttonSelection={{
            handleCommentClick,
            selectedCommentId,
            btnAction,
         }} />
      <div className="preview-footer"><Footer bgLight={true} /></div>
    </div>
  )
}

export default BlogId