import React, { useEffect } from 'react'
import { Button } from '@/components'
import { BiSolidMessageDetail, BiSolidMessageEdit, BiSolidCommentX } from 'react-icons/bi'
import { CommentPromptProps } from '@/types'
import { toast } from 'react-hot-toast'
import useComment from '@/hooks/useComment'

const CommentPrompt: React.FC<CommentPromptProps> = ({ novel, novelId, mutate, replyingComment, setReplyingComment, editingComment, setEditingComment, cancelSend, messageBody, setMessageBody, parentMessageId, setParentMessageId, buttonSelection }) => {
   const { btnAction, selectedCommentId, handleCommentClick } = buttonSelection;
   const { addComment: replyComment } = useComment(novelId, replyingComment?.id);
   const { editComment: editComment } = useComment(undefined, editingComment?.id);

   const scrollToComment = (value: number) => {
      window.scrollTo({
         top: window.scrollY + value,
         behavior: 'smooth',
      });
   };
   
   useEffect(() => {
     if (replyingComment) {   
        setEditingComment(null);
        setParentMessageId(replyingComment.id);
        scrollToComment(250);
     }
   }, [replyingComment, setEditingComment, setParentMessageId]);

   useEffect(() => {
      if (editingComment) {
         setReplyingComment(null);
         setParentMessageId(editingComment.parentCommentId);
         setMessageBody(editingComment.content);
         scrollToComment(250);
      }
   }, [editingComment, setReplyingComment, setParentMessageId, setMessageBody]);

   const handleSend = async () => {
      try {
         if (!messageBody.trim()) {
            toast.error('Comment cannot be empty');
            return;
         }
         const commData: any = { 
            content: messageBody, 
            ...(parentMessageId && { parentCommentId: parentMessageId }),
         }
         if (replyingComment) {
            await replyComment(commData);
            toast.success('Comment replied successfully');
         } else if (editingComment) {
            await editComment(commData);
            toast.success('Comment updated successfully');
         }
         handleCommentClick(null, null);
         setEditingComment(null);
         setReplyingComment(null);
         setParentMessageId(null);
         setMessageBody('');
         mutate();
      } catch (error) {
         console.error('Error sending the comment:', error);
         toast.error(`Error: You need to be logged in.`)
      }
   };

  return (
    <div className="comment-prompt-container comment-prompt-separation">
      <div className="comment-prompt-input">
         <textarea id="comment" name="comment" className="comment-textarea" 
            placeholder={`💬 - What did you think of ❞ ${novel.title}❞ ? ...`} rows={4}
            value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
         {(selectedCommentId && btnAction === 'reply') 
            ? <p className="comment-tab"><span style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.25rem' }}>{btnAction} - {selectedCommentId}</span></p>
            : (selectedCommentId && btnAction === 'edit') 
            ? <p className="comment-tab"><span style={{ backgroundColor: '#eab308', color: 'white', padding: '0.25rem' }}>{btnAction} - {selectedCommentId}</span></p> 
            : null}
      </div>
      <div className="comment-prompt-buttons">
         {replyingComment && (<>
            <Button action={handleSend} rightIcon={<BiSolidMessageDetail size={24} />} tooltip='Reply to comment' additionalStyles={`button-comment-reply ${selectedCommentId && btnAction === 'reply' ? 'bg-btn-comment-100' : 'bg-btn-comment'}`} />
            <Button action={cancelSend} rightIcon={<BiSolidCommentX size={24} />} tooltip="Cancel reply" additionalStyles={`button-comment-delete ${selectedCommentId && btnAction === 'reply' ? 'bg-btn-comment-300' : 'bg-btn-comment'}`} />
         </>)}
         {editingComment && (<>
            <Button action={handleSend} rightIcon={<BiSolidMessageEdit size={24} />} tooltip='Update your comment' additionalStyles={`button-comment-edit ${selectedCommentId && btnAction === 'edit' ? 'bg-btn-comment-200' : 'bg-btn-comment'}`} />
            <Button action={cancelSend} rightIcon={<BiSolidCommentX size={24} />} tooltip="Cancel edit" additionalStyles={`button-comment-delete ${selectedCommentId && btnAction === 'edit' ? 'bg-btn-comment-300' : 'bg-btn-comment'}`} />
         </>)}
      </div>
    </div>
  )
}

export default CommentPrompt