import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { IoMdArrowRoundBack, IoMdArrowRoundForward, IoIosExit } from 'react-icons/io'
import { SanitizedText, NotFound, LoaderLight, Button, NoItem, DarkMode } from '@/components'
import { getUserSessionServerSideProps } from '@/lib/sessionProps'
import { formatPageContent } from '@/lib/regexPage'
import { WORDS_PER_PAGE } from '@/constants'
import useNovel from '@/hooks/useNovel'

import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '@/pages/_app'
import { ProfileProps } from '@/types'
import { metadata } from '@/pages/_app'
import RootLayout from '@/pages/_layout'
import ProfileLayout, { metadataProfile } from '../_layout'

// Protecting routes by fetching user session on client side
export const getServerSideProps = getUserSessionServerSideProps;

const LoungeId: NextPageWithLayout<ProfileProps> = ({ session }) => {
   const router = useRouter();
   const { novelId, page } = router.query as { novelId: string; page?: string };
   const { data, isLoading, error } = useNovel(novelId as string);

   const currentPage = parseInt(page as string, 10) || 1;
   const { startIndex, endIndex, currentPageContent } = formatPageContent({ currentPage, data });
  
   useEffect(() => {
      if (!isNaN(currentPage) && (currentPage < 1 || isNaN(startIndex) || startIndex >= data?.content?.length)) {
        router.push(`/profile/lounge/${novelId}`);
      }
   }, [currentPage, startIndex, novelId, data, router]);

   const paragraphs = typeof currentPageContent === 'string' ? currentPageContent.split('\n') : [currentPageContent];

   if (!novelId) { return null }
   if (error) { return <NotFound/> }
   if (isLoading) { return <LoaderLight /> }
   
  return (
    <div className="bg-primary-light pt-20">
      <div className="novel-id-container">
         <div className="novel-id-content">
            <div className="novel-id-header">
               <div className="flex items-center justify-center gap-1">
                  <Button title="Comment" btnType="button" action={() => router.push(`/profile/blog/${data?.id}`)} additionalStyles='button-lounge' leftIcon={<IoIosExit size={23} />} />
                  <DarkMode novelId={novelId} />
               </div>
               <div className="novel-id-title">{data?.title || 'N/A'}</div>
            </div>
            {currentPage === 1 && data?.quote && (
               <div className="novel-id-quote">{data.quote}</div>
            )}
            {paragraphs.length > 0 ?
               <div className="prose lg:prose-xl mt-2">
                  {paragraphs.map((paragraph, index) => (
                     <SanitizedText key={index} paragraph={paragraph}/>
                  ))}
               </div> :
               <div className="novel-id-no-container">
                  <p className="novel-id-no-content">No content available for the current page.</p>
                  <NoItem variation={'nn'} linkHref="/profile/lounge" title="No Novel Content" description="The selected novel has no content yet." imageSrc="/images/nonovel.png" imageAlt="No Novel Id" />
               </div>}
         </div>
         <div className="novel-id-pagination">   
            <Button title="Previous Page" btnType="button" isDisabled={currentPage === 1} action={() => router.push(`/profile/lounge/${novelId}?page=${currentPage - 1}`)} additionalStyles="button-pagination" leftIcon={<IoMdArrowRoundBack size={23} />} />
            <span className="text-gray-600">Page {currentPage} of {Math.ceil(data?.content?.length / WORDS_PER_PAGE)}</span>
            <Button title="Next Page" btnType="button" isDisabled={endIndex >= data?.content?.length} action={() => router.push(`/profile/lounge/${novelId}?page=${currentPage + 1}`)} additionalStyles="button-pagination" rightIcon={<IoMdArrowRoundForward size={23} />} />
         </div>
      </div>
    </div>
  )
}

LoungeId.getLayout = function getLayout(page: ReactElement, props: ProfileProps) {
   return (
      <RootLayout metadata={metadata}>
         <ProfileLayout layoutMetadata={metadataProfile || metadata} session={props.session}>{page}</ProfileLayout>
      </RootLayout>
   )
}

export default LoungeId