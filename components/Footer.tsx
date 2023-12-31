import Link from 'next/link'
import Image from 'next/image'
import { FOOTER_LINKS } from '@/constants'
import { FooterProps } from '@/types'

const Footer: React.FC<FooterProps> = ({ bgLight, extraWrapper = false, borderTop = true }) => (
   <div className={`${extraWrapper && "footer-extra"}`}>
      <footer className={`flex flex-col ${bgLight ? "text-gray-600" : "text-gray-300"} ${borderTop && "mt-5 border-t border-gray-400"}`}>
         {/* Logo & Links */}
         <div className="flex max-md:flex-col flex-wrap justify-between sm:px-16 px-6 pb-1 pt-6 md:pt-8">
            <div className="flex flex-col md:justify-start md:items-start items-center gap-1">
               <Image src='/images/logo.png' alt='logo' width={100} height={20} className="object-contain w-auto h-auto" priority />
               <div className="flex flex-col md:items-start items-center">
                  <p className={`text-base ${bgLight ? "text-gray-700" : "text-gray-200"}`}>Vlads Novels &copy;</p>
                  <p className={`text-xl font-bold" ${bgLight ? "text-gray-800" : "text-gray-100"}`}>Vladislav Surnin</p>
               </div>
            </div>
            <div className="footer__links">
               {FOOTER_LINKS.map((item) => (
                  <div key={item.title} className="footer__link">
                     <h3 className="font-bold text-base sm:text-lg md:text-xl">{item.title}</h3>
                     <div className="flex flex-col gap-2 md:gap-4">
                        {item.links.map((link) => (
                           <Link key={link.title} href={link.url} className="text-gray-500 text-sm sm:text-base">{link.title}</Link>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
         {/* Terms & Condition */}
         <div className="footer__bottom-container">
            <p className={bgLight ? "text-gray-400 md:text-base text-sm" : "text-gray-200"}>@2023 Vlads Novels. All rights reserved</p>
            <div className="footer__copyrights-link md:text-base text-sm">
               <Link href="/" className={bgLight ? "text-gray-400" : "text-gray-200"}>Privacy & Policy</Link>
               <Link href="/" className={bgLight ? "text-gray-400" : "text-gray-200"}>Terms & Condition</Link>
            </div>
         </div>
      </footer>
   </div>
)

export default Footer